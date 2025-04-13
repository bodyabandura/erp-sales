const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

// Download .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Log environment variables
console.log("Environment variables:", {
  host: process.env.REACT_APP_MYSQL_HOST,
  port: process.env.REACT_APP_MYSQL_PORT,
  user: process.env.REACT_APP_MYSQL_USER,
  database: process.env.REACT_APP_MYSQL_DATABASE,
});

// Database configuration
const dbConfig = {
  host: process.env.REACT_APP_MYSQL_HOST,
  port: parseInt(process.env.REACT_APP_MYSQL_PORT),
  user: process.env.REACT_APP_MYSQL_USER,
  password: process.env.REACT_APP_MYSQL_PASSWORD,
  database: process.env.REACT_APP_MYSQL_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
  multipleStatements: true,
};

// Check table existence
async function checkTableExistence(connection, tableName) {
  const [rows] = await connection.execute(
    `
    SELECT COUNT(*) AS count FROM information_schema.tables 
    WHERE table_schema = ? AND table_name = ?
  `,
    [process.env.REACT_APP_MYSQL_DATABASE, tableName]
  );

  return rows[0].count > 0;
}

// Rename salespeople table to salespersons
async function renameSalespeopleTable(connection) {
  try {
    // Check if salespersons table exists
    const salespersonsExists = await checkTableExistence(
      connection,
      "salespersons"
    );

    if (salespersonsExists) {
      console.log("Table salespersons already exists");
      return;
    }

    // Check if salespeople table exists
    const salespeopleExists = await checkTableExistence(
      connection,
      "salespeople"
    );

    if (salespeopleExists) {
      // Create new table with correct name
      await connection.execute(`
        CREATE TABLE salespersons (
          id VARCHAR(36) PRIMARY KEY,
          code VARCHAR(20) NOT NULL,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          is_active BOOLEAN DEFAULT TRUE,
          commission DECIMAL(5, 2) DEFAULT 0,
          total_sales DECIMAL(15, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Copy data
      await connection.execute(`
        INSERT INTO salespersons (id, code, name, email, phone, is_active)
        SELECT id, code, name, email, phone, is_active FROM salespeople
      `);

      console.log("Data copied from salespeople to salespersons");
    } else {
      // If salespeople table doesn't exist, create a new one
      await connection.execute(`
        CREATE TABLE salespersons (
          id VARCHAR(36) PRIMARY KEY,
          code VARCHAR(20) NOT NULL,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          is_active BOOLEAN DEFAULT TRUE,
          commission DECIMAL(5, 2) DEFAULT 0,
          total_sales DECIMAL(15, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log("Created salespersons table");
    }
  } catch (error) {
    console.error("Error handling salespersons table:", error);
    throw error;
  }
}

// Initialize database
async function initializeDatabase() {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    await renameSalespeopleTable(connection);

    console.log("Creating database schema...");

    // Customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        code VARCHAR(20) NOT NULL,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        credit_limit DECIMAL(15, 2) DEFAULT 0,
        balance DECIMAL(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Customers table created");

    // Products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        unit VARCHAR(10) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Products table created");

    // Warehouses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS warehouses (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Warehouses table created");

    // Orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL,
        order_date DATE NOT NULL,
        customer_id VARCHAR(36) NOT NULL,
        salesperson_id VARCHAR(36) NOT NULL,
        tax_type ENUM('none', 'external', 'internal') DEFAULT 'none',
        discount DECIMAL(15, 2) DEFAULT 0,
        paid_amount DECIMAL(15, 2) DEFAULT 0,
        total_amount DECIMAL(15, 2) DEFAULT 0,
        notes TEXT,
        is_printed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (salesperson_id) REFERENCES salespersons(id)
      )
    `);
    console.log("Orders table created");

    // Order items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        warehouse_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        specifications TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
      )
    `);
    console.log("Order Items table created");

    // Add indexes - check their existence before creating
    try {
      await connection.execute(
        `CREATE INDEX idx_customers_code ON customers(code)`
      );
      console.log("Index idx_customers_code created");
    } catch (e) {
      console.log(
        "Index idx_customers_code already exists or error:",
        e.message
      );
    }

    try {
      await connection.execute(
        `CREATE INDEX idx_products_name ON products(name)`
      );
      console.log("Index idx_products_name created");
    } catch (e) {
      console.log(
        "Index idx_products_name already exists or error:",
        e.message
      );
    }

    try {
      await connection.execute(
        `CREATE INDEX idx_orders_customer_id ON orders(customer_id)`
      );
      console.log("Index idx_orders_customer_id created");
    } catch (e) {
      console.log(
        "Index idx_orders_customer_id already exists or error:",
        e.message
      );
    }

    try {
      await connection.execute(
        `CREATE INDEX idx_orders_order_date ON orders(order_date)`
      );
      console.log("Index idx_orders_order_date created");
    } catch (e) {
      console.log(
        "Index idx_orders_order_date already exists or error:",
        e.message
      );
    }

    try {
      await connection.execute(
        `CREATE INDEX idx_order_items_order_id ON order_items(order_id)`
      );
      console.log("Index idx_order_items_order_id created");
    } catch (e) {
      console.log(
        "Index idx_order_items_order_id already exists or error:",
        e.message
      );
    }

    console.log("Indexes created");

    console.log("Inserting test data...");

    // Add test data - customers
    try {
      // Delete old records to avoid duplicates
      await connection.execute(`DELETE FROM customers`);

      // Insert data
      await connection.execute(`
        INSERT INTO customers (id, code, name)
        VALUES 
        ('C1', 'C001', '台北貿易行'),
        ('C2', 'C002', '台中鑫豐企業'),
        ('C3', 'C003', '高雄電工社')
      `);
      console.log("3 customers added");
    } catch (e) {
      console.log("Error adding customers:", e.message);
    }

    // Add test data - products
    try {
      // Delete old records to avoid duplicates
      await connection.execute(`DELETE FROM products`);

      // Insert data
      await connection.execute(`
        INSERT INTO products (id, name, unit, price)
        VALUES 
        ('P1', '柴油', '公升', 32.5),
        ('P2', '齒輪油', '瓶', 180),
        ('P3', '引擎潤滑油', '桶', 1500)
      `);
      console.log("3 products added");
    } catch (e) {
      console.log("Error adding products:", e.message);
    }

    // Add test data - warehouses
    try {
      // Delete old records to avoid duplicates
      await connection.execute(`DELETE FROM warehouses`);

      // Insert data
      await connection.execute(`
        INSERT INTO warehouses (id, name)
        VALUES 
        ('W1', '一號倉'),
        ('W2', '備品倉'),
        ('W3', '油品區')
      `);
      console.log("3 warehouses added");
    } catch (e) {
      console.log("Error adding warehouses:", e.message);
    }

    // Add test data - salespersons
    try {
      // Delete old records to avoid duplicates
      await connection.execute(`DELETE FROM salespersons`);

      // Insert data
      await connection.execute(`
        INSERT INTO salespersons (id, code, name)
        VALUES 
        ('S1', 'S01', '王小明'),
        ('S2', 'S02', '陳美華')
      `);
      console.log("2 salespersons added");
    } catch (e) {
      console.log("Error adding salespersons:", e.message);
    }

    console.log("Database initialization completed successfully!");
    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

// Start initialization
initializeDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
  });
