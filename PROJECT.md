# ERP Sales Desktop Application - Technical Overview

## Project Summary
- Rebuilt legacy ERP UI from screenshots using React + Electron
- Created Windows desktop application (not web-based)
- Implemented pixel-perfect Traditional Chinese interface
- Used clean architecture for maintainable codebase

## Technical Highlights

### Architecture
- **Clean Architecture** with distinct layers:
  - Domain Layer (entities, value objects)
  - Application Layer (use cases)
  - Infrastructure Layer (repositories, services)
  - Presentation Layer (UI components)

### Frontend
- React.js with TypeScript
- CSS styling (no frameworks)
- Components separated into presentation and container logic

### Backend
- Electron.js for desktop application packaging
- MySQL/MsSQL database integration
- IPC communication between Electron main process and renderer

### Business Logic
- Order entry system with products, customers, warehouses
- Automatic subtotal calculation (quantity × price)
- Tax calculations (none, external, internal)
- Dynamic form validation

## Technical Decisions

### Why React + Electron?
- Modern development experience with React
- Cross-platform desktop capabilities with Electron
- Ability to use web technologies for desktop applications

### Why Clean Architecture?
- Separation of concerns for maintainability
- Domain-driven design focuses on business rules
- Easy to test each layer independently
- Infrastructure changes don't affect domain logic

### CSS vs CSS Frameworks
- Custom CSS allowed for pixel-perfect recreation of legacy UI
- Better control over specific legacy UI elements
- No unused CSS bloat from frameworks

### TypeScript Benefits
- Type safety for complex domain objects
- Better IDE support and code completion
- Easier refactoring and maintenance 