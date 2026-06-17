"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/schemas/formSchema";
import { useFormContext } from "@/context/FormContext";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const { formData, setFormData, clearFormData } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name || "",
      phone: formData.phone || "",
      email: formData.email || "",
      city: formData.city || "",
      age: formData.age || "",
      items: formData.items || "",
      total: formData.total || undefined,
      payment: formData.payment || "",
      notes: formData.notes || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to submit");
      }
      setFormData(data);
      setReceiptId(Math.random().toString(36).substring(2, 8).toUpperCase());
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewCustomer = () => {
    setIsSuccess(false);
    clearFormData();
    form.reset();
  };

  const handlePrint = () => {
    window.print();
  };

  const renderReceiptRow = (label: string, value: string | number | undefined) => (
    <div className="flex justify-between items-start py-1.5 border-b border-dashed border-[#E5E5E5] last:border-0 print:border-[#ccc] print:py-1">
      <span className="text-[13px] font-medium text-[#5F5E5A] print:text-black print:text-[12px]">{label}</span>
      <span className="text-[14px] font-semibold text-[#2C2C2A] text-right ml-4 max-w-[60%] break-words print:text-black print:text-[12px]">{value || '—'}</span>
    </div>
  );

  if (isSuccess) {
    return (
      <Card className="bg-white border-[#D3D1C7] border-[0.5px] rounded-[14px] p-5 sm:p-7 md:p-8 shadow-sm w-full mx-auto max-w-[680px] print:max-w-[80mm] print:mx-auto print:border-none print:shadow-none print:p-0 print:text-black font-roboto">
        {/* On-Screen Success Header */}
        <div className="text-center mb-6 sm:mb-7 print:hidden">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E1F5EE] text-[#0F6E56] mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-[22px] font-semibold text-[#0F6E56] font-inter">Your form has been submitted successfully.</h1>
          <p className="text-[13px] sm:text-[14px] text-[#888780] mt-1.5">
            Below is the generated receipt for this submission.
          </p>
        </div>

        {/* Receipt Area (Printed & Displayed) */}
        <div className="bg-[#F9F9F9] print:bg-transparent rounded-[10px] p-5 sm:p-6 border border-[#E5E5E5] print:border-none print:p-0">
          <div className="text-center mb-4">
            <h2 className="text-[18px] font-bold font-inter text-[#0F6E56] print:text-black print:text-[16px]">My Clothing Stall</h2>
            <div className="text-[14px] font-semibold mt-1 print:text-[13px]">Submission Receipt</div>
            <div className="text-[12px] text-[#888780] mt-1 print:text-black print:text-[10px]">
              ID: {receiptId} &bull; {new Date().toLocaleString('en-IN', { hour12: true, month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </div>
          </div>

          <div className="w-full h-[1px] border-t-2 border-dashed border-[#D3D1C7] my-4 print:border-black print:my-2"></div>

          <div className="flex flex-col w-full">
            {renderReceiptRow("Customer Name", formData.name)}
            {renderReceiptRow("Phone Number", formData.phone)}
            {formData.email && renderReceiptRow("Email", formData.email)}
            {formData.city && renderReceiptRow("City", formData.city)}
            {formData.age && renderReceiptRow("Age Group", formData.age)}
          </div>

          <div className="w-full h-[1px] border-t-2 border-dashed border-[#D3D1C7] my-4 print:border-black print:my-2"></div>

          <div className="flex flex-col w-full">
            {renderReceiptRow("Items Purchased", formData.items)}
            {formData.notes && renderReceiptRow("Notes", formData.notes)}
            <div className="flex justify-between items-center py-2 mt-2">
              <span className="text-[15px] font-bold text-[#2C2C2A] print:text-black print:text-[14px]">Total</span>
              <span className="text-[16px] font-bold text-[#0F6E56] print:text-black print:text-[14px]">₹{formData.total || 0}</span>
            </div>
            {formData.payment && (
              <div className="flex justify-between items-center py-1">
                <span className="text-[13px] font-medium text-[#5F5E5A] print:text-black print:text-[12px]">Payment Method</span>
                <span className="text-[13px] font-semibold text-[#2C2C2A] print:text-black print:text-[12px]">{formData.payment}</span>
              </div>
            )}
          </div>

          <div className="w-full h-[1px] border-t-2 border-dashed border-[#D3D1C7] my-4 print:border-black print:my-2"></div>

          <div className="text-center text-[12px] text-[#888780] mt-4 print:text-black print:text-[10px]">
            Thank you for shopping with us!<br/>Please visit again.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 pt-6 mt-4 border-t-[0.5px] border-[#D3D1C7] print:hidden">
          <button onClick={handlePrint} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-[#0F6E56] text-white hover:opacity-90 active:scale-95 transition-all font-inter">
            🖨️ Print Receipt
          </button>
          <button onClick={handleNewCustomer} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium border-[1.5px] border-[#0F6E56] text-[#0F6E56] hover:bg-[#E1F5EE] active:scale-95 transition-all font-inter">
            + New Customer Form
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-[#D3D1C7] border-[0.5px] rounded-[14px] p-5 sm:p-7 md:p-8 shadow-sm w-full mx-auto max-w-[680px]">
      <div className="text-center mb-6 sm:mb-7">
        <h1 className="text-xl sm:text-[22px] font-semibold text-[#0F6E56] font-inter">Welcome to Our Stall!</h1>
        <p className="text-[13px] sm:text-[14px] text-[#888780] mt-1.5 font-roboto">
          Please fill in your details &mdash; we&apos;ll keep you updated on offers & new collections.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-roboto w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Full name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Phone number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. 9876543210" className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Email (optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Hyderabad" className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Age group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full bg-white">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Under 18">Under 18</SelectItem>
                      <SelectItem value="18–25">18–25</SelectItem>
                      <SelectItem value="26–35">26–35</SelectItem>
                      <SelectItem value="36–50">36–50</SelectItem>
                      <SelectItem value="50+">50+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Items purchased *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Blue kurti (₹450), White shirt (₹300)" className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Total amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Payment method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-[7px] text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full bg-white">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium text-[#5F5E5A]">Any special notes (optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g. Wants matching dupatta, will visit again tomorrow…" className="rounded-[7px] min-h-[72px] resize-y text-[15px] focus-visible:ring-[#1D9E75]/30 focus-visible:border-[#1D9E75] w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="mt-2 p-3 bg-red-50 text-red-600 text-sm rounded-md font-roboto">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 pt-4">
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium bg-[#0F6E56] text-white hover:opacity-90 active:scale-95 transition-all font-inter disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "✓ Submit"}
            </button>
            <button type="button" onClick={() => { form.reset(); clearFormData(); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-[14px] font-medium border-[1.5px] border-[#0F6E56] text-[#0F6E56] hover:bg-[#E1F5EE] active:scale-95 transition-all font-inter">
              Clear form
            </button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
