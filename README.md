# Legacy ERP UI Rebuild

![Project Type](https://img.shields.io/badge/project-test_task-blue)
![Framework](https://img.shields.io/badge/framework-React_Electron-61DAFB)
![Languages](https://img.shields.io/badge/languages-TypeScript_CSS-3178C6)

A desktop application that recreates a legacy ERP system user interface from screenshots using modern web technologies.

<p align="center">
  <img src="https://via.placeholder.com/800x450?text=ERP+Sales+UI+Screenshot" alt="ERP Sales Screenshot" width="800"/>
</p>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technical Documentation](#technical-documentation)
  - [Architecture](#architecture)
  - [Design Patterns](#design-patterns)
  - [Database Schema](#database-schema)
  - [Key Components](#key-components)
- [Development](#development)
- [Building](#building)
- [License](#license)

## Overview

This test task focuses on rebuilding a legacy ERP system interface, specifically the sales order entry form. The application uses React and Electron to create a Windows desktop application with a Traditional Chinese user interface, matching the original pixel-for-pixel while using modern technologies under the hood.

The project implements typical ERP sales functionality with a UI that resembles traditional Windows business software, including dynamic form calculations, database interactions, and sales order processing.

## Features

- **Pixel-perfect UI recreation** - Faithful reproduction of the legacy ERP interface
- **Traditional Chinese interface** - Full support for Chinese characters and layout
- **Sales order management** - Complete order entry functionality
- **Dynamic calculations** - Automatic subtotals, tax, and balance calculation
- **Product catalog** - Product selection with pricing
- **Customer database** - Customer selection and management
- **Inventory tracking** - Warehouse selection and inventory tracking
- **Desktop application** - Native Windows app experience using Electron

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/legacy-erp-rebuild.git
cd legacy-erp-rebuild

# Install dependencies
npm install

# Configure database
# Create a .env file with the following content:
# REACT_APP_MYSQL_HOST=localhost
# REACT_APP_MYSQL_PORT=3306
# REACT_APP_MYSQL_USER=your_username
# REACT_APP_MYSQL_PASSWORD=your_password
# REACT_APP_MYSQL_DATABASE=erp_sales

# Initialize database (creates schema and sample data)
npm run init-db
```

## Usage

```bash
# Development mode
npm start

# Build the application
npm run electron-pack
```

## Project Structure

The project follows Clean Architecture principles with a clear separation of concerns:

```
src/
├── application/         # Application business rules (use cases)
├── domain/              # Enterprise business rules (entities, value objects)
├── infrastructure/      # External interfaces (database, services)
├── presentation/        # UI layer (React components, hooks)
├── App.tsx              # Main application component
└── index.tsx            # Application entry point

public/
├── electron.js          # Electron main process
├── electron-db.js       # Database service for Electron
└── init-db.js           # Database initialization script
```

## Technical Documentation

### Architecture

The application follows the Clean Architecture pattern with four main layers:

1. **Domain Layer** - Core business entities and rules
   - Entities: `Order`, `Customer`, `Product`, `Warehouse`, `Salesperson`
   - Value Objects: `Money`, `OrderNumber`, `TaxCalculation`

2. **Application Layer** - Use cases orchestrating the domain entities
   - `CreateOrderUseCase` - Handles creation of new orders

3. **Infrastructure Layer** - External implementations and services
   - SQL Repositories: `SQLOrderRepository`, `SQLCustomerRepository`, etc.
   - Services: `DatabaseService`, `LoggingService`

4. **Presentation Layer** - User interface components
   - Container Components: `OrderFormContainer` (manages state and logic)
   - Presentation Components: `OrderFormPresentation` (pure UI rendering)

### Design Patterns

- **Repository Pattern** - Abstract data access layer
- **Dependency Injection** - Used in contexts and hooks for repository access
- **Container/Presentation Pattern** - Separation of UI and logic
- **Value Objects** - Encapsulating primitive types with business rules

### Database Schema

```
customers
- id (PK)
- code
- name
- contact
- phone
- address

products
- id (PK)
- code
- name
- description
- price
- unit

warehouses
- id (PK)
- code
- name
- location

salespersons
- id (PK)
- code
- name
- phone

orders
- id (PK)
- order_number
- customer_id (FK)
- salesperson_id (FK)
- order_date
- tax_type
- discount_amount
- notes
- is_printed

order_items
- id (PK)
- order_id (FK)
- product_id (FK)
- warehouse_id (FK)
- quantity
- unit_price
- specifications
```

### Key Components

- **OrderFormContainer** - Manages order state, calculations, and business logic
- **OrderFormPresentation** - Renders the order form UI without business logic
- **Money** - Value object handling monetary calculations and formatting
- **TaxCalculation** - Handles different tax calculation strategies
- **SQLOrderRepository** - Manages order persistence in the database

## Development

```bash
# Start the development server
npm run react-start

# Run tests
npm test

# Check database structure
npm run check-db
```

## Building

```bash
# Build the React app
npm run react-build

# Package the Electron app
npm run electron-pack
```

This creates a portable Windows executable in the `dist` directory.
