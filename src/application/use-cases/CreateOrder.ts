import { Order } from "../../domain/entities/Order";
import { Customer } from "../../domain/entities/Customer";
import { Product } from "../../domain/entities/Product";
import { Warehouse } from "../../domain/entities/Warehouse";
import { Salesperson } from "../../domain/entities/Salesperson";
import { OrderNumber } from "../../domain/value-objects/OrderNumber";
import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { OrderItem } from "../../domain/entities/OrderItem";

interface CreateOrderDTO {
  customerId: string;
  salespersonId: string;
  items: Array<{
    productId: string;
    quantity: number;
    warehouseId: string;
    specifications?: string;
  }>;
  taxType: "none" | "external" | "internal";
  notes?: string;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly getCustomer: (id: string) => Promise<Customer>,
    private readonly getProduct: (id: string) => Promise<Product>,
    private readonly getWarehouse: (id: string) => Promise<Warehouse>,
    private readonly getSalesperson: (id: string) => Promise<Salesperson>
  ) {}

  public async execute(dto: CreateOrderDTO): Promise<Order> {
    // Fetch required entities
    const [customer, salesperson] = await Promise.all([
      this.getCustomer(dto.customerId),
      this.getSalesperson(dto.salespersonId),
    ]);

    if (!customer) {
      throw new Error(`Customer not found: ${dto.customerId}`);
    }

    if (!salesperson) {
      throw new Error(`Salesperson not found: ${dto.salespersonId}`);
    }

    if (!salesperson.canMakeSales()) {
      throw new Error(`Salesperson ${salesperson.name} is not active`);
    }

    // Create order
    const order = new Order(
      OrderNumber.generate(),
      new Date(),
      customer,
      salesperson
    );

    // Set tax type
    order.setTaxType(dto.taxType);

    // Add notes if provided
    if (dto.notes) {
      order.setNotes(dto.notes);
    }

    // Process items
    for (const item of dto.items) {
      const [product, warehouse] = await Promise.all([
        this.getProduct(item.productId),
        this.getWarehouse(item.warehouseId),
      ]);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (!warehouse) {
        throw new Error(`Warehouse not found: ${item.warehouseId}`);
      }

      if (!warehouse.canAcceptOrders()) {
        throw new Error(`Warehouse ${warehouse.name} is not active`);
      }

      const orderItem = new OrderItem(
        product,
        item.quantity,
        warehouse,
        item.specifications
      );

      order.addItem(orderItem);
    }

    // Validate if customer can place this order
    const total = order.calculateTotal();

    // Save order
    await this.orderRepository.create(order);

    // Update customer's balance
    customer.addToBalance(total);

    // Update salesperson's total sales
    salesperson.addSale(total);

    return order;
  }
}
