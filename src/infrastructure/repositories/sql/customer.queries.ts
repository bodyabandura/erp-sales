export const CustomerQueries = {
  getById: "SELECT * FROM customers WHERE id = ?",

  getAll: "SELECT * FROM customers",

  create: `
    INSERT INTO customers (
      id, code, name, address, phone, credit_limit
    ) VALUES (?, ?, ?, ?, ?, ?)
  `,

  update: `
    UPDATE customers 
    SET code = ?, 
        name = ?, 
        address = ?, 
        phone = ?, 
        credit_limit = ? 
    WHERE id = ?
  `,

  delete: "DELETE FROM customers WHERE id = ?",

  findByCode: "SELECT * FROM customers WHERE code = ?",

  findByName: "SELECT * FROM customers WHERE name LIKE ?",

  findByBalanceGreaterThan: "SELECT * FROM customers WHERE balance > ?",

  findByOverduePayments: `
    SELECT DISTINCT c.* 
    FROM customers c
    INNER JOIN orders o ON c.id = o.customer_id
    WHERE o.due_date < CURRENT_DATE
    AND o.paid_amount < o.total_amount
  `,
} as const;
