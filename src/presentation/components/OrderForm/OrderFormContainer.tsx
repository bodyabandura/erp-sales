import React, { useState, useEffect, useCallback } from "react";
import { OrderFormPresentation } from "./OrderFormPresentation";
import { CreateOrderUseCase } from "../../../application/use-cases/CreateOrder";
import { TaxType } from "../../../domain/entities/Order";
import { Customer } from "../../../domain/entities/Customer";
import { Product } from "../../../domain/entities/Product";
import { Warehouse } from "../../../domain/entities/Warehouse";
import { Salesperson } from "../../../domain/entities/Salesperson";
import { Money } from "../../../domain/value-objects/Money";
import { OrderNumber } from "../../../domain/value-objects/OrderNumber";
import { useOrderRepository } from "../../hooks/useOrderRepository";
import { useCustomerRepository } from "../../hooks/useCustomerRepository";
import { useProductRepository } from "../../hooks/useProductRepository";
import { useWarehouseRepository } from "../../hooks/useWarehouseRepository";
import { useSalespersonRepository } from "../../hooks/useSalespersonRepository";

type OrderItemFormData = {
  product: Product;
  quantity: number;
  warehouse: Warehouse;
  specifications?: string;
};

export const OrderFormContainer: React.FC = () => {
  // Repositories
  const orderRepository = useOrderRepository();
  const customerRepository = useCustomerRepository();
  const productRepository = useProductRepository();
  const warehouseRepository = useWarehouseRepository();
  const salespersonRepository = useSalespersonRepository();

  // State
  const [orderNumber, setOrderNumber] = useState(OrderNumber.generate().value);
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null);
  const [items, setItems] = useState<OrderItemFormData[]>([]);
  const [taxType, setTaxType] = useState<TaxType>("none");
  const [notes, setNotes] = useState("");
  const [isPrinted, setIsPrinted] = useState(false);
  const [discount, setDiscount] = useState(new Money(0));
  const [paidAmount, setPaidAmount] = useState(new Money(0));

  // Lists for dropdowns
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [customersData, productsData, warehousesData, salespeopleData] =
          await Promise.all([
            customerRepository.getAll(),
            productRepository.getAll(),
            warehouseRepository.getAll(),
            salespersonRepository.getAll(),
          ]);

        setCustomers(customersData);
        setProducts(productsData);
        setWarehouses(warehousesData);
        setSalespeople(salespeopleData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error loading data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    customerRepository,
    productRepository,
    warehouseRepository,
    salespersonRepository,
  ]);

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum.add(item.product.price.multiply(item.quantity)),
    new Money(0)
  );

  const tax = (() => {
    const baseAmount = subtotal.subtract(discount);
    switch (taxType) {
      case "external":
        return baseAmount.multiply(0.05);
      case "internal":
        return baseAmount.subtract(baseAmount.divide(1.05));
      default:
        return new Money(0);
    }
  })();

  const total = subtotal
    .subtract(discount)
    .add(taxType === "external" ? tax : new Money(0));

  const remainingAmount = total.subtract(paidAmount);

  // Event handlers
  const handleCustomerChange = useCallback(
    async (customerId: string) => {
      const selectedCustomer = await customerRepository.getById(customerId);
      setCustomer(selectedCustomer);
    },
    [customerRepository]
  );

  const handleSalespersonChange = useCallback(
    async (salespersonId: string) => {
      const selectedSalesperson = await salespersonRepository.getById(
        salespersonId
      );
      setSalesperson(selectedSalesperson);
    },
    [salespersonRepository]
  );

  const handleDateChange = useCallback((date: string) => {
    setOrderDate(date);
  }, []);

  const handleTaxTypeChange = useCallback((type: TaxType) => {
    setTaxType(type);
  }, []);

  const handleDiscountChange = useCallback((amount: number) => {
    setDiscount(new Money(amount));
  }, []);

  const handlePaidAmountChange = useCallback((amount: number) => {
    setPaidAmount(new Money(amount));
  }, []);

  const handleNotesChange = useCallback((value: string) => {
    setNotes(value);
  }, []);

  const handleAddItem = useCallback(() => {
    if (products.length > 0 && warehouses.length > 0) {
      const newItem: OrderItemFormData = {
        product: products[0],
        quantity: 1,
        warehouse: warehouses[0],
      };
      setItems((prev) => [...prev, newItem]);
    }
  }, [products, warehouses]);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleItemChange = useCallback(
    (
      index: number,
      field: "product" | "quantity" | "warehouse" | "specifications",
      value: any
    ) => {
      setItems((prev) => {
        const newItems = [...prev];
        const item = { ...newItems[index] };

        switch (field) {
          case "product":
            item.product = products.find((p) => p.id === value) || item.product;
            break;
          case "quantity":
            item.quantity = Math.max(1, value);
            break;
          case "warehouse":
            item.warehouse =
              warehouses.find((w) => w.id === value) || item.warehouse;
            break;
          case "specifications":
            item.specifications = value;
            break;
        }

        newItems[index] = item;
        return newItems;
      });
    },
    [products, warehouses]
  );

  const handleSave = useCallback(async () => {
    if (!customer || !salesperson) {
      alert("請選擇客戶和銷售人員");
      return;
    }

    if (items.length === 0) {
      alert("請至少添加一個項目");
      return;
    }

    try {
      const createOrder = new CreateOrderUseCase(
        orderRepository,
        async (id: string): Promise<Customer> => {
          const result = await customerRepository.getById(id);
          if (!result) throw new Error(`Customer not found: ${id}`);
          return result;
        },
        async (id: string): Promise<Product> => {
          const result = await productRepository.getById(id);
          if (!result) throw new Error(`Product not found: ${id}`);
          return result;
        },
        async (id: string): Promise<Warehouse> => {
          const result = await warehouseRepository.getById(id);
          if (!result) throw new Error(`Warehouse not found: ${id}`);
          return result;
        },
        async (id: string): Promise<Salesperson> => {
          const result = await salespersonRepository.getById(id);
          if (!result) throw new Error(`Salesperson not found: ${id}`);
          return result;
        }
      );

      await createOrder.execute({
        customerId: customer.id,
        salespersonId: salesperson.id,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          warehouseId: item.warehouse.id,
          specifications: item.specifications,
        })),
        taxType,
        notes,
      });

      const itemsDetail = items
        .map(
          (item) =>
            `${item.product.name} (${
              item.quantity
            } x ${item.product.price.toString()} = ${item.product.price
              .multiply(item.quantity)
              .toString()})`
        )
        .join("\n");

      alert(
        `訂單創建成功!\n\n` +
          `總金額: ${total.toString()}\n\n` +
          `訂單詳情:\n${itemsDetail}`
      );

      // Reset form after successful save
      setItems([]);
      setNotes("");
      setOrderNumber(OrderNumber.generate().value);
      setOrderDate(new Date().toISOString().split("T")[0]);
      setCustomer(null);
      setSalesperson(null);
      setTaxType("none");
      setIsPrinted(false);
      setDiscount(new Money(0));
      setPaidAmount(new Money(0));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Error saving order: ${errorMessage}`);
    }
  }, [
    customer,
    salesperson,
    items,
    taxType,
    notes,
    orderRepository,
    customerRepository,
    productRepository,
    warehouseRepository,
    salespersonRepository,
    total,
  ]);

  const handlePrint = useCallback(() => {
    // Implement print functionality
    setIsPrinted(true);
  }, []);

  if (loading) {
    return <div className="loading">加載數據中...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <OrderFormPresentation
      orderNumber={orderNumber}
      orderDate={orderDate}
      customer={customer}
      salesperson={salesperson}
      items={items}
      taxType={taxType}
      notes={notes}
      isPrinted={isPrinted}
      subtotal={subtotal}
      discount={discount}
      tax={tax}
      total={total}
      paidAmount={paidAmount}
      remainingAmount={remainingAmount}
      customers={customers}
      products={products}
      warehouses={warehouses}
      salespeople={salespeople}
      onCustomerChange={handleCustomerChange}
      onSalespersonChange={handleSalespersonChange}
      onDateChange={handleDateChange}
      onTaxTypeChange={handleTaxTypeChange}
      onDiscountChange={handleDiscountChange}
      onPaidAmountChange={handlePaidAmountChange}
      onNotesChange={handleNotesChange}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onItemChange={handleItemChange}
      onSave={handleSave}
      onPrint={handlePrint}
    />
  );
};
