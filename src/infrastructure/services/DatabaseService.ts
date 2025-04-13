import mysql from "mysql2/promise";
import { logger, LogLevel } from "./LoggingService";

// Safe import of electron
let ipcRenderer: any;
if (typeof window !== "undefined" && window.require) {
  try {
    const electron = window.require("electron");
    ipcRenderer = electron.ipcRenderer;
  } catch (error) {
    console.error("Failed to import electron:", error);
    throw new Error("Electron is required for this application to function");
  }
}

export interface QueryResult {
  [key: string]: any;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: {
    rejectUnauthorized: boolean;
  };
}

// Base interface for database operations
export interface IDatabaseService {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  transaction<T>(callback: () => Promise<T>): Promise<T>;
}

// Implementation for the main process (Electron backend)
export class MainProcessDatabaseService implements IDatabaseService {
  private connection: mysql.Connection | null = null;

  constructor(config: mysql.ConnectionOptions) {
    this.initialize(config);
  }

  private async initialize(config: mysql.ConnectionOptions) {
    try {
      logger.log(LogLevel.INFO, "Initializing database connection", {
        host: config.host,
        database: config.database,
      });

      this.connection = await mysql.createConnection(config);

      logger.log(LogLevel.INFO, "Database connection initialized successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      logger.log(
        LogLevel.ERROR,
        `Database connection failed: ${message}`,
        error
      );
      throw new Error(`Database connection failed: ${message}`);
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.connection) {
      throw new Error("Database connection not initialized");
    }

    try {
      logger.logQuery(sql, params);

      const [rows] = await this.connection.execute(sql, params);

      logger.logQuerySuccess(sql, rows);
      return rows as T[];
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";

      logger.logQueryError(sql, params, error);
      throw new Error(`Query error: ${message}`);
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    if (!this.connection) {
      throw new Error("Database connection not initialized");
    }

    try {
      logger.logTransactionBegin();

      await this.connection.beginTransaction();
      const result = await callback();
      await this.connection.commit();

      logger.logTransactionEnd(true);
      return result;
    } catch (error: unknown) {
      logger.log(LogLevel.ERROR, "Transaction failed, rolling back", error);

      await this.connection.rollback();

      logger.logTransactionEnd(false);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred during transaction");
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      logger.log(LogLevel.INFO, "Closing database connection");

      await this.connection.end();
      this.connection = null;

      logger.log(LogLevel.INFO, "Database connection closed");
    }
  }
}

// Implementation for the renderer process (Electron frontend)
export class DatabaseService implements IDatabaseService {
  constructor(private config: DatabaseConfig) {
    // Check if we are working in Electron
    if (!ipcRenderer) {
      throw new Error("This application can only run in Electron environment");
    }

    logger.log(
      LogLevel.INFO,
      "DatabaseService initialized for renderer process",
      {
        host: config.host,
        database: config.database,
      }
    );
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      logger.logQuery(sql, params);

      const results = await ipcRenderer.invoke("database-query", {
        sql,
        params,
      });

      logger.logQuerySuccess(sql, results);
      return results;
    } catch (error) {
      logger.logQueryError(sql, params, error);
      throw error;
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    try {
      logger.logTransactionBegin();

      await this.query("START TRANSACTION");
      const result = await callback();
      await this.query("COMMIT");

      logger.logTransactionEnd(true);
      return result;
    } catch (error: unknown) {
      logger.log(LogLevel.ERROR, "Transaction failed, rolling back", error);

      await this.query("ROLLBACK");

      logger.logTransactionEnd(false);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred during transaction");
    }
  }
}
