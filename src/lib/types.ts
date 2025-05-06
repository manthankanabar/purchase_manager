import { z } from "zod";

// Stock Category Schema
export const stockCategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  prefixCode: z.string().min(1, "Prefix code is required"),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type StockCategory = z.infer<typeof stockCategorySchema>;

// Stock Group Schema
export const stockGroupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  categoryId: z.string().uuid("Category is required"),
  description: z.string().optional().nullable(),
  defaultGstRate: z.number().int().min(0).max(100).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type StockGroup = z.infer<typeof stockGroupSchema>;

// Stock Item Schema
export const stockItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional().nullable(),
  stockCategoryId: z.string().uuid().optional().nullable(),
  stockGroupId: z.string().uuid().optional().nullable(),
  uomId: z.string().uuid("Unit of Measurement is required"),
  specifications: z.string().optional().nullable(),
  cgstRate: z.number().int().min(0).max(100).optional().nullable(),
  sgstRate: z.number().int().min(0).max(100).optional().nullable(),
  igstRate: z.number().int().min(0).max(100).optional().nullable(),
  hsnCode: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type StockItem = z.infer<typeof stockItemSchema>;

// Entity Schema
export const entitySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address: z.string().optional().nullable(),
  baseCurrency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
  taxIdentificationNumber: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type Entity = z.infer<typeof entitySchema>;

// Site Schema
export const siteSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  address: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  entityId: z.string().uuid("Entity is required"),
  isActive: z.boolean().default(true),
});

export type Site = z.infer<typeof siteSchema>;

// Vendor Schema
export const vendorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gstNumber: z.string().optional().nullable(),
  panNumber: z.string().optional().nullable(),
  bankDetails: z.string().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  entityId: z.string().uuid().optional().nullable(),
});

export type Vendor = z.infer<typeof vendorSchema>;

// UoM Schema
export const uomSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type UoM = z.infer<typeof uomSchema>;

// HSN Code Reference Type
export type HsnCodeReference = {
  prefixCode: string;
  codeName: string;
  materialName: string;
  gstRate: number;
};
