export const WarehouseQueries = {
  getById: "SELECT * FROM warehouses WHERE id = ?",
  getAll: "SELECT * FROM warehouses",
  create: `
    INSERT INTO warehouses (
      id, name, location, is_active
    ) VALUES (?, ?, ?, ?)
  `,
  update: `
    UPDATE warehouses 
    SET name = ?, 
        location = ?, 
        is_active = ?
    WHERE id = ?
  `,
  delete: "DELETE FROM warehouses WHERE id = ?",
  findByName: "SELECT * FROM warehouses WHERE name LIKE ?",
  findByLocation: "SELECT * FROM warehouses WHERE location LIKE ?",
  findActive: "SELECT * FROM warehouses WHERE is_active = true",
} as const;
