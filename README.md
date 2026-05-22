# Bank Management System Sprint

Microservices-based bank management application with Spring Boot backends and an Angular frontend.

## Architecture

- **eureka-server** (8761) — Service discovery
- **customer-service** (8081) — Customer CRUD
- **bank-service** (8083) — Accounts, deposits, withdrawals, transfers
- **transaction-service** (8084) — Transaction audit log
- **bank-management-ui** (4200) — Angular 17 SPA

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+ and npm

## Quick start

See `START-HERE.bat` for startup order and URLs.

1. Start **eureka-server** and wait until it is ready.
2. Start **customer-service**, **bank-service**, **transaction-service**.
3. In `bank-management-ui`: `npm install` then `npm start`.
4. Open http://localhost:4200

## Tech stack

- Spring Boot 3.2, Spring Cloud (Eureka, OpenFeign)
- Spring Data JPA, H2 (in-memory)
- Angular 17, TypeScript, RxJS
