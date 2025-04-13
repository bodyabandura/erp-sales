import React from "react";
import { Customer } from "../../../domain/entities/Customer";
import { Product } from "../../../domain/entities/Product";
import { Warehouse } from "../../../domain/entities/Warehouse";
import { Salesperson } from "../../../domain/entities/Salesperson";
import { Money } from "../../../domain/value-objects/Money";
import { TaxType } from "../../../domain/entities/Order";
import "./styles/OrderForm.css";

interface OrderFormPresentationProps {
  // Form data
  orderNumber: string;
  orderDate: string;
  customer: Customer | null;
  salesperson: Salesperson | null;
  items: Array<{
    product: Product;
    quantity: number;
    warehouse: Warehouse;
    specifications?: string;
  }>;
  taxType: TaxType;
  notes: string;
  isPrinted: boolean;

  // Calculations
  subtotal: Money;
  discount: Money;
  tax: Money;
  total: Money;
  paidAmount: Money;
  remainingAmount: Money;

  // Lists for dropdowns
  customers: Customer[];
  products: Product[];
  warehouses: Warehouse[];
  salespeople: Salesperson[];

  // Event handlers
  onCustomerChange: (customerId: string) => void;
  onSalespersonChange: (salespersonId: string) => void;
  onDateChange: (date: string) => void;
  onTaxTypeChange: (taxType: TaxType) => void;
  onDiscountChange: (amount: number) => void;
  onPaidAmountChange: (amount: number) => void;
  onNotesChange: (notes: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (
    index: number,
    field: "product" | "quantity" | "warehouse" | "specifications",
    value: any
  ) => void;
  onSave: () => void;
  onPrint: () => void;
}

export const OrderFormPresentation: React.FC<OrderFormPresentationProps> = ({
  orderNumber,
  orderDate,
  customer,
  salesperson,
  items,
  taxType,
  notes,
  isPrinted,
  subtotal,
  discount,
  tax,
  total,
  paidAmount,
  remainingAmount,
  customers,
  products,
  warehouses,
  salespeople,
  onCustomerChange,
  onSalespersonChange,
  onDateChange,
  onTaxTypeChange,
  onDiscountChange,
  onPaidAmountChange,
  onNotesChange,
  onAddItem,
  onRemoveItem,
  onItemChange,
  onSave,
  onPrint,
}) => {
  return (
    <div className="order-form">
      <div className="form-header">
        <div className="header-left">
          <span className="header-logo">🔷</span>
          <span className="header-title">銷售作業</span>
          <span className="header-date">2025/04/10</span>
          <span className="header-time">PM 06:10</span>
          <span className="header-user">使用者:某中医</span>
          <span className="header-server">Server: 192.168.0.1</span>
        </div>
        <div className="header-right">
          <span className="window-control">−</span>
          <span className="window-control">□</span>
          <span className="window-control">×</span>
        </div>
      </div>

      <div className="form-tabs">
        <div className="form-tab active">
          <span className="tab-icon">📝</span>
          <span className="tab-text">銷售主檔</span>
        </div>
      </div>

      <div className="form-body">
        <div className="form-main-container">
          <div className="form-grid-container">
            <table className="form-grid-table">
              <tbody>
                <tr>
                  <td className="form-label">銷售單號:</td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={orderNumber}
                      readOnly
                    />
                  </td>
                  <td className="form-label">銷售日期:</td>
                  <td>
                    <input
                      type="date"
                      className="form-input"
                      value={orderDate}
                      onChange={(e) => onDateChange(e.target.value)}
                    />
                  </td>
                  <td className="form-label">客戶編號:</td>
                  <td>
                    <select
                      className="form-select"
                      value={customer?.id || ""}
                      onChange={(e) => onCustomerChange(e.target.value)}
                    >
                      <option value="">選擇客戶...</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="form-label">客戶資訊:</td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={customer?.name || ""}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form-label">未稅小計:</td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={subtotal.toString()}
                      readOnly
                    />
                  </td>
                  <td className="form-label">折讓金額:</td>
                  <td>
                    <input
                      type="number"
                      className="form-input"
                      value={discount.amount}
                      onChange={(e) =>
                        onDiscountChange(parseFloat(e.target.value))
                      }
                    />
                  </td>
                  <td className="form-label">稅額:</td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={tax.toString()}
                      readOnly
                    />
                  </td>
                  <td className="form-label">銷售人員:</td>
                  <td>
                    <select
                      className="form-select"
                      value={salesperson?.id || ""}
                      onChange={(e) => onSalespersonChange(e.target.value)}
                    >
                      <option value="">選擇業務...</option>
                      {salespeople.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="form-label">帳款日期:</td>
                  <td>
                    <input
                      type="date"
                      className="form-input"
                      value={orderDate}
                      readOnly
                    />
                  </td>
                  <td className="form-label">安裝人員:</td>
                  <td>
                    <input type="text" className="form-input" value="" />
                  </td>
                  <td className="form-label">姓名:</td>
                  <td>
                    <input type="text" className="form-input" value="" />
                  </td>
                  <td className="form-label">指定倉庫:</td>
                  <td>
                    <select className="form-select">
                      <option value="">一號倉</option>
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="form-label">金額合計:</td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={total.toString()}
                      readOnly
                    />
                  </td>
                  <td className="form-label">已付金額:</td>
                  <td>
                    <input
                      type="number"
                      className="form-input"
                      value={paidAmount.amount}
                      onChange={(e) =>
                        onPaidAmountChange(parseFloat(e.target.value))
                      }
                    />
                  </td>
                  <td className="form-label">未結金額:</td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      value={remainingAmount.toString()}
                      readOnly
                    />
                  </td>
                  <td className="form-label">結清日期:</td>
                  <td>
                    <input
                      type="date"
                      className="form-input"
                      disabled={remainingAmount.amount > 0}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form-label">附記事項:</td>
                  <td colSpan={7}>
                    <input
                      type="text"
                      className="form-input"
                      value={notes}
                      onChange={(e) => onNotesChange(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="tax-type-container">
            <div className="tax-type-label">稅別</div>
            <div className="tax-options">
              <div className="tax-option">
                <input
                  type="radio"
                  id="tax-none"
                  name="tax-type"
                  checked={taxType === "none"}
                  onChange={() => onTaxTypeChange("none")}
                />
                <label htmlFor="tax-none">免稅</label>
              </div>
              <div className="tax-option">
                <input
                  type="radio"
                  id="tax-external"
                  name="tax-type"
                  checked={taxType === "external"}
                  onChange={() => onTaxTypeChange("external")}
                />
                <label htmlFor="tax-external">外加</label>
              </div>
              <div className="tax-option">
                <input
                  type="radio"
                  id="tax-internal"
                  name="tax-type"
                  checked={taxType === "internal"}
                  onChange={() => onTaxTypeChange("internal")}
                />
                <label htmlFor="tax-internal">內含</label>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-header">
            <span>銷售明細</span>
          </div>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>項次</th>
                  <th style={{ width: "120px" }}>產品編號</th>
                  <th style={{ width: "80px" }}>單價</th>
                  <th style={{ width: "60px" }}>數量</th>
                  <th style={{ width: "80px" }}>小計</th>
                  <th style={{ width: "60px" }}>倉庫</th>
                  <th>品名規格</th>
                  <th style={{ width: "60px" }}>單位</th>
                  <th style={{ width: "40px" }}>刪</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: "100%" }}
                        value={item.product.id}
                        onChange={(e) =>
                          onItemChange(index, "product", e.target.value)
                        }
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="numeric">{item.product.price.toString()}</td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: "100%" }}
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          onItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td className="numeric">
                      {item.product.price.multiply(item.quantity).toString()}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: "100%" }}
                        value={item.warehouse.id}
                        onChange={(e) =>
                          onItemChange(index, "warehouse", e.target.value)
                        }
                      >
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: "100%" }}
                        value={item.specifications || ""}
                        onChange={(e) =>
                          onItemChange(index, "specifications", e.target.value)
                        }
                        placeholder={item.product.name}
                      />
                    </td>
                    <td>{item.product.unit}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-remove"
                        onClick={() => onRemoveItem(index)}
                        title="刪除項目"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      尚無商品項目
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="items-table-buttons">
            <button className="btn-add" onClick={onAddItem}>
              新增項目
            </button>
          </div>
        </div>
      </div>

      <div className="form-controls">
        <div className="form-nav-buttons">
          <button className="nav-button disabled">⏮</button>
          <button className="nav-button disabled">◀</button>
          <button className="nav-button disabled">▶</button>
          <button className="nav-button disabled">⏭</button>
          <button className="nav-button disabled">🔍</button>
          <button className="nav-button disabled">🗑</button>
          <button className="nav-button disabled">✏️</button>
          <button className="nav-button disabled">💾</button>
          <button className="nav-button disabled">✂️</button>
          <button className="nav-button" onClick={onSave}>
            💲
          </button>
          <button className="nav-button disabled">🖨️</button>
          <button className="nav-button disabled">🔼</button>
        </div>
      </div>

      <div className="form-status">
        <div className="status-message">說明:</div>
        <div className="status-message">
          狀態: {isPrinted ? "已列印" : "未列印"}
        </div>
      </div>
    </div>
  );
};
