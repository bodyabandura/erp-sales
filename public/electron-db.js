const mysql = require("mysql2/promise");

// Implementation for the main process (Electron backend)
class MainProcessDatabaseService {
  constructor(config) {
    this.connection = null;
    this.config = config;
  }

  async connect() {
    if (this.connection) {
      return;
    }

    try {
      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        ssl: this.config.ssl,
      });
    } catch (error) {
      console.error("Database connection initialization error:", error);
      const message = error.message || "Unknown error occurred";
      throw new Error(`Database connection failed: ${message}`);
    }
  }

  async query(sql, params = []) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    } catch (error) {
      const message = error.message || "Unknown error occurred";
      throw new Error(`Query error: ${message}`);
    }
  }

  async transaction(callback) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      await this.connection.beginTransaction();
      const result = await callback();
      await this.connection.commit();
      return result;
    } catch (error) {
      await this.connection.rollback();
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

module.exports = { MainProcessDatabaseService };
