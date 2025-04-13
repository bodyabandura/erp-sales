import { Order, TaxType } from "../../domain/entities/Order";
import { OrderItem } from "../../domain/entities/OrderItem";
import { Customer } from "../../domain/entities/Customer";
import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { DateRange } from "../../domain/value-objects/DateRange";
import { DatabaseService } from "../services/DatabaseService";
import { Money } from "../../domain/value-objects/Money";
import { OrderNumber } from "../../domain/value-objects/OrderNumber";
import { SQLCustomerRepository } from "./SQLCustomerRepository";
import { SQLProductRepository } from "./SQLProductRepository";
import { SQLWarehouseRepository } from "./SQLWarehouseRepository";
import { SQLSalespersonRepository } from "./SQLSalespersonRepository";
import { OrderQueries } from "./sql/order.queries";
import {
  OrderWithRelationsRow,
  OrderItemWithRelationsRow,
} from "./types/sql-results";
import { logger, LogLevel } from "../services/LoggingService";
import { QueryBuilder } from "./utils/QueryBuilder";

export class SQLOrderRepository implements IOrderRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly customerRepo: SQLCustomerRepository,
    private readonly productRepo: SQLProductRepository,
    private readonly warehouseRepo: SQLWarehouseRepository,
    private readonly salespersonRepo: SQLSalespersonRepository
  ) {}

  async getById(id: string): Promise<Order | null> {
    logger.log(LogLevel.INFO, `Getting order by ID: ${id}`);

    const query = QueryBuilder.createOrdersBaseQuery()
      .where("o.id = ?")
      .build();

    const [orderResult] = await this.db.query<OrderWithRelationsRow>(query, [
      id,
    ]);

    if (!orderResult) {
      logger.log(LogLevel.INFO, `Order not found: ${id}`);
      return null;
    }

    const itemsQuery = QueryBuilder.createOrderItemsBaseQuery()
      .where("oi.order_id = ?")
      .build();

    const itemsResult = await this.db.query<OrderItemWithRelationsRow>(
      itemsQuery,
      [id]
    );

    return this.mapToDomainEntity(orderResult, itemsResult);
  }

  async getAll(): Promise<Order[]> {
    logger.log(LogLevel.INFO, "Getting all orders");

    // Get all orders in one query
    const query = QueryBuilder.createOrdersBaseQuery().build();
    const ordersResult = await this.db.query<OrderWithRelationsRow>(query);

    if (!ordersResult.length) {
      logger.log(LogLevel.INFO, "No orders found");
      return [];
    }

    return this.getOrdersWithItems(ordersResult);
  }

  async create(order: Order): Promise<void> {
    logger.log(LogLevel.INFO, `Creating new order: ${order.orderNumber}`);

    // We don't use transactions because they are not supported on Railway
    try {
      // Create the order
      await this.db.query(OrderQueries.create, [
        order.orderNumber,
        order.orderNumber,
        order.orderDate,
        order.customer.id,
        order.salesperson.id,
        order.calculateTotal().amount,
        order.discount.amount,
        order.taxType,
        order.notes,
        order.isPrinted,
      ]);

      // Create items
      await this.createOrderItems(order);

      logger.log(
        LogLevel.INFO,
        `Order ${order.orderNumber} created successfully`
      );
    } catch (error) {
      logger.log(
        LogLevel.ERROR,
        `Failed to create order ${order.orderNumber}`,
        error
      );
      throw error;
    }
  }

  async update(order: Order): Promise<void> {
    logger.log(LogLevel.INFO, `Updating order: ${order.orderNumber}`);

    // We don't use transactions because they are not supported on Railway
    try {
      await this.db.query(OrderQueries.update, [
        order.orderDate,
        order.customer.id,
        order.salesperson.id,
        order.calculateTotal().amount,
        order.discount.amount,
        order.taxType,
        order.notes,
        order.isPrinted,
        order.orderNumber,
      ]);

      // Update items - delete old and add new
      await this.db.query(OrderQueries.deleteItems, [order.orderNumber]);
      await this.createOrderItems(order);

      logger.log(
        LogLevel.INFO,
        `Order ${order.orderNumber} updated successfully`
      );
    } catch (error) {
      logger.log(
        LogLevel.ERROR,
        `Failed to update order ${order.orderNumber}`,
        error
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    logger.log(LogLevel.INFO, `Deleting order: ${id}`);

    // We don't use transactions because they are not supported on Railway
    try {
      await this.db.query(OrderQueries.deleteItems, [id]);
      await this.db.query(OrderQueries.delete, [id]);

      logger.log(LogLevel.INFO, `Order ${id} deleted successfully`);
    } catch (error) {
      logger.log(LogLevel.ERROR, `Failed to delete order ${id}`, error);
      throw error;
    }
  }

  async findByCustomer(customer: Customer): Promise<Order[]> {
    logger.log(LogLevel.INFO, `Finding orders for customer: ${customer.id}`);

    const query = QueryBuilder.createOrdersBaseQuery()
      .where("o.customer_id = ?")
      .build();

    const ordersResult = await this.db.query<OrderWithRelationsRow>(query, [
      customer.id,
    ]);

    if (!ordersResult.length) {
      logger.log(LogLevel.INFO, `No orders found for customer: ${customer.id}`);
      return [];
    }

    return this.getOrdersWithItems(ordersResult);
  }

  async findByDateRange(dateRange: DateRange): Promise<Order[]> {
    logger.log(
      LogLevel.INFO,
      `Finding orders in date range: ${dateRange.start} to ${dateRange.end}`
    );

    const query = QueryBuilder.createOrdersBaseQuery()
      .where("o.order_date BETWEEN ? AND ?")
      .build();

    const ordersResult = await this.db.query<OrderWithRelationsRow>(query, [
      dateRange.start,
      dateRange.end,
    ]);

    if (!ordersResult.length) {
      logger.log(LogLevel.INFO, `No orders found in date range`);
      return [];
    }

    return this.getOrdersWithItems(ordersResult);
  }

  async findUnpaidOrders(): Promise<Order[]> {
    logger.log(LogLevel.INFO, "Finding unpaid orders");

    const query = QueryBuilder.createOrdersBaseQuery()
      .where("o.paid_amount < o.total_amount")
      .build();

    const ordersResult = await this.db.query<OrderWithRelationsRow>(query);

    if (!ordersResult.length) {
      logger.log(LogLevel.INFO, "No unpaid orders found");
      return [];
    }

    return this.getOrdersWithItems(ordersResult);
  }

  async getTotalSalesInRange(dateRange: DateRange): Promise<number> {
    logger.log(
      LogLevel.INFO,
      `Getting total sales in date range: ${dateRange.start} to ${dateRange.end}`
    );

    const query = new QueryBuilder()
      .select("SUM(total_amount) as total")
      .from("orders")
      .where("order_date BETWEEN ? AND ?")
      .build();

    const [result] = await this.db.query<{ total: number }>(query, [
      dateRange.start,
      dateRange.end,
    ]);

    const total = result?.total || 0;
    logger.log(LogLevel.INFO, `Total sales in range: ${total}`);

    return total;
  }

  /**
   * Extracts orders with their items
   */
  private async getOrdersWithItems(
    ordersResult: OrderWithRelationsRow[]
  ): Promise<Order[]> {
    // Get all items for all orders in one query
    const orderIds = ordersResult.map((order) => order.id);

    const itemsQuery = QueryBuilder.createOrderItemsBaseQuery()
      .where("oi.order_id IN (?)")
      .build();

    const allItemsResult = await this.db.query<OrderItemWithRelationsRow>(
      itemsQuery,
      [orderIds]
    );

    // Group items by order_id
    const itemsByOrderId = this.groupItemsByOrderId(allItemsResult);

    // Map each order with its items
    const orders = await Promise.all(
      ordersResult.map((orderRow) =>
        this.mapToDomainEntity(orderRow, itemsByOrderId[orderRow.id] || [])
      )
    );

    return orders.filter((order): order is Order => order !== null);
  }

  /**
   * Groups order items by order ID
   */
  private groupItemsByOrderId(
    items: OrderItemWithRelationsRow[]
  ): Record<string, OrderItemWithRelationsRow[]> {
    return items.reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push(item);
      return acc;
    }, {} as Record<string, OrderItemWithRelationsRow[]>);
  }

  /**
   * Creates order items in the database
   */
  private async createOrderItems(order: Order): Promise<void> {
    for (const item of order.items) {
      // Generate a unique ID for the order item
      const itemId = `${order.orderNumber}_${item.product.id}_${Date.now()}`;

      await this.db.query(OrderQueries.createItem, [
        itemId,
        order.orderNumber,
        item.product.id,
        item.warehouse.id,
        item.quantity,
        item.product.price.amount,
        item.specifications,
      ]);
    }
  }

  /**
   * Converts database data into a domain entity Order
   */
  private async mapToDomainEntity(
    orderRow: OrderWithRelationsRow,
    itemsRows: OrderItemWithRelationsRow[]
  ): Promise<Order | null> {
    try {
      const [customer, salesperson] = await Promise.all([
        this.customerRepo.getById(orderRow.customer_id),
        this.salespersonRepo.getById(orderRow.salesperson_id),
      ]);

      if (!customer || !salesperson) {
        logger.log(
          LogLevel.ERROR,
          `Failed to map order ${orderRow.id}: related entities not found`,
          {
            customerId: orderRow.customer_id,
            salespersonId: orderRow.salesperson_id,
          }
        );
        return null;
      }

      const order = new Order(
        new OrderNumber(orderRow.order_number),
        new Date(orderRow.order_date),
        customer,
        salesperson
      );

      order.setTaxType(orderRow.tax_type as TaxType);
      order.setDiscount(new Money(orderRow.discount_amount || 0));
      order.setNotes(orderRow.notes || "");

      if (orderRow.is_printed) {
        order.markAsPrinted();
      }

      // Add all items
      for (const itemRow of itemsRows) {
        const [product, warehouse] = await Promise.all([
          this.productRepo.getById(itemRow.product_id),
          this.warehouseRepo.getById(itemRow.warehouse_id),
        ]);

        if (product && warehouse) {
          const orderItem = new OrderItem(
            product,
            itemRow.quantity,
            warehouse,
            itemRow.specifications
          );
          order.addItem(orderItem);
        } else {
          logger.log(
            LogLevel.WARN,
            `Failed to map order item: related entities not found`,
            {
              productId: itemRow.product_id,
              warehouseId: itemRow.warehouse_id,
            }
          );
        }
      }

      return order;
    } catch (error) {
      logger.log(
        LogLevel.ERROR,
        `Error mapping order ${orderRow.id} to domain entity`,
        error
      );
      return null;
    }
  }
}
