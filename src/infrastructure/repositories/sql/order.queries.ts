export const OrderQueries = {
  getByIdWithRelations: `
    SELECT o.*, 
           c.id as customer_id,
           s.id as salesperson_id
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN salespersons s ON o.salesperson_id = s.id
    WHERE o.id = ?
  `,

  getItemsByOrderId: `
    SELECT oi.*, 
           p.id as product_id, 
           w.id as warehouse_id
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN warehouses w ON oi.warehouse_id = w.id
    WHERE oi.order_id = ?
  `,

  getAllWithRelations: `
    SELECT o.*, 
           c.id as customer_id,
           s.id as salesperson_id
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN salespersons s ON o.salesperson_id = s.id
  `,

  getAllItemsForOrders: `
    SELECT oi.*, 
           p.id as product_id, 
           w.id as warehouse_id,
           oi.order_id
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN warehouses w ON oi.warehouse_id = w.id
    WHERE oi.order_id IN (?)
  `,

  create: `
    INSERT INTO orders (
      id, 
      order_number, 
      order_date, 
      customer_id, 
      salesperson_id,
      total_amount,
      discount,
      tax_type,
      notes,
      is_printed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  createItem: `
    INSERT INTO order_items (
      id,
      order_id,
      product_id,
      warehouse_id,
      quantity,
      price,
      specifications
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  update: `
    UPDATE orders 
    SET order_date = ?,
        customer_id = ?,
        salesperson_id = ?,
        total_amount = ?,
        discount = ?,
        tax_type = ?,
        notes = ?,
        is_printed = ?
    WHERE order_number = ?
  `,

  deleteItems: "DELETE FROM order_items WHERE order_id = ?",

  delete: "DELETE FROM orders WHERE id = ?",

  findByCustomer: `
    SELECT o.*, 
           c.id as customer_id,
           s.id as salesperson_id
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN salespersons s ON o.salesperson_id = s.id
    WHERE o.customer_id = ?
  `,

  findByDateRange: `
    SELECT o.*, 
           c.id as customer_id,
           s.id as salesperson_id
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN salespersons s ON o.salesperson_id = s.id
    WHERE o.order_date BETWEEN ? AND ?
  `,

  findUnpaid: `
    SELECT o.*, 
           c.id as customer_id,
           s.id as salesperson_id
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN salespersons s ON o.salesperson_id = s.id
    WHERE o.paid_amount < o.total_amount
  `,

  getTotalSalesInRange: `
    SELECT SUM(total_amount) as total
    FROM orders
    WHERE order_date BETWEEN ? AND ?
  `,
} as const;
