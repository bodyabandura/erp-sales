const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

// Завантажуємо .env файл
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Логуємо змінні оточення
console.log("Environment variables:", {
  host: process.env.REACT_APP_MYSQL_HOST,
  port: process.env.REACT_APP_MYSQL_PORT,
  user: process.env.REACT_APP_MYSQL_USER,
  database: process.env.REACT_APP_MYSQL_DATABASE,
});

// Конфігурація бази даних
const dbConfig = {
  host: process.env.REACT_APP_MYSQL_HOST,
  port: parseInt(process.env.REACT_APP_MYSQL_PORT),
  user: process.env.REACT_APP_MYSQL_USER,
  password: process.env.REACT_APP_MYSQL_PASSWORD,
  database: process.env.REACT_APP_MYSQL_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
};

async function checkDatabase() {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(dbConfig);

    // Отримуємо список таблиць
    const [tables] = await connection.execute(
      `
      SELECT TABLE_NAME 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [process.env.REACT_APP_MYSQL_DATABASE]
    );

    console.log("Tables in database:");
    const tableNames = tables.map((t) => t.TABLE_NAME);
    console.log(tableNames);

    // Перевіряємо структуру кожної таблиці
    for (const tableName of tableNames) {
      console.log(`\n=== Structure of table ${tableName} ===`);

      const [columns] = await connection.execute(`
        SHOW COLUMNS FROM \`${tableName}\`
      `);

      columns.forEach((column) => {
        console.log(
          `${column.Field}: ${column.Type} ${
            column.Null === "YES" ? "NULL" : "NOT NULL"
          } ${column.Key === "PRI" ? "PRIMARY KEY" : ""}`
        );
      });

      // Перевіряємо вміст таблиці
      const [count] = await connection.execute(`
        SELECT COUNT(*) as count FROM \`${tableName}\`
      `);

      console.log(`\nRows in table ${tableName}: ${count[0].count}`);

      if (count[0].count > 0 && count[0].count < 10) {
        const [rows] = await connection.execute(`
          SELECT * FROM \`${tableName}\` LIMIT 5
        `);

        console.log("Sample data:");
        console.log(rows);
      }
    }

    return true;
  } catch (error) {
    console.error("Database check error:", error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

// Запускаємо перевірку
checkDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
  });
