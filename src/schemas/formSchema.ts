import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  firmName: z.string().min(1, { message: "Firm Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile number must be a valid 10-digit number" }),
  gst: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(val);
  }, { message: "Invalid GST number format" }),
  dealingIn: z.string().min(1, { message: "Dealing In is required" }),
});

export type FormValues = z.infer<typeof formSchema>;
