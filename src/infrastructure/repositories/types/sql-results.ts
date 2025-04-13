export interface CustomerRow {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  credit_limit: number;
}

export interface OrderRow {
  id: string;
  order_number: string;
  order_date: Date;
  customer_id: string;
  salesperson_id: string;
  total_amount: number;
  discount_amount: number;
  tax_type: string;
  notes: string;
  is_printed: boolean;
}

export interface OrderItemRow {
  order_id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  unit_price: number;
  specifications: string;
}

export interface OrderWithRelationsRow extends OrderRow {
  customer_id: string;
  salesperson_id: string;
}

export interface OrderItemWithRelationsRow extends OrderItemRow {
  product_id: string;
  warehouse_id: string;
}
