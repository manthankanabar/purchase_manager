# 1. Introduction

## 1.1. Purpose of the Document

This Product Requirements Document (PRD) serves as the definitive guide for the development of the internal Purchase Management Application for the construction company. Its primary purpose is to articulate the vision, functional specifications, non-functional requirements, technical constraints, and overall scope of the application. This document aims to establish a shared understanding among all stakeholders, including the development team, product managers, designers, and company management, regarding the features, functionalities, and objectives of the system. It provides a detailed blueprint that will guide the design, development, testing, and deployment phases, ensuring that the final product aligns precisely with the business needs and operational requirements of the construction company operating across multiple entities and sites within India. By clearly defining the requirements, this PRD minimizes ambiguity, reduces the risk of scope creep, and facilitates effective communication and collaboration throughout the project lifecycle, ultimately contributing to the successful delivery of a high-quality, fit-for-purpose application.

## 1.2. Product Overview

The Purchase Management Application is envisioned as a comprehensive, web-based internal tool designed specifically to address the complex procurement and basic inventory management needs of a multi-entity construction company operating in India. The application will centralize and streamline the entire procurement lifecycle, encompassing vendor management, stock item definition, purchase order (PO) creation and approval, goods receipt processes at various construction sites, invoice (bill) processing and approval, and final payment recording. A key feature is its inherent support for multi-company operations, allowing seamless management of procurement activities across different legal entities under the parent organization, each potentially operating with different base currencies (though primarily focused on INR, flexibility for others is required). Furthermore, the system will incorporate basic inventory management capabilities, specifically utilizing the First-In, First-Out (FIFO) method to track material quantities and values as they are received and implicitly consumed (consumption tracking is out of scope for this phase, but valuation is required). Built using a modern technology stack comprising Next.js, React, Shadcn UI for the frontend, and Neon DB with Drizzle ORM for the backend database, the application aims to provide a robust, scalable, and user-friendly experience for internal staff, enhancing operational control and data visibility.

## 1.3. Goals and Objectives

The overarching goal of the Purchase Management Application is to significantly enhance the operational efficiency and financial control of the construction company's procurement and inventory processes. This will be achieved through the following specific objectives:

*   **Streamline Procurement Workflow:** To automate and standardize the end-to-end procurement process, from PO generation to payment, reducing manual effort, minimizing errors, and accelerating cycle times.
*   **Improve Financial Tracking and Control:** To provide accurate and timely tracking of purchase commitments, expenditures, and vendor payments across multiple companies and sites, enabling better budget management and financial oversight.
*   **Enable Multi-Company Operations:** To design a system architecture that natively supports multiple distinct company entities, allowing for segregated yet centrally managed procurement operations, including distinct currency settings per company.
*   **Implement Basic Inventory Management:** To introduce a foundational inventory tracking system using the FIFO method for accurate quantity and value management of materials received at different sites, providing visibility into stock levels and valuation.
*   **Enhance Data Accuracy and Accessibility:** To centralize procurement and inventory data in a single system, ensuring data integrity and providing authorized users with easy access to relevant information and reports.
*   **Establish Clear Approval Hierarchies:** To implement role-based access control and defined approval workflows for POs and bills, ensuring proper authorization and accountability.
*   **Provide Actionable Reporting:** To generate key reports, including FIFO inventory valuation, purchase history, transaction logs, and approval status tracking, supporting informed decision-making.
*   **Deliver a User-Friendly Interface:** To create an intuitive and efficient user interface using modern design principles and components (Shadcn UI) that simplifies task completion for all user roles.

## 1.4. Target Audience

The Purchase Management Application is designed for internal use within the construction company. The primary users of this application include:

*   **Procurement Team / PO Creators:** Staff responsible for identifying material needs, selecting vendors, and creating Purchase Orders.
*   **Management / PO Approvers:** Managers or designated personnel responsible for reviewing and approving Purchase Orders based on predefined criteria (e.g., value thresholds).
*   **Site Supervisors / Material Receivers:** Personnel located at various construction sites responsible for receiving materials, verifying quantities against POs (if applicable), and recording Goods Received Notes (GRNs).
*   **Accounts / Finance Team:** Staff responsible for creating bills based on GRNs/POs, managing the bill approval process, and recording payment details against approved bills.
*   **System Administrators:** IT personnel responsible for managing user accounts, roles, permissions, company setup, and overall system configuration and maintenance.
*   **Inventory Managers (Implicit):** While not a distinct role initially, users interacting with stock definitions and viewing inventory reports fall into this category.

## 1.5. Scope

**In Scope:**

The following features and functionalities are considered within the scope of this project:

*   User authentication and role-based access control (PO Creator, PO Approver, Site Supervisor, Admin).
*   Multi-company setup and management, including currency configuration per company.
*   Site management (creation, association with companies).
*   Vendor management (CRUD operations, storing basic vendor details).
*   Stock item and stock group management, including definition and categorization.
*   Functionality to upload stock items via Excel.
*   Complete procurement workflow:
    *   Purchase Order (PO) creation, submission, and multi-level approval.
    *   Goods Received Note (GRN) creation at site level, with or without a PO reference.
    *   Bill creation based on GRN and/or PO.
    *   Bill approval workflow.
    *   Recording of payments made against approved bills.
*   Basic inventory tracking (quantity and value) using the FIFO method, updated upon material receipt and issuance.
*   Simple material issuance tracking (recording quantity issued from site inventory).
*   Reporting: FIFO Inventory Valuation, Purchase History by Material, Transaction Logs, Approval Status Tracking, Material Issuance Report.
*   Development using the specified tech stack: Next.js, React, Shadcn UI, Neon DB, Drizzle ORM.

**Out of Scope:**

The following features and functionalities are explicitly excluded from the scope of this initial version:

*   Advanced accounting integration (e.g., direct posting to ledgers in external accounting software).
*   Complex inventory features like batch tracking, serial number tracking, stock adjustments (beyond initial receipt), or stock transfers between sites.
*   Supplier portal or external vendor access.
*   Request for Quotation (RFQ) or tendering processes.
*   Contract management features.
*   Budgeting modules or budget checking during PO creation.
*   Advanced reporting or Business Intelligence (BI) features beyond those specified.
*   Mobile application (the web application should be responsive).
*   Integration with other internal systems unless explicitly stated.
*   Multi-language support (Default: English).
*   Asset management features.

# 2. Assumptions and Constraints

## 2.1. Assumptions

The development and successful implementation of the Purchase Management Application are based on the following assumptions:

