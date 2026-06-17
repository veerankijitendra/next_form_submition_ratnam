import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Full name is required" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  city: z.string().optional(),
  age: z.string().optional(),
  items: z.string().min(1, { message: "Items purchased are required" }),
  total: z.number().min(0).optional(),
  payment: z.string().optional(),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
