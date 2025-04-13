const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const Store = require("electron-store");

// Load electron-db.js correctly from different paths depending on the mode
const dbModulePath = isDev
  ? "./electron-db"
  : path.join(app.getAppPath(), "electron-db");

const { MainProcessDatabaseService } = require(dbModulePath);

// Load .env file from different locations depending on the mode
const dotenvPath = isDev
  ? path.resolve(process.cwd(), ".env")
  : path.join(app.getAppPath(), ".env");

require("dotenv").config({ path: dotenvPath });

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
};

// Initialize electron store
const store = new Store();

// Database connection
let db = null;

async function initializeDatabase() {
  try {
    db = new MainProcessDatabaseService(dbConfig);
    await db.connect();
    await db.query("SELECT 1 as test");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Disable web security for development
      devTools: true, // Ensure DevTools are enabled
    },
  });

  // Open DevTools on startup
  win.webContents.openDevTools();

  // Listen for all rendering errors
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorCode, errorDescription);
  });

  win.webContents.on("crashed", () => {
    console.error("Renderer process crashed");
  });

  // Attach error handlers
  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled rejection at:", promise, "reason:", reason);
  });

  win.setMenuBarVisibility(false);
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  win.maximize();

  return win;
}

// App lifecycle
app.whenReady().then(async () => {
  try {
    await initializeDatabase();
    createWindow();
  } catch (error) {
    console.error("Application initialization error:", error);
    const { dialog } = require("electron");
    dialog.showErrorBox(
      "Database Connection Error",
      `Failed to connect to the database: ${error.message}\n\nPlease check your connection settings and try again.`
    );
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (db) {
      db.close();
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle("database-query", async (event, { sql, params = [] }) => {
  if (!db) {
    throw new Error("Database connection not initialized");
  }

  try {
    return await db.query(sql, params);
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
});

// Simple store operations
ipcMain.on("store-get", (event, key) => {
  event.returnValue = store.get(key);
});

ipcMain.on("store-set", (event, key, value) => {
  store.set(key, value);
});