*   **User Accessibility:** All intended users (Procurement, Management, Site Supervisors, Accounts, Admins) will have access to compatible devices (desktops/laptops) with modern web browsers and reliable internet connectivity at their respective work locations (offices and construction sites).
*   **Data Availability:** Necessary master data, such as initial company details, site locations, vendor information, and potentially a preliminary list of common stock items, will be available and provided in a usable format (e.g., spreadsheets) for initial system setup or migration.
*   **User Training:** The construction company will allocate resources and time for training the end-users on how to effectively use the new application.
*   **Defined Business Processes:** While the application aims to streamline workflows, it assumes that the core business logic for procurement approvals (e.g., who approves what based on value or type) is defined or will be defined by the company prior to implementation.
*   **Stable Requirements:** The core requirements outlined in this document are expected to remain relatively stable throughout the initial development phase. Significant changes might impact timelines and resources.
*   **Technical Environment Readiness:** The necessary infrastructure for hosting (even if cloud-based like Neon DB) and deployment will be available and compatible with the chosen technology stack.
*   **Collaboration:** Stakeholders from different departments (Procurement, Finance, Site Operations, IT) will be available for clarifications, feedback, and user acceptance testing during the development lifecycle.
*   **Single Currency Focus (Initially):** While multi-currency support per company is a requirement, it is assumed that the primary operational currency for most transactions initially will be INR (Indian Rupee), and the complexities associated with extensive foreign currency transactions are minimal for the first version.
*   **FIFO Suitability:** It is assumed that the FIFO method is an acceptable and sufficient inventory valuation method for the company's current needs regarding basic material tracking.

## 2.2. Constraints

The project is subject to the following constraints:

*   **Technology Stack:** The application *must* be developed using the specified technology stack: Next.js with React and Shadcn UI for the frontend, Neon DB with Drizzle ORM for the database. Authentication solutions must be compatible.
*   **Internal Use Only:** The application is strictly for internal use within the construction company and its associated entities. No external access (e.g., vendor portals) is required in this phase.
*   **Scope Limitations:** The features are limited to those defined as "In Scope" in section 1.5. Features listed as "Out of Scope" will not be included in the initial release.
*   **Basic Inventory:** Inventory management is limited to FIFO tracking of quantity and value based on goods receipts. It does not include consumption, adjustments, transfers, or more complex valuation methods.
*   **Reporting Limitations:** Reporting capabilities are restricted to the specific reports mentioned (Inventory Valuation, Purchase History, Transaction Logs, Approval Status). Complex custom reporting or BI integration is not included.
*   **Resource Availability:** The project timeline and success depend on the availability of skilled development resources proficient in the specified technology stack and the availability of internal stakeholders for input and testing.
*   **Budget:** The project must be completed within the allocated budget (details assumed to be managed separately).
*   **Timeline:** There might be an implicit or explicit deadline for the project delivery (details assumed to be managed separately).
*   **Regulatory Compliance:** While not explicitly detailed in the prompt, the application must implicitly adhere to relevant Indian financial and data privacy regulations as applicable to internal procurement systems.

# 3. Functional Requirements

This section details the specific functionalities the Purchase Management Application must provide to meet the user and business needs.

## 3.1. User Management & Roles

The system must provide robust user management capabilities with clearly defined roles and permissions to ensure secure and appropriate access to functionalities and data.

