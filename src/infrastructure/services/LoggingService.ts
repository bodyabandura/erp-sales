// Simple logging service for tracking database operations

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export class LoggingService {
  private static instance: LoggingService;
  private isElectron = typeof window !== "undefined" && window.require;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Logs a message with timestamp and level
   */
  public log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data || "");
        break;
      case LogLevel.INFO:
        console.info(logMessage, data || "");
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data || "");
        break;
      case LogLevel.ERROR:
        console.error(logMessage, data || "");
        break;
    }

    // Additional processing in the Electron environment - can save logs to a file
    if (this.isElectron) {
      this.saveToFile(level, logMessage, data);
    }
  }

  /**
   * Logs SQL queries
   */
  public logQuery(sql: string, params: any[] = []): void {
    this.log(LogLevel.DEBUG, `Executing SQL query: ${sql}`, { params });
  }

  /**
   * Logs query errors
   */
  public logQueryError(sql: string, params: any[] = [], error: any): void {
    this.log(LogLevel.ERROR, `SQL query failed: ${sql}`, { params, error });
  }

  /**
   * Logs successful query execution
   */
  public logQuerySuccess(sql: string, results: any): void {
    this.log(LogLevel.DEBUG, `SQL query succeeded: ${sql}`, {
      resultCount: Array.isArray(results) ? results.length : 1,
    });
  }

  /**
   * Logs the beginning of a transaction
   */
  public logTransactionBegin(): void {
    this.log(LogLevel.INFO, "Transaction started");
  }

  /**
   * Logs the end of a transaction
   */
  public logTransactionEnd(success: boolean): void {
    if (success) {
      this.log(LogLevel.INFO, "Transaction committed successfully");
    } else {
      this.log(LogLevel.WARN, "Transaction rolled back");
    }
  }

  /**
   * Method for saving logs to a file (via IPC in Electron)
   */
  private saveToFile(level: LogLevel, message: string, data?: any): void {
    // This method can be implemented later, sending logs to the main process
    // through IPC to save to a file
    // For now, just a placeholder
  }
}

// Convenient export for use in other files
export const logger = LoggingService.getInstance();
