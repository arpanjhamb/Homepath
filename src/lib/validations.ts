import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const OnboardingSchema = z.object({
  phone: z.string().optional(),
  budgetMin: z.number().min(50000),
  budgetMax: z.number().min(50000),
  depositAmount: z.number().min(0),
  hasAIP: z.boolean(),
  preferredCounties: z.array(z.string()).min(1, "Select at least one county"),
  propertyTypes: z.array(z.string()).min(1, "Select at least one property type"),
  minBedrooms: z.number().min(1).max(10),
  timeline: z.string(),
  isFirstTimeBuyer: z.boolean(),
  htbAware: z.boolean(),
});

export const IntroductionRequestSchema = z.object({
  providerId: z.string().cuid(),
  buyerNote: z.string().max(500).optional(),
});
