// lib/validations.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileUpdateSchema = z.object({
  vendorName: z.string().min(2, "Vendor name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  location: z.string().min(2, "Location is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "REJECTED"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type InquiryStatusInput = z.infer<typeof inquiryStatusSchema>;