### 3.1.1. User Authentication (via Clerk)
*   **Provider:** User authentication will be handled externally via Clerk ([https://clerk.com/](https://clerk.com/)). The application will integrate with Clerk using its Next.js SDK and pre-built components.
*   **Login Methods:** Clerk will be configured by the Administrator to support desired login methods (e.g., email/password, social logins like Google).
*   **User Profiles:** Basic user profile information (name, email) will be managed within Clerk.
*   **Session Management:** Clerk will manage user sessions securely, including session timeouts.
*   **Password Management:** Password resets and related security features will be handled by Clerk.
*   **Integration:** The application must securely verify the user's authentication status provided by Clerk and retrieve necessary user information (like user ID and potentially custom attributes/metadata representing role and assigned company/companies) upon successful login.

### 3.1.2. Role Definitions (Managed via Clerk)
User roles (Admin, User) will be defined and assigned externally within the Clerk dashboard, potentially using custom attributes or metadata. The application will read this role information upon user login.
*   **Admin:** Has full access to all system features and data across all assigned companies (defaults to all companies). Responsible for managing company and site configurations, managing stock groups, overseeing system settings, and performing all approvals (POs and Bills). User creation and role assignment are handled in Clerk.
*   **User:** Has access to all features *except* approvals within their assigned company/companies (company assignment also managed via Clerk metadata). Can create POs, GRNs, Bills, record payments, manage master data (vendors, stock items), run reports, etc., but cannot approve POs or Bills.

### 3.1.3. Permissions
Permissions will be managed based on the roles assigned in Clerk. Key principles include:
*   **Admin Supremacy:** Users with the Admin role (assigned in Clerk) have full control and approval rights.
*   **User Limitation:** Users with the User role (assigned in Clerk) have operational access but lack approval capabilities.
*   **Data Scoping (Company):** Access for both Admins and Users is scoped by company. Company assignments will be managed via Clerk metadata. Users only see data relevant to their assigned, currently selected company context.

## 3.2. Company & Site Management
The application must support operations across multiple legal entities and physical locations.

### 3.2.1. Multi-company Setup
*   **Company Creation:** Administrators must be able to define and manage multiple company entities within the system.
*   **Company Details:** Each company record should store essential information such as Company Name, Legal Address, Tax Identification Numbers (e.g., GSTIN for India), and other relevant registration details.
*   **Data Segregation:** Procurement data (POs, GRNs, Bills, Payments) must be associated with a specific company. Users' access might be restricted based on the company they belong to or have permissions for (to be defined in the Permissions Matrix).
*   **Default Settings:** Ability to set company-specific defaults where applicable.

### 3.2.2. Currency Configuration per Company
*   **Base Currency:** Each company defined in the system must have a designated base currency (e.g., INR). Administrators must set this base currency during company setup.
*   **Single Currency Operation:** For V1, all transactions (POs, GRNs, Bills, Payments) and reporting within a company context will be exclusively in that company's designated base currency. Support for multi-currency transactions and exchange rate management is out of scope for V1.
*   **Currency Display:** The base currency symbol/code should be displayed appropriately alongside monetary values throughout the application context for the selected company.

### 3.2.3. Site Management
*   **Site Creation:** Administrators must be able to define multiple operational sites (e.g., construction project locations, warehouses).
*   **Site Association:** Each site must be associated with one parent company.
*   **Site Details:** Each site record should store information like Site Name/Code, Address, Site Contact Person.
*   **Site Usage:** Sites will be used primarily as delivery locations for Purchase Orders and the location where Goods Received Notes (GRNs) are generated.
*   **Site Filtering:** Users (especially Site Supervisors) should be able to filter views and operations based on the site(s) they are assigned to.

## 3.3. Vendor Management
The system needs to maintain a central repository of approved vendors.

### 3.3.1. Vendor CRUD Operations
*   **Create Vendor:** Authorized users (e.g., Procurement Team, Admin) must be able to add new vendors to the system.
*   **Read/View Vendor:** Users should be able to search, view, and list existing vendors.
*   **Update Vendor:** Authorized users must be able to modify the details of existing vendors.
*   **Deactivate/Archive Vendor:** Functionality to mark vendors as inactive rather than deleting them, preserving historical transaction data.

### 3.3.2. Vendor Details
Each vendor record should store essential information, including but not limited to:
*   Vendor Name
*   Vendor Code (System-generated or manual)
*   Contact Information (Address, Phone Number, Email)
*   Primary Contact Person
*   Tax Information (e.g., PAN, GSTIN for Indian vendors)
*   Bank Account Details (for payment reference - sensitive data handling required)
*   Payment Terms (e.g., Net 30, Net 60 - informational)
*   Vendor Status (Active/Inactive)
*   Association with Company (Indicates which company entity primarily deals with this vendor, though a vendor might supply to multiple companies).

## 3.4. Stock Management
The application must allow for the definition and categorization of materials/stock items purchased by the company.

### 3.4.1. Stock Item Definition
*   **Create Stock Item:** Authorized users (e.g., Procurement, Admin) must be able to define new stock items.
*   **Item Details:** Each stock item record should include:
    *   Item Code (Unique identifier, potentially system-generated or manual)
    *   Item Name/Description
    *   Unit of Measurement (UoM) (e.g., Bags, Tonnes, Liters, Numbers, Meters). A configurable list of UoMs should be manageable by Admins.
    *   Stock Group Association (Link to a stock group for categorization).
    *   Optional: Basic specifications or attributes (e.g., Grade, Size) - keep simple initially.
    *   Item Status (Active/Inactive).
*   **Read/Update/Deactivate:** Standard CRUD operations for managing stock items, with deactivation preferred over deletion for historical data integrity.

### 3.4.2. Stock Group Management
*   **Purpose:** To categorize stock items for reporting and organizational purposes (e.g., Cement, Steel, Electricals, Consumables).
*   **CRUD Operations:** Administrators should be able to create, view, update, and potentially deactivate stock groups.
*   **Hierarchy:** Simple, flat list of groups initially. Hierarchical grouping is out of scope for this version.

### 3.4.3. Excel Upload for Stock Items
*   **Functionality:** Provide a feature for authorized users (Admin) to bulk upload or update stock item definitions using a predefined Excel template.
*   **Template:** A downloadable Excel template should be provided, clearly indicating the required columns and data formats (Item Code, Name, UoM, Stock Group Name, etc.).
*   **Validation:** The system must perform validation during the upload process:
    *   Check for required fields.
    *   Validate data types.
    *   Check for duplicate Item Codes.
    *   Verify that the specified Stock Group exists.
*   **Error Reporting:** Provide clear feedback to the user on the success or failure of the upload, including specific error messages for rows that failed validation.
*   **Modes:** Support both adding new items and updating existing items (based on Item Code match).

## 3.5. Procurement Workflow
This section describes the end-to-end flow for procuring goods, from order placement to payment.

### 3.5.1. Purchase Order (PO) Creation
*   **Initiation:** PO Creators can initiate a new Purchase Order.
*   **Header Information:** The PO must capture header details such as:
    *   Associated Company
    *   Selected Vendor
    *   PO Date
    *   Expected Delivery Date (Optional)
    *   Delivery Site
    *   PO Number (System-generated, unique per company, sequential)
    *   Currency (Defaults from Company, potentially changeable if multi-currency transactions are enabled)
    *   Payment Terms (Pulled from Vendor, editable)
    *   Remarks/Notes
*   **Line Items:** Users must be able to add multiple line items to the PO, each specifying:
    *   Stock Item (Selected from the defined list)
    *   Description (Pulled from Stock Item, editable)
    *   Quantity
    *   Unit of Measurement (UoM) (Pulled from Stock Item)
    *   Unit Price
    *   Total Price (Quantity * Unit Price - calculated automatically)
    *   Tax Details (e.g., a single tax rate field per line or per PO, representing the applicable tax percentage. Complex GST logic is out of scope for V1).
*   **Calculations:** The system must automatically calculate the total amount for each line item and the overall PO total (including taxes, if applicable).
*   **Draft Saving:** Ability to save a PO as a draft before submitting for approval.
*   **Submission:** Once complete, the PO Creator submits the PO, triggering the approval workflow.

### 3.5.2. PO Approval Workflow
*   **Trigger:** Workflow starts when a PO is submitted.
*   **Routing:** The PO is routed to users with the Admin role for approval.
*   **Notification:** Admins should be notified (in-app notification, potentially email) about POs pending their approval.
*   **Review:** Admins can view the complete PO details.
*   **Actions:** An Admin can either:
    *   **Approve:** The PO status changes to 'Approved'.
    *   **Reject:** The PO status changes to 'Rejected'. The Admin must provide a reason for rejection.
*   **Status Tracking:** The status of the PO (Draft, Pending Approval, Approved, Rejected, Partially Received, Fully Received, Closed) must be clearly visible.
*   **History:** An audit trail of approval actions (who approved/rejected, when, comments) should be maintained.

### 3.5.3. Material Receipt (GRN - Goods Received Note)
*   **Initiation:** Site Supervisors at the designated delivery site initiate a GRN upon receiving materials.
*   **Receipt Types:** 
    *   **Receipt with PO Reference:** The Site Supervisor selects the relevant Approved PO. Line items from the PO are pre-populated. The supervisor enters the actual quantity received against each line item. Partial receipts must be supported (receiving less than the ordered quantity).
    *   **Receipt without PO Reference (Direct Receipt):** For materials received without a prior PO (e.g., emergency purchases, free samples). The Site Supervisor manually enters the Vendor (if known), Stock Item, Quantity Received, and UoM. These GRNs will need separate handling in the Bill creation/approval process.
*   **GRN Details:** The GRN must capture:
    *   GRN Number (System-generated, unique per site/company)
    *   GRN Date
    *   Associated Site
    *   Reference PO Number (if applicable)
    *   Vendor Name (from PO or entered manually)
    *   Received By (User ID of Site Supervisor)
    *   Line items detailing Stock Item, Quantity Received, UoM.
    *   Remarks/Notes (e.g., condition of goods).
    *   Vehicle Number / Delivery Challan Number (Optional)
*   **Inventory Update:** Upon saving a GRN, the system must update the inventory records for the received stock items at that specific site, increasing the quantity. For PO-based GRNs, the value is recorded based on the PO price. For Direct Receipts, the unit cost field will be left blank on the GRN and must be entered by the Accounts team during Bill creation before the inventory value can be fully updated. FIFO logic applies here for valuation layers.
*   **PO Status Update:** If the GRN is linked to a PO, the PO status should be updated (e.g., 'Partially Received', 'Fully Received') based on the quantities received against ordered quantities.

### 3.5.4. Bill Creation (Against GRN/PO)
*   **Initiation:** Accounts Users create Bills (Vendor Invoices) within the system.
*   **Basis:** Bills are typically created based on one or more GRNs from a vendor, or directly against a PO (for services or items not requiring GRN).
*   **Linking:** The user selects the Vendor and then chooses the relevant GRN(s) or PO(s) to bill against.
*   **Data Population:** Line items, quantities, and prices should be populated from the selected GRN(s)/PO(s).
*   **Verification & Discrepancy Handling:** The Accounts User verifies the details against the physical vendor invoice. The system should highlight any discrepancies (quantity or price) between the Bill and the linked GRN(s)/PO(s). Discrepancies up to 5% (value) are tolerated. Discrepancies over 5% must be noted and will require Admin approval.
*   **Adjustments:** Minor adjustments might be needed (e.g., adding freight charges). Significant adjustments related to core item quantity/price should follow the discrepancy handling rule.
*   **Bill Details:** The Bill must capture:
    *   Bill Number (System-generated, unique per company)
    *   Vendor Invoice Number (Manual entry)
    *   Vendor Invoice Date (Manual entry)
    *   Bill Date (System date)
    *   Associated Company
    *   Reference GRN(s)/PO(s)
    *   Due Date (Calculated based on Vendor terms or entered manually)
    *   Line items (Item, Quantity, Price, Taxes, Total)
    *   Total Bill Amount.
*   **Submission:** Once verified, the Accounts User submits the Bill for approval.

### 3.5.5. Bill Approval Workflow
*   **Trigger:** Workflow starts when a Bill is submitted by a User.
*   **Routing:** Bills are routed to users with the Admin role for approval.
*   **Notification:** Admins are notified of Bills pending their approval.
*   **Review:** Admins review the Bill details, comparing against linked GRN(s)/PO(s) and noting any highlighted discrepancies.
*   **Actions:** An Admin can:
    *   **Approve:** Bill status changes to 'Approved for Payment'. If a discrepancy > 5% exists, the Admin's approval acts as the override (potentially requiring a comment).
    *   **Reject:** Bill status changes to 'Rejected'. Reason required.
*   **Status Tracking:** Bill status (Draft, Pending Approval, Approved for Payment, Partially Paid, Paid, Rejected) must be tracked.
*   **History:** Audit trail of approval actions (who approved/rejected, when, comments).

### 3.5.6. Payment Recording
*   **Initiation:** Accounts Users record payments made against 'Approved for Payment' Bills.
*   **Selection:** User selects the approved Bill(s) to pay.
*   **Payment Details:** Record key payment information:
    *   Payment Date
    *   Amount Paid (Partial payments must be supported)
    *   Payment Mode (e.g., Bank Transfer, Cheque, Cash)
    *   Reference Number (e.g., Transaction ID, Cheque No.)
    *   Bank Details (From which company bank account payment was made - informational initially)
    *   Remarks
*   **Status Update:** The Bill status is updated (e.g., 'Partially Paid', 'Paid').
*   **No Banking Integration:** This module only records payment details; it does not initiate actual bank transactions.
*   **Reporting:** Payment details should be available in reports.

## 3.6. Inventory Management
The system will provide basic inventory tracking capabilities focused on quantity and value, using the FIFO method for both receipts and issuances.

### 3.6.1. FIFO Tracking (Quantity and Value)
*   **Method:** Inventory valuation and consumption will strictly follow the First-In, First-Out (FIFO) principle.
*   **Tracking Level:** Inventory quantities and values will be tracked per Stock Item per Site.
*   **Value Layers:** When materials are received via GRN, the system must record:
    *   The quantity received.
    *   The date of receipt.
    *   The unit cost (derived from the associated PO or entered value for direct receipts).
    *   This creates a distinct inventory layer (batch) for FIFO purposes.
*   **Quantity Updates:**
    *   Inventory quantity for a specific item at a specific site increases when a GRN is created for that item/site.
    *   Inventory quantity for a specific item at a specific site decreases when a Material Issuance is recorded for that item/site.
*   **Consumption:** When materials are issued, the system must consume the oldest available inventory layers first based on the FIFO principle. The cost of goods issued will be based on the cost of these consumed layers.
*   **Value Calculation:** The value of inventory on hand for an item at a site is calculated by summing the value of the remaining quantities in each FIFO layer (Remaining Quantity in Layer * Original Unit Cost of Layer).

### 3.6.2. Material Issuance
*   **Purpose:** To record the removal of materials from site inventory for use (e.g., on a specific construction task or project phase - tracking purpose might be simplified initially).
*   **Initiation:** Authorized users (e.g., Site Supervisor or a dedicated Storekeeper role - TBD) can record material issuance.
*   **Issuance Details:** The Material Issuance record must capture:
    *   Issuance ID/Number (System-generated, unique per site/company).
    *   Issuance Date.
    *   Associated Site (From which inventory is issued).
    *   Issued To / Purpose (Simple text field initially, e.g., "Block A Concrete Work", "Issued to Subcontractor X").
    *   Issued By (User ID of the person recording the issuance).
    *   Line items detailing: Stock Item, Quantity Issued, UoM.
    *   Remarks/Notes.
*   **Inventory Update:** Upon saving a Material Issuance record, the system must:
    *   Validate that sufficient quantity exists for the item at the site.
    *   Decrease the inventory quantity for the issued item(s) at the site.
    *   Consume the appropriate FIFO layers, reducing the `RemainingQuantity` in those layers.
    *   Record the cost of the issued materials based on the consumed FIFO layers.
*   **No Approval Workflow:** Simple issuance recording is required initially; no approval workflow is in scope for V1.

### 3.6.3. Stock Ledger Updates
*   **Ledger Concept:** An internal stock ledger should be maintained for each Stock Item at each Site.
*   **Entries:**
    *   Every GRN will create an 'IN' entry in the corresponding stock ledger, recording the date, GRN number, quantity received, unit cost, and total value of the receipt.
    *   Every Material Issuance will create an 'OUT' entry in the corresponding stock ledger, recording the date, Issuance number, quantity issued, the calculated FIFO cost per unit for the issuance, and the total cost of the issuance.
*   **Running Balance:** The ledger must allow for calculating the running quantity balance and potentially the running value balance for each item/site.

## 3.7. Reporting
The application must provide essential reports to give visibility into procurement activities and inventory status.

### 3.7.1. Inventory Valuation Report (FIFO)
*   **Purpose:** To report the value of stock currently held at different sites, calculated using the FIFO method.
*   **Parameters/Filters:**
    *   Company
    *   Site (Allow selection of one, multiple, or all sites within a company)
    *   Stock Item / Stock Group (Optional: filter for specific items or groups)
    *   As of Date (Report should reflect inventory status as of the end of the selected date)
*   **Content:** The report should list, for each Stock Item at the selected Site(s):
    *   Stock Item Code & Name
    *   Site Name
    *   Unit of Measurement (UoM)
    *   Total Quantity on Hand (as of the specified date)
    *   FIFO Value per Unit (Weighted average cost based on remaining FIFO layers)
    *   Total FIFO Value (Total Quantity * FIFO Value per Unit)
*   **Detailed View (Optional):** Ability to drill down (or show in a separate section) the specific FIFO layers contributing to the quantity and value (Date Received, GRN Ref, Quantity in Layer, Unit Cost of Layer, Value of Layer).
*   **Format:** Displayed on screen with options to export (e.g., CSV, potentially PDF).

### 3.7.2. Purchase History Report (by Material Type)
*   **Purpose:** To track procurement trends and costs for different types of materials.
*   **Parameters/Filters:**
    *   Company
    *   Site (Optional)
    *   Vendor (Optional)
    *   Stock Item / Stock Group
    *   Date Range (Start Date, End Date - based on PO Date or Bill Date, TBD)
*   **Content:** The report should aggregate purchase data based on the filters, showing:
    *   Stock Item Code & Name
    *   Stock Group
    *   Total Quantity Purchased (within the date range)
    *   Unit of Measurement (UoM)
    *   Average Purchase Price (Total Value / Total Quantity)
    *   Total Purchase Value
*   **Grouping:** Ability to group results by Stock Group, Vendor, or Site.
*   **Drill-down:** Potentially allow clicking on an item to see the individual POs or Bills contributing to the total.
*   **Format:** On-screen display, exportable (CSV/PDF).

### 3.7.3. Transaction Logs / Audit Trail
*   **Purpose:** To provide a basic audit trail of key activities within the system for traceability and accountability.
*   **Tracked Actions:** Should log events such as:
    *   User Login/Logout (Optional, depending on security needs)
    *   Creation/Modification/Deletion (or Deactivation) of key master data (Users, Companies, Sites, Vendors, Stock Items).
    *   Creation/Submission/Approval/Rejection of POs and Bills.
    *   Creation of GRNs.
    *   Recording of Payments.
*   **Log Details:** Each log entry should capture:
    *   Timestamp
    *   User performing the action
    *   Action performed (e.g., "PO Approved", "Vendor Created")
    *   Relevant Entity ID (e.g., PO Number, Vendor ID)
    *   Key details (e.g., Rejection reason, if applicable)
*   **Access:** Primarily for Administrators.
*   **Filtering/Search:** Ability to filter logs by User, Date Range, Action Type, Entity ID.
*   **Format:** On-screen display, potentially exportable for archival.

### 3.7.4. Approval Status Tracking Report (PO, Bills)
*   **Purpose:** To provide visibility into the status of documents currently in the approval workflow.
*   **Parameters/Filters:**
    *   Company
    *   Document Type (PO or Bill)
    *   Status (e.g., Pending Approval, Rejected)
    *   Approver (Optional: see items pending for a specific approver)
    *   Creator (Optional: see items submitted by a specific creator)
    *   Date Range (Based on submission date)
*   **Content:** The report should list documents matching the criteria, showing:
    *   Document Number (PO No. / Bill No.)
    *   Document Date
    *   Creator
    *   Current Status
    *   Pending Approver (if applicable)
    *   Amount
    *   Vendor
    *   Age (Time since submission)
*   **Format:** On-screen display, potentially with links to view the document details.



### 3.7.5. Material Issuance Report
*   **Purpose:** To track materials issued from inventory at various sites.
*   **Parameters/Filters:**
    *   Company
    *   Site (Allow selection of one, multiple, or all sites)
    *   Stock Item / Stock Group (Optional)
    *   Date Range (Start Date, End Date - based on Issuance Date)
    *   Issued To / Purpose (Optional: filter by purpose text)
*   **Content:** The report should list individual issuance transactions matching the criteria, showing:
    *   Issuance ID/Number
    *   Issuance Date
    *   Site Name
    *   Stock Item Code & Name
    *   Quantity Issued
    *   Unit of Measurement (UoM)
    *   FIFO Cost per Unit (Cost at which the item was issued)
    *   Total FIFO Cost of Issuance
    *   Issued To / Purpose
    *   Issued By (User)
*   **Aggregation:** Optionally provide summary totals (Total Quantity Issued, Total Cost of Issuance) grouped by Stock Item, Stock Group, or Purpose.
*   **Format:** On-screen display, exportable (CSV/PDF).

# 4. Non-Functional Requirements

This section outlines the quality attributes and constraints that the Purchase Management Application must adhere to, ensuring it is not only functional but also efficient, reliable, and easy to use and maintain.

## 4.1. Performance
*   **Response Time:** Standard page loads and data rendering should complete within 3 seconds under typical load conditions. Data-intensive operations like report generation or large data lookups should complete within 10 seconds.
*   **Concurrency:** The system should comfortably support simultaneous access and operations from an estimated peak load of 50 concurrent users (across all roles and sites) without significant degradation in performance.
*   **Data Volume:** The application should perform adequately with an initial estimated data volume (e.g., 10,000 POs, 50,000 GRNs/Bills, 5,000 stock items, 1,000 vendors) and scale reasonably as data grows over 3-5 years.
*   **Bulk Operations:** Excel uploads for stock items should process efficiently, handling files with up to 1,000 rows within a reasonable timeframe (e.g., under 1 minute).

## 4.2. Scalability
*   **Architecture:** The chosen architecture (Next.js, Neon DB) should support future scaling. Neon DB (serverless Postgres) inherently offers scalability features.
*   **Horizontal Scaling:** The application deployment (likely containerized) should allow for horizontal scaling of the Next.js application servers if needed to handle increased user load.
*   **Database Scaling:** Neon DB should handle anticipated data growth and query load. Indexing strategies must be implemented effectively.

## 4.3. Usability
*   **Learnability:** The application should be intuitive and easy for new users (within their specific role) to learn with minimal training.
*   **Efficiency:** Experienced users should be able to complete common tasks (e.g., creating a PO, approving a bill, generating a report) quickly and efficiently.
*   **User Interface (UI):** The UI, built with Shadcn UI components, must be clean, consistent, and follow modern web design best practices. It should be responsive and function correctly on standard desktop/laptop screen resolutions.
*   **Error Handling:** Clear and informative error messages should be provided to users when issues occur, guiding them on how to resolve the problem or whom to contact.
*   **Accessibility:** While not a primary driver for this internal tool, basic web accessibility principles (e.g., keyboard navigation, sufficient color contrast) should be considered.

## 4.4. Reliability
*   **Availability:** The application should aim for high availability during business hours (e.g., 99.5% uptime), excluding planned maintenance windows.
*   **Data Integrity:** The system must ensure the accuracy and consistency of data through database constraints, validations, and proper transaction management. Data loss or corruption must be prevented.
*   **Fault Tolerance:** The system should handle common errors gracefully (e.g., network interruptions, invalid user input) without crashing.
*   **Backup and Recovery:** Regular automated backups of the Neon database must be configured, with a defined recovery point objective (RPO) and recovery time objective (RTO).

## 4.5. Security
*   **Authentication:** Secure user authentication is required (as detailed in 3.1.1).
*   **Authorization:** Role-based access control (RBAC) must be strictly enforced (as detailed in 3.1.3) to prevent unauthorized access to data or functionality.
*   **Data Protection:** Sensitive data (e.g., vendor bank details, potentially user credentials if stored) must be protected both in transit (using HTTPS) and at rest (using database encryption features).
*   **Input Validation:** All user inputs must be validated on both the client-side and server-side to prevent common web vulnerabilities (e.g., Cross-Site Scripting (XSS), SQL Injection).
*   **Dependency Management:** Regularly scan and update third-party libraries (npm packages) to patch known vulnerabilities.
*   **Audit Trails:** Transaction logs (as detailed in 3.7.3) contribute to security by providing accountability.

## 4.6. Maintainability
*   **Code Quality:** Code should be well-structured, documented (where necessary), and follow established coding standards for Next.js/React and TypeScript/JavaScript.
*   **Modularity:** The application should be designed with modularity in mind, making it easier to modify or add features in the future without impacting unrelated parts of the system.
*   **Testability:** The codebase should be written in a way that facilitates unit testing and integration testing.
*   **Configuration Management:** System configurations (e.g., database connection strings, API keys) should be managed securely and separately from the codebase.
*   **Deployment:** The deployment process should be automated and repeatable.

# 5. Technical Specifications

This section details the mandatory technical stack and architectural guidelines for the Purchase Management Application.

## 5.1. Architecture Overview
*   **Type:** The application will be a web-based, client-server system.
*   **Frontend:** A modern single-page application (SPA) or server-side rendered (SSR) application built with Next.js, responsible for user interface rendering and interaction.
*   **Backend:** Backend logic, including API endpoints for data manipulation, business rule enforcement, and workflow management, will be implemented using Next.js API routes (Node.js runtime).
*   **Database:** A relational database (Neon - Serverless Postgres) will serve as the central data store, accessed via an Object-Relational Mapper (ORM).
*   **Communication:** The frontend will communicate with the backend via RESTful APIs or similar protocols (e.g., GraphQL, if deemed appropriate during detailed design, though REST is standard with Next.js API routes).

## 5.2. Frontend Stack
*   **Framework:** Next.js (latest stable version recommended)
*   **UI Library:** React (managed via Next.js)
*   **Component Library:** Shadcn UI (leveraging Tailwind CSS and Radix UI primitives)
*   **Language:** TypeScript
*   **State Management:** Appropriate state management solution for React (e.g., Zustand, Jotai, React Context API, Redux Toolkit) to be determined during technical design based on application complexity.
*   **Styling:** Tailwind CSS (as utilized by Shadcn UI).

## 5.3. Backend Stack
*   **Framework/Runtime:** Node.js (via Next.js API Routes)
*   **Language:** TypeScript
*   **API Style:** RESTful APIs are the default approach.

## 5.4. Database
*   **Database System:** Neon (Serverless PostgreSQL)
*   **ORM:** Drizzle ORM (for type-safe database access and schema management/migrations).

## 5.5. Authentication Mechanism
*   **Requirement:** A secure authentication and authorization mechanism must be implemented.
*   **Compatibility:** The chosen solution must integrate seamlessly with the Next.js framework and support role-based access control.
*   **Potential Options:** Solutions like NextAuth.js, Lucia Auth, or custom JWT-based authentication could be considered. The final choice will be made during the technical design phase, prioritizing security and ease of integration with the specified stack.

## 5.6. Deployment Environment
*   **Hosting:** Cloud-based hosting is required.
    *   **Frontend/Backend:** Platforms like Vercel (ideal for Next.js) or AWS Amplify/similar services.
    *   **Database:** Neon cloud platform.
*   **Environments:** Separate environments for Development, Staging (for testing/UAT), and Production must be maintained.
*   **Infrastructure as Code (IaC):** Recommended for managing cloud resources (Optional, based on team practice).
*   **CI/CD:** Automated Continuous Integration and Continuous Deployment pipelines should be set up for efficient testing and deployment (e.g., using GitHub Actions, Vercel integrations).

# 6. Data Model

This section provides a high-level overview of the key data entities, their relationships, and essential attributes required for the Purchase Management Application. Detailed schema design will be managed using Drizzle ORM migrations.

## 6.1. Key Entities

The core data entities include:

*   **User:** Represents individuals using the application.
*   **Role:** Defines the permission levels (Admin, PO Creator, etc.).
*   **UserRole:** Maps Users to Roles (Many-to-Many).
*   **Company:** Represents the legal entities using the system.
*   **Site:** Represents operational locations associated with a Company.
*   **Currency:** Stores currency codes and potentially names.
*   **Vendor:** Represents suppliers of goods and services.
*   **StockGroup:** Categorizes stock items.
*   **UnitOfMeasurement (UoM):** Defines units like 'Kg', 'Nos', 'Bag'.
*   **StockItem:** Represents the materials or items being purchased.
*   **PurchaseOrder (PO):** Represents an order placed with a vendor.
*   **PurchaseOrderItem:** Represents a line item within a PO.
*   **GoodsReceivedNote (GRN):** Records the receipt of materials at a site.
*   **GoodsReceivedNoteItem:** Represents a line item within a GRN.
*   **Bill:** Represents a vendor invoice submitted for payment.
*   **BillItem:** Represents a line item within a Bill, often linked to GRN/PO items.
*   **Payment:** Records payments made against Bills.
*   **MaterialIssuance:** Records the issuance of materials from a site.
*   **MaterialIssuanceItem:** Represents a line item within a Material Issuance.
*   **InventoryLedger:** Tracks stock movements (receipts and issuances) per item/site for FIFO.
*   **InventoryLayer:** Represents a specific batch/layer of stock received at a particular cost for FIFO calculation and consumption.
*   **ApprovalWorkflowStep:** Defines steps in PO/Bill approval processes (if complex workflows are needed later, simple status fields might suffice initially).
*   **AuditLog:** Records significant actions performed in the system.

## 6.2. Entity Relationships (High-Level)

*   **User <-> Role:** Many-to-Many (via UserRole).
*   **Company -> Site:** One-to-Many (A company has multiple sites).
*   **Company -> Currency:** Many-to-One (Each company has one base currency).
*   **Company -> User:** Many-to-Many (Users might access multiple companies, TBD).
*   **Site -> User:** Many-to-Many (Site Supervisors assigned to sites).
*   **Vendor <-> Company:** Many-to-Many (A vendor can supply to multiple companies).
*   **StockGroup -> StockItem:** One-to-Many.
*   **UoM -> StockItem:** Many-to-One.
*   **Vendor -> PurchaseOrder:** Many-to-One.
*   **Company -> PurchaseOrder:** Many-to-One.
*   **Site -> PurchaseOrder:** Many-to-One (Delivery Site).
*   **User -> PurchaseOrder:** Many-to-One (Creator).
*   **PurchaseOrder -> PurchaseOrderItem:** One-to-Many.
*   **StockItem -> PurchaseOrderItem:** Many-to-One.
*   **PurchaseOrder -> GoodsReceivedNote:** One-to-Many (Optional link).
*   **Site -> GoodsReceivedNote:** Many-to-One.
*   **User -> GoodsReceivedNote:** Many-to-One (Receiver).
*   **GoodsReceivedNote -> GoodsReceivedNoteItem:** One-to-Many.
*   **StockItem -> GoodsReceivedNoteItem:** Many-to-One.
*   **GoodsReceivedNote -> Bill:** Many-to-Many (A bill can cover multiple GRNs, a GRN might be split across bills - TBD).
*   **PurchaseOrder -> Bill:** Many-to-Many (Similar to GRN relationship).
*   **Vendor -> Bill:** Many-to-One.
*   **Company -> Bill:** Many-to-One.
*   **Bill -> BillItem:** One-to-Many.
*   **GoodsReceivedNoteItem / PurchaseOrderItem -> BillItem:** Linkage needed.
*   **Bill -> Payment:** One-to-Many (A bill can have multiple partial payments).
*   **User -> MaterialIssuance:** Many-to-One (Issuer).
*   **Site -> MaterialIssuance:** Many-to-One.
*   **MaterialIssuance -> MaterialIssuanceItem:** One-to-Many.
*   **StockItem -> MaterialIssuanceItem:** Many-to-One.
*   **MaterialIssuanceItem -> InventoryLedger:** One-to-One/Many (Triggers ledger OUT entry).
*   **InventoryLayer -> MaterialIssuanceItem:** Many-to-Many (Issuance consumes from layers).
*   **GoodsReceivedNoteItem -> InventoryLedger:** One-to-One/Many (Triggers ledger IN entry).
*   **StockItem + Site -> InventoryLedger:** Composite key relationship.
*   **GoodsReceivedNoteItem -> InventoryLayer:** One-to-One (Creates a FIFO layer).
*   **StockItem + Site -> InventoryLayer:** Composite key relationship.

## 6.3. Key Attributes per Entity (Examples)

*   **User:** UserID, Name, Email, HashedPassword, IsActive.
*   **Company:** CompanyID, Name, Address, GSTIN, BaseCurrencyID.
*   **Site:** SiteID, Name, Address, CompanyID.
*   **Vendor:** VendorID, Name, GSTIN, Address, ContactEmail, IsActive.
*   **StockItem:** ItemID, ItemCode, Name, Description, UoMID, StockGroupID, IsActive.
*   **PurchaseOrder:** PO_ID, PONumber, CompanyID, VendorID, PODate, DeliverySiteID, Status, TotalAmount, CurrencyID, CreatedByUserID.
*   **PurchaseOrderItem:** POItemID, PO_ID, ItemID, Quantity, UnitPrice, TaxRate.
*   **GoodsReceivedNote:** GRN_ID, GRNNumber, SiteID, GRNDate, PO_ID (nullable), VendorName (if no PO), ReceivedByUserID.
*   **GoodsReceivedNoteItem:** GRNItemID, GRN_ID, ItemID, QuantityReceived, UnitCost (for FIFO layer).
*   **Bill:** BillID, BillNumber, CompanyID, VendorID, VendorInvoiceNumber, VendorInvoiceDate, BillDate, DueDate, Status, TotalAmount.
*   **Payment:** PaymentID, BillID, PaymentDate, AmountPaid, PaymentMode, ReferenceNumber, RecordedByUserID.
*   **MaterialIssuance:** IssuanceID, IssuanceNumber, SiteID, IssuanceDate, IssuedToPurpose, IssuedByUserID.
*   **MaterialIssuanceItem:** IssuanceItemID, IssuanceID, ItemID, QuantityIssued, FifoCost.
*   **InventoryLayer:** LayerID, ItemID, SiteID, GRNItemID, ReceivedDate, QuantityReceived, UnitCost, RemainingQuantity.

*(Note: This is not exhaustive. Detailed attributes, data types, constraints, and indexes will be defined in the Drizzle ORM schema.)*

# 7. User Interface (UI) / User Experience (UX)

This section outlines the expectations for the application's user interface and overall user experience, focusing on key flows and the use of the specified component library.

## 7.1. Key User Flows

The UI/UX design should prioritize simplicity and efficiency for the following key user workflows:

*   **PO Creation:** A streamlined, multi-step form or single-page interface allowing PO Creators to easily select vendors, add line items (with auto-suggestions for stock items), specify quantities/prices, select delivery sites, and submit for approval.
*   **PO/Bill Approval:** A clear dashboard or list view for Approvers showing pending items, allowing quick review of essential details (Amount, Vendor, Creator, Key Items) and one-click Approve/Reject actions (with a modal for rejection reasons).
*   **GRN Creation:** An intuitive interface for Site Supervisors, optimized for potential use on tablets or rugged laptops at sites. Should allow easy selection of POs (if applicable) or direct entry of received items, focusing on quick quantity input.
*   **Bill Creation:** A flow for Accounts Users to easily link GRNs/POs to a new Bill, verify details against vendor invoices, and submit for approval.
*   **Payment Recording:** A simple form for Accounts Users to select approved bills and record payment details.
*   **Master Data Management:** Standard CRUD interfaces for managing Companies, Sites, Vendors, and Stock Items, utilizing tables with search, sort, and filtering capabilities.
*   **Reporting:** Clear display of report data in tables, with accessible filtering options and export functionality.

## 7.2. Wireframes/Mockups (Reference/Placeholder)

Detailed wireframes and high-fidelity mockups should be created during the design phase of the project. These visual guides will provide a concrete representation of the application's layout, navigation, and interaction patterns for each key screen and user flow. They will serve as a blueprint for the frontend development team. (Placeholder: Links to Figma/Miro boards or design files will be added here once available).

## 7.3. UI Component Library Usage (Shadcn UI)
*   **Consistency:** The application's UI must be built using components from the Shadcn UI library to ensure visual consistency, accessibility, and adherence to modern design standards.
*   **Component Selection:** Utilize appropriate Shadcn UI components for common elements like buttons, forms, input fields, tables, modals, date pickers, dropdowns/selects, notifications/toasts, etc.
*   **Responsiveness:** While primarily a desktop application, the UI should employ responsive design principles to ensure usability on various screen sizes, including larger tablets.
*   **Customization:** Leverage Shadcn UI's customization capabilities (via Tailwind CSS) to align with the company's branding if required, while maintaining a clean and professional look.

# 8. Implementation Plan / Task List

This section outlines a proposed plan for developing the Purchase Management Application, including milestones and a high-level task breakdown. Detailed sprint planning and task assignment will occur separately.

## 8.1. Milestones/Phases

The development can be broken down into the following logical phases:

*   **Phase 0: Setup & Foundation (Sprint 0)**
    *   Project setup (repositories, CI/CD basics).
    *   Technology stack confirmation and environment setup (Dev, Staging).
    *   Database schema initial design and migration setup (Drizzle).
    *   Basic Next.js application structure with Shadcn UI integration.
    *   Authentication mechanism implementation (core login/logout).
*   **Phase 1: Core Data Management (Sprints 1-2)**
    *   Integrate Clerk Authentication & retrieve user role/company metadata.
    *   Implement Company & Site Management (CRUD).
    *   Implement Vendor Management (CRUD).
    *   Implement Stock Group & Stock Item Management (CRUD, including Excel Upload).
    *   Basic Admin dashboard/interfaces for managing master data.
*   **Phase 2: Procurement Workflow - PO, GRN & Issuance (Sprints 3-5)**
    *   Implement Purchase Order (PO) Creation flow.
    *   Implement PO Approval Workflow (single level initially).
    *   Implement Goods Received Note (GRN) Creation flow (PO-based and Direct).
    *   Implement Inventory Ledger updates upon GRN creation (FIFO layer creation).
    *   Implement Material Issuance flow.
    *   Implement FIFO consumption logic for issuances.
    *   Implement Inventory Ledger updates for issuances ('OUT' entries).
    *   Develop UI for viewing POs, GRNs, and Issuances with status tracking.
*   **Phase 3: Procurement Workflow - Billing & Payment (Sprints 6-7)**
    *   Implement Bill Creation flow (linking GRNs/POs).
    *   Implement Bill Approval Workflow.
    *   Implement Payment Recording functionality.
    *   Develop UI for viewing Bills and Payments with status tracking.
*   **Phase 4: Reporting & Refinements (Sprint 7)**
    *   Implement Inventory Valuation Report (FIFO).
    *   Implement Purchase History Report.
    *   Implement Transaction Logs / Audit Trail.
    *   Implement Approval Status Tracking Report.
    *   Refine UI/UX based on internal feedback.
*   **Phase 5: Testing & Deployment (Sprint 8)**
    *   End-to-end testing.
    *   User Acceptance Testing (UAT) with stakeholders.
    *   Performance testing.
    *   Security review.
    *   Bug fixing.
    *   Production environment setup and deployment.
    *   Data migration (if applicable).
    *   User training documentation preparation.

## 8.2. Detailed Task Breakdown (High-Level)

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

## 8.3. Estimated Effort (TBD)

Detailed effort estimation (e.g., in story points or person-days) for each task and sprint will be conducted during sprint planning sessions involving the development team.

## 8.4. Dependencies

*   **Stakeholder Availability:** Timely feedback and clarification from business stakeholders (Procurement, Accounts, Site Managers, Management) are crucial.
*   **Master Data:** Availability of initial master data (Vendors, Stock Items) for setup and testing.
*   **Infrastructure:** Access to and configuration of necessary cloud services (Neon, Vercel/AWS).
*   **API Keys/Credentials:** Access to any required third-party service credentials.
*   **Design Assets:** Availability of detailed wireframes/mockups from the design phase.

# 9. Open Issues / Future Considerations

This section lists items requiring further discussion or clarification, as well as potential enhancements for future releases of the Purchase Management Application.

## 9.1. Items Clarified (V1 Scope)

The following items, previously listed for clarification, have been addressed and incorporated into the V1 requirements:

*   **Approval Workflow:** A single-level approval by users with the 'Admin' role is sufficient for both POs and Bills.
*   **Direct GRN Pricing:** The unit cost for items received via a GRN without a PO reference will be left blank on the GRN and entered by the Accounts team (User or Admin) during Bill creation.
*   **Bill Discrepancy Handling:** Discrepancies up to 5% (value) between Bill and GRN/PO are tolerated. Discrepancies over 5% will block standard approval and require Admin override (approval action by Admin). Discrepancies will be highlighted in the UI.
*   **Multi-Currency Handling:** V1 will operate on a single-currency basis per company. Each company will have a defined base currency, and all transactions and reporting will be in that currency. Multi-currency transaction support is out of scope for V1.
*   **User Access Scoping:** The system will support two roles: 'Admin' and 'User'. Admins have access to all companies. Admins assign specific company access to Users. Users only see data for their assigned company. A UI element (e.g., dropdown) will allow users with multi-company access to switch context.
*   **Tax Calculation Logic:** V1 requires only simple tax calculation. A single tax rate field (e.g., percentage) per line item or document is sufficient. Complex GST logic (CGST/SGST/IGST, HSN codes) is out of scope.
*   **Role Granularity:** The roles have been simplified to 'Admin' (full access + approvals) and 'User' (all access except approvals).

## 9.2. Potential Future Enhancements (Out of Scope for V1)

*   **Material Issuance Tracking:** Add functionality to record materials issued from site inventory to specific projects or cost centers.
*   **Advanced Inventory Management:** Implement features like stock adjustments, stock transfers between sites, minimum stock level alerts, batch/serial number tracking.
*   **Budgeting Module:** Integrate budget checking during PO creation.
*   **RFQ & Tendering:** Add modules for managing Request for Quotations and vendor bidding processes.
*   **Contract Management:** Include features for managing vendor contracts.
*   **Supplier Portal:** Develop an external portal for vendors to view POs, submit invoices, and track payment status.
*   **Mobile Application:** Create a native or progressive web app for specific roles (e.g., Site Supervisors for GRNs, Approvers).
*   **Accounting System Integration:** Develop direct integration with the company's primary accounting software.
*   **Advanced Reporting & BI:** Integrate with Business Intelligence tools or add more sophisticated reporting capabilities.
*   **Multi-Language Support:** Add support for languages other than English.

# 10. Glossary

This section defines key terms and acronyms used within this Product Requirements Document.

*   **Admin (Administrator):** A user role with the highest level of permissions, responsible for system configuration and user management.
*   **API (Application Programming Interface):** A set of rules and protocols for building and interacting with software applications.
*   **Bill:** Represents a vendor invoice entered into the system, typically based on GRNs or POs, awaiting approval and payment.
*   **CRUD:** Acronym for Create, Read, Update, Delete - the basic operations for managing data.
*   **Currency:** The medium of exchange for transactions (e.g., INR, USD).
*   **Drizzle ORM:** A TypeScript Object-Relational Mapper used for interacting with the database in a type-safe manner.
*   **FIFO (First-In, First-Out):** An inventory accounting method where the first items added to inventory are assumed to be the first ones used or sold. Used here for valuation.
*   **Framework:** A foundational structure upon which software applications are built (e.g., Next.js).
*   **Frontend:** The part of the application that users interact with directly, typically running in the web browser.
*   **Functional Requirements:** Define what the system should *do* (e.g., create a PO, approve a bill).
*   **GRN (Goods Received Note):** A document created by a Site Supervisor to record the receipt of materials at a site.
*   **GSTIN (Goods and Services Tax Identification Number):** A unique identifier assigned to businesses registered under India's GST system.
*   **Inventory Layer:** A specific batch of an item received at a particular time and cost, used for FIFO calculations.
*   **Inventory Ledger:** A record tracking the inflow (and potentially outflow) of stock items at a specific site.
*   **INR (Indian Rupee):** The official currency of India.
*   **Neon DB:** A serverless PostgreSQL database platform.
*   **Next.js:** A React framework for building server-side rendered and static web applications.
*   **Non-Functional Requirements:** Define *how* the system should perform (e.g., performance, security, usability).
*   **ORM (Object-Relational Mapper):** Software that facilitates mapping data between object-oriented programming languages and relational databases.
*   **PAN (Permanent Account Number):** A unique identifier issued by the Indian Income Tax Department.
*   **Payment:** The act of settling an approved Bill; also refers to the record of such a transaction.
*   **PO (Purchase Order):** A formal document issued by a buyer (the company) to a seller (vendor) indicating types, quantities, and agreed prices for products or services.
*   **PRD (Product Requirements Document):** This document, outlining the requirements for the software product.
*   **React:** A JavaScript library for building user interfaces.
*   **RBAC (Role-Based Access Control):** A security approach that restricts system access based on user roles.
*   **Shadcn UI:** A collection of reusable UI components built using Radix UI and Tailwind CSS.
*   **Site:** A physical location associated with a company, such as a construction site or warehouse.
*   **SPA (Single-Page Application):** A web application that interacts with the user by dynamically rewriting the current web page with new data from the web server, instead of the default method of the browser loading entire new pages.
*   **Sprint:** A fixed time period (e.g., 1-4 weeks) during which specific work is completed in Agile development.
*   **SSR (Server-Side Rendering):** A technique where web pages are rendered on the server before being sent to the client's browser.
*   **Stock Group:** A category used to classify Stock Items.
*   **Stock Item:** A specific material or product that is purchased and potentially tracked in inventory.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom user interfaces.
*   **UAT (User Acceptance Testing):** The final phase of testing where end-users validate if the system meets their requirements.
*   **UI (User Interface):** The visual elements and controls through which a user interacts with the application.
*   **UoM (Unit of Measurement):** The standard unit used to quantify a stock item (e.g., Kg, Liters, Nos).
*   **UX (User Experience):** The overall experience a user has when interacting with the application.
*   **Vendor:** A supplier or seller of goods or services to the company.

# 11. Appendix

This section is reserved for supplementary materials, such as links to detailed design documents, wireframes, user flow diagrams, or external references relevant to the project.

*   **Design Documents:** [Link to Wireframes/Mockups - To be added once available]
*   **User Flow Diagrams:** [Link to User Flow Diagrams - To be added if created]
*   **Original Prompt:** [Reference to the initial request document]

*(This section will be updated as supporting documents become available throughout the project lifecycle.)*


*   **Company Context Switching:** For users with access to multiple companies (e.g., Admins), provide a clear and easily accessible mechanism (e.g., a dropdown menu in the header/navigation bar) to switch the active company context. All subsequent views and actions must reflect the selected company context.
