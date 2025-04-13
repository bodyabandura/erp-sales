import { DatabaseService } from "../services/DatabaseService";

// Check if the required environment variables are present
const requiredEnvs = [
  "REACT_APP_MYSQL_HOST",
  "REACT_APP_MYSQL_PORT",
  "REACT_APP_MYSQL_USER",
  "REACT_APP_MYSQL_PASSWORD",
  "REACT_APP_MYSQL_DATABASE",
] as const;

const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);
if (missingEnvs.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvs.join(", ")}\n` +
      "Please check your .env file"
  );
}

// Create an instance of DatabaseService
export const db = new DatabaseService({
  host: process.env.REACT_APP_MYSQL_HOST || "localhost",
  port: parseInt(process.env.REACT_APP_MYSQL_PORT || "3306", 10),
  user: process.env.REACT_APP_MYSQL_USER || "root",
  password: process.env.REACT_APP_MYSQL_PASSWORD || "",
  database: process.env.REACT_APP_MYSQL_DATABASE || "test",
  ssl: {
    rejectUnauthorized: false,
  },
});
