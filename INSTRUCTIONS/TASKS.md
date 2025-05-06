# Implementation Task List

## Detailed Task Breakdown (High-Level)

*(This is a preliminary list; detailed tasks will be created in a project management tool)*

**Foundation:**
*   Setup Git repository.
*   Setup Next.js project.
*   Integrate Shadcn UI.
*   Setup Neon DB instance.
*   Setup Drizzle ORM & initial schema migration.
*   Implement Clerk Authentication integration (Login, Logout, retrieving user metadata).
*   Setup basic CI/CD pipeline (e.g., Vercel deployment).

**Core Data Management:**
*   Develop UI & API for Company CRUD.
*   Develop UI & API for Site CRUD (linked to Company).
*   Develop UI & API for Vendor CRUD.
*   Develop UI & API for Stock Group CRUD.
*   Develop UI & API for Stock Item CRUD (linked to Group, UoM).
*   Implement UoM management.
*   Implement Excel Upload feature for Stock Items (Backend logic, Frontend UI).
*   Implement basic Admin dashboard (for managing non-user master data).

**PO, GRN & Issuance Workflow:**
*   Develop UI & API for PO Creation form.
*   Implement PO Number generation logic.
*   Implement PO Submission & Status updates.
*   Develop UI & API for PO Approval view/actions.
*   Implement PO Approval routing logic (simple).
*   Develop UI & API for GRN Creation (PO-based).
*   Develop UI & API for GRN Creation (Direct Receipt).
*   Implement GRN Number generation logic.
*   Implement Inventory Ledger update logic on GRN save.
*   Implement FIFO layer creation logic.
*   Develop UI & API for Material Issuance form.
*   Implement Issuance Number generation logic.
*   Implement FIFO consumption logic for issuance.
*   Implement Inventory Ledger update logic on Issuance save ("OUT" entry).
*   Develop UI for viewing PO/GRN/Issuance lists and details.

**Billing & Payment Workflow:**
*   Develop UI & API for Bill Creation (linking GRNs/POs).
*   Implement Bill Number generation logic.
*   Implement Bill Submission & Status updates.
*   Develop UI & API for Bill Approval view/actions.
*   Implement Bill Approval routing logic.
*   Develop UI & API for Payment Recording form.
*   Implement Bill status updates based on payments.
*   Develop UI for viewing Bill/Payment lists and details.

**Reporting:**
*   Develop backend logic for FIFO Inventory Valuation calculation.
*   Develop UI for Inventory Valuation Report (filters, display, export).
*   Develop backend logic for Purchase History aggregation.
*   Develop UI for Purchase History Report (filters, display, export).
*   Implement Audit Log/Transaction Log mechanism.
*   Develop UI for viewing Audit Logs (filters).
*   Develop backend logic for Approval Status tracking.
*   Develop UI for Approval Status Report (filters, display).
*   Develop backend logic for Material Issuance Report.
*   Develop UI for Material Issuance Report (filters, display, export).

**Testing & Deployment:**
*   Write Unit Tests.
*   Write Integration Tests.
*   Perform Manual End-to-End Testing.
*   Coordinate and support UAT.
*   Address bugs identified during testing.
*   Prepare production deployment scripts/configurations.
*   Execute production deployment.
*   Perform post-deployment checks.
