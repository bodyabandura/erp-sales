import React, { useMemo } from "react";
import { OrderFormContainer } from "./presentation/components/OrderForm/OrderFormContainer";
import { RepositoryProvider } from "./presentation/contexts/RepositoryContext";
import { SQLOrderRepository } from "./infrastructure/repositories/SQLOrderRepository";
import { SQLCustomerRepository } from "./infrastructure/repositories/SQLCustomerRepository";
import { SQLProductRepository } from "./infrastructure/repositories/SQLProductRepository";
import { SQLWarehouseRepository } from "./infrastructure/repositories/SQLWarehouseRepository";
import { SQLSalespersonRepository } from "./infrastructure/repositories/SQLSalespersonRepository";
import { db } from "./infrastructure/config/database";
import "./App.css";

const App: React.FC = () => {
  const repositories = useMemo(() => {
    const customerRepo = new SQLCustomerRepository(db);
    const productRepo = new SQLProductRepository(db);
    const warehouseRepo = new SQLWarehouseRepository(db);
    const salespersonRepo = new SQLSalespersonRepository(db);

    return {
      orderRepository: new SQLOrderRepository(
        db,
        customerRepo,
        productRepo,
        warehouseRepo,
        salespersonRepo
      ),
      customerRepository: customerRepo,
      productRepository: productRepo,
      warehouseRepository: warehouseRepo,
      salespersonRepository: salespersonRepo,
    };
  }, []);

  return (
    <RepositoryProvider repositories={repositories}>
      <div className="app">
        <header className="app-header">
          <div className="app-top-toolbar">
            <button className="app-top-toolbar-button">
              <span className="function-icon">📄</span>
              <span className="function-text">例行作業</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-top-toolbar-button">
              <span className="function-icon">📊</span>
              <span className="function-text">基本資料</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-top-toolbar-button">
              <span className="function-icon">💰</span>
              <span className="function-text">帳款作業</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-top-toolbar-button">
              <span className="function-icon">📈</span>
              <span className="function-text">報表作業</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-top-toolbar-button">
              <span className="function-icon">⚙️</span>
              <span className="function-text">系統設定</span>
            </button>
          </div>

          <div className="app-bottom-toolbar">
            <button className="app-bottom-toolbar-button">
              <span className="function-icon">👤</span>
              <span className="function-text">管理系統</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-bottom-toolbar-button">
              <span className="function-icon">📂</span>
              <span className="function-text">分類作業</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-bottom-toolbar-button">
              <span className="function-icon">📒</span>
              <span className="function-text">會計總帳</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-bottom-toolbar-button">
              <span className="function-icon">📱</span>
              <span className="function-text">來電顯示</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-bottom-toolbar-button">
              <span className="function-icon">📧</span>
              <span className="function-text">訊息通知</span>
            </button>
            <div className="toolbar-divider"></div>
            <button className="app-bottom-toolbar-button">
              <span className="function-icon">👥</span>
              <span className="function-text">使用者</span>
            </button>
            <button className="phone-button">
              <span className="function-icon">☎️</span>
              <span className="function-text">手動來電</span>
            </button>
          </div>
        </header>

        <main className="app-main">
          <aside className="app-sidebar">
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item active">
                <span className="sidebar-icon">📄</span>銷售管理
              </li>
              <li className="sidebar-menu-item">
                <span className="sidebar-icon">👥</span>客戶管理
              </li>
              <li className="sidebar-menu-item">
                <span className="sidebar-icon">📦</span>庫存管理
              </li>
              <li className="sidebar-menu-item">
                <span className="sidebar-icon">🧾</span>採購管理
              </li>
              <li className="sidebar-menu-item">
                <span className="sidebar-icon">💰</span>財務管理
              </li>
              <li className="sidebar-menu-item">
                <span className="sidebar-icon">📊</span>報表
              </li>
              <li className="sidebar-menu-item">
                <span className="sidebar-icon">⚙️</span>系統設定
              </li>
            </ul>
          </aside>

          <div className="content-area">
            <OrderFormContainer />
          </div>
        </main>

        <footer className="app-statusbar">
          <div>模組: 銷售管理 / 訂單輸入</div>
          <div>{new Date().toLocaleString()}</div>
        </footer>
      </div>
    </RepositoryProvider>
  );
};

export default App;
