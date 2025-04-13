/**
 * Class for building SQL queries using the Builder pattern
 */
export class QueryBuilder {
  private _select: string[] = [];
  private _from: string = "";
  private _joins: string[] = [];
  private _where: string[] = [];
  private _groupBy: string[] = [];
  private _orderBy: string[] = [];
  private _limit: number | null = null;
  private _offset: number | null = null;

  /**
   * Adds columns to the SELECT part of the query
   */
  select(columns: string | string[]): QueryBuilder {
    if (typeof columns === "string") {
      this._select.push(columns);
    } else {
      this._select = [...this._select, ...columns];
    }
    return this;
  }

  /**
   * Sets the FROM table
   */
  from(table: string): QueryBuilder {
    this._from = table;
    return this;
  }

  /**
   * Adds a JOIN to the query
   */
  join(
    table: string,
    condition: string,
    type: "INNER" | "LEFT" | "RIGHT" = "INNER"
  ): QueryBuilder {
    this._joins.push(`${type} JOIN ${table} ON ${condition}`);
    return this;
  }

  /**
   * Adds a WHERE condition with AND
   */
  where(condition: string): QueryBuilder {
    this._where.push(condition);
    return this;
  }

  /**
   * Adds GROUP BY
   */
  groupBy(column: string | string[]): QueryBuilder {
    if (typeof column === "string") {
      this._groupBy.push(column);
    } else {
      this._groupBy = [...this._groupBy, ...column];
    }
    return this;
  }

  /**
   * Adds ORDER BY
   */
  orderBy(column: string, direction: "ASC" | "DESC" = "ASC"): QueryBuilder {
    this._orderBy.push(`${column} ${direction}`);
    return this;
  }

  /**
   * Sets LIMIT
   */
  limit(limit: number): QueryBuilder {
    this._limit = limit;
    return this;
  }

  /**
   * Sets OFFSET
   */
  offset(offset: number): QueryBuilder {
    this._offset = offset;
    return this;
  }

  /**
   * Returns the built SQL query
   */
  build(): string {
    const parts: string[] = [];

    // SELECT
    if (this._select.length > 0) {
      parts.push(`SELECT ${this._select.join(", ")}`);
    } else {
      parts.push("SELECT *");
    }

    // FROM
    if (this._from) {
      parts.push(`FROM ${this._from}`);
    } else {
      throw new Error("FROM clause is required");
    }

    // JOINs
    if (this._joins.length > 0) {
      parts.push(this._joins.join(" "));
    }

    // WHERE
    if (this._where.length > 0) {
      parts.push(`WHERE ${this._where.join(" AND ")}`);
    }

    // GROUP BY
    if (this._groupBy.length > 0) {
      parts.push(`GROUP BY ${this._groupBy.join(", ")}`);
    }

    // ORDER BY
    if (this._orderBy.length > 0) {
      parts.push(`ORDER BY ${this._orderBy.join(", ")}`);
    }

    // LIMIT
    if (this._limit !== null) {
      parts.push(`LIMIT ${this._limit}`);
    }

    // OFFSET
    if (this._offset !== null) {
      parts.push(`OFFSET ${this._offset}`);
    }

    return parts.join(" ");
  }

  /**
   * Creates a base query for selecting orders with joined tables
   */
  static createOrdersBaseQuery(): QueryBuilder {
    return new QueryBuilder()
      .select(["o.*", "c.id as customer_id", "s.id as salesperson_id"])
      .from("orders o")
      .join("customers c", "o.customer_id = c.id")
      .join("salespersons s", "o.salesperson_id = s.id");
  }

  /**
   * Creates a base query for selecting order items with joined tables
   */
  static createOrderItemsBaseQuery(): QueryBuilder {
    return new QueryBuilder()
      .select(["oi.*", "p.id as product_id", "w.id as warehouse_id"])
      .from("order_items oi")
      .join("products p", "oi.product_id = p.id")
      .join("warehouses w", "oi.warehouse_id = w.id");
  }
}
