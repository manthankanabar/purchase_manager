import { pgTable, serial, text, timestamp, integer, uuid, pgEnum, boolean, foreignKey } from 'drizzle-orm/pg-core';

// Define status enum for purchase requests
export const statusEnum = pgEnum('status', ['draft', 'pending', 'approved', 'rejected', 'completed']);

// Define currency enum for entities
export const currencyEnum = pgEnum('currency', ['INR', 'USD', 'EUR', 'GBP']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('user'),
  entityId: uuid('entity_id').references(() => entities.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Entities table (for multi-entity support)
export const entities = pgTable('entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  address: text('address'),
  baseCurrency: currencyEnum('base_currency').notNull().default('INR'),
  taxIdentificationNumber: text('tax_identification_number'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sites table
export const sites = pgTable('sites', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  address: text('address'),
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  entityId: uuid('entity_id').references(() => entities.id).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Vendors table
export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  contactPerson: text('contact_person'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  gstNumber: text('gst_number'),
  panNumber: text('pan_number'),
  bankDetails: text('bank_details'),
  paymentTerms: text('payment_terms'),
  isActive: boolean('is_active').notNull().default(true),
  entityId: uuid('entity_id').references(() => entities.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Stock Categories table (based on HSN prefix codes)
export const stockCategories = pgTable('stock_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  prefixCode: text('prefix_code').notNull().unique(), // e.g., '25-2523'
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Stock Groups table (based on HSN code names)
export const stockGroups = pgTable('stock_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // e.g., 'Portland Cement'
  code: text('code').notNull(),
  categoryId: uuid('category_id').references(() => stockCategories.id).notNull(),
  description: text('description'),
  defaultGstRate: integer('default_gst_rate'), // Default GST rate in percentage
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Units of Measurement table
export const uom = pgTable('uom', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Stock Items table
export const stockItems = pgTable('stock_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  stockCategoryId: uuid('stock_category_id').references(() => stockCategories.id),
  stockGroupId: uuid('stock_group_id').references(() => stockGroups.id),
  uomId: uuid('uom_id').references(() => uom.id).notNull(),
  specifications: text('specifications'),
  cgstRate: integer('cgst_rate'), // CGST rate in percentage
  sgstRate: integer('sgst_rate'), // SGST rate in percentage
  igstRate: integer('igst_rate'), // IGST rate in percentage
  hsnCode: text('hsn_code'), // Full HSN code
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Purchase Orders table (replacing purchase requests)
export const purchaseOrders = pgTable('purchase_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  poNumber: text('po_number').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  status: statusEnum('status').notNull().default('draft'),
  requestedById: uuid('requested_by_id').references(() => users.id),
  entityId: uuid('entity_id').references(() => entities.id).notNull(),
  vendorId: uuid('vendor_id').references(() => vendors.id).notNull(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  totalAmount: integer('total_amount'),
  expectedDeliveryDate: timestamp('expected_delivery_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Purchase Order Items table
export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  purchaseOrderId: uuid('purchase_order_id').references(() => purchaseOrders.id).notNull(),
  stockItemId: uuid('stock_item_id').references(() => stockItems.id).notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Approvals table
export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  purchaseOrderId: uuid('purchase_order_id').references(() => purchaseOrders.id),
  approverId: uuid('approver_id').references(() => users.id),
  status: statusEnum('status').notNull(),
  comments: text('comments'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Goods Received Notes (GRN) table
export const goodsReceivedNotes = pgTable('goods_received_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  grnNumber: text('grn_number').notNull().unique(),
  purchaseOrderId: uuid('purchase_order_id').references(() => purchaseOrders.id),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  receivedById: uuid('received_by_id').references(() => users.id).notNull(),
  vendorId: uuid('vendor_id').references(() => vendors.id),
  receiptDate: timestamp('receipt_date').notNull().defaultNow(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// GRN Items table
export const grnItems = pgTable('grn_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  grnId: uuid('grn_id').references(() => goodsReceivedNotes.id).notNull(),
  stockItemId: uuid('stock_item_id').references(() => stockItems.id).notNull(),
  purchaseOrderItemId: uuid('purchase_order_item_id').references(() => purchaseOrderItems.id),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bills table
export const bills = pgTable('bills', {
  id: uuid('id').primaryKey().defaultRandom(),
  billNumber: text('bill_number').notNull().unique(),
  vendorId: uuid('vendor_id').references(() => vendors.id).notNull(),
  entityId: uuid('entity_id').references(() => entities.id).notNull(),
  billDate: timestamp('bill_date').notNull(),
  dueDate: timestamp('due_date'),
  totalAmount: integer('total_amount').notNull(),
  status: statusEnum('status').notNull().default('draft'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bill Items table
export const billItems = pgTable('bill_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').references(() => bills.id).notNull(),
  grnId: uuid('grn_id').references(() => goodsReceivedNotes.id),
  purchaseOrderId: uuid('purchase_order_id').references(() => purchaseOrders.id),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  paymentNumber: text('payment_number').notNull().unique(),
  billId: uuid('bill_id').references(() => bills.id).notNull(),
  amount: integer('amount').notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  paymentMethod: text('payment_method').notNull(),
  referenceNumber: text('reference_number'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Inventory Ledger table
export const inventoryLedger = pgTable('inventory_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  stockItemId: uuid('stock_item_id').references(() => stockItems.id).notNull(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  transactionType: text('transaction_type').notNull(), // 'IN' or 'OUT'
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
  totalPrice: integer('total_price').notNull(),
  referenceType: text('reference_type').notNull(), // 'GRN' or 'ISSUANCE'
  referenceId: uuid('reference_id').notNull(), // ID of the GRN or Issuance
  transactionDate: timestamp('transaction_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Material Issuance table
export const materialIssuance = pgTable('material_issuance', {
  id: uuid('id').primaryKey().defaultRandom(),
  issuanceNumber: text('issuance_number').notNull().unique(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  issuedById: uuid('issued_by_id').references(() => users.id).notNull(),
  issuanceDate: timestamp('issuance_date').notNull().defaultNow(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Material Issuance Items table
export const materialIssuanceItems = pgTable('material_issuance_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  issuanceId: uuid('issuance_id').references(() => materialIssuance.id).notNull(),
  stockItemId: uuid('stock_item_id').references(() => stockItems.id).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
