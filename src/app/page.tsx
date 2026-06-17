"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/schemas/formSchema";
import { useFormContext } from "@/context/FormContext";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
      firmName: formData.firmName || "",
      address: formData.address || "",
      mobile: formData.mobile || "",
      gst: formData.gst || "",
      dealingIn: formData.dealingIn || "",
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

  const renderReceiptRow = (label: string, value: string | undefined) => (
    <div className="flex justify-between items-start py-2 border-b border-dashed border-[#CBD5E1] last:border-0 print:border-[#ccc] print:py-1">
      <span className="text-[14px] font-medium text-[#334155] print:text-black print:text-[12px]">{label}</span>
      <span className="text-[14px] font-medium text-[#0F172A] text-right ml-4 max-w-[60%] break-words print:text-black print:text-[12px]">{value || '—'}</span>
    </div>
  );

  if (isSuccess) {
    return (
      <Card className="bg-white border-[#CBD5E1] border rounded-[14px] p-6 sm:p-10 shadow-sm w-full mx-auto max-w-[900px] print:max-w-[80mm] print:mx-auto print:border-none print:shadow-none print:p-0 print:text-black font-roboto">
        {/* On-Screen Success Header */}
        <div className="text-center mb-8 sm:mb-10 print:hidden">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EFF6FF] text-[#3B82F6] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] font-inter">Submission Successful</h1>
          <p className="text-[15px] text-[#334155] mt-2">
            The business details have been recorded. You can print the receipt below.
          </p>
        </div>

        {/* Receipt Area (Printed & Displayed) */}
        <div className="bg-[#F8FAFC] print:bg-transparent rounded-[12px] p-6 sm:p-8 border border-[#CBD5E1] print:border-none print:p-0 max-w-[500px] mx-auto print:max-w-full">
          <div className="text-center mb-5">
            <h2 className="text-[20px] font-bold font-inter text-[#0F172A] print:text-black print:text-[16px]">Business Registration</h2>
            <div className="text-[15px] font-medium text-[#334155] mt-1 print:text-[13px] print:text-black">Submission Receipt</div>
            <div className="text-[13px] text-[#334155] mt-1.5 print:text-black print:text-[10px]">
              ID: {receiptId} &bull; {new Date().toLocaleString('en-IN', { hour12: true, month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </div>
          </div>

          <div className="w-full h-[1px] border-t-[1.5px] border-dashed border-[#CBD5E1] my-5 print:border-black print:my-2"></div>

          <div className="flex flex-col w-full">
            {renderReceiptRow("Name", formData.name)}
            {renderReceiptRow("Firm Name", formData.firmName)}
            {renderReceiptRow("Mobile Number", formData.mobile)}
            {formData.gst && renderReceiptRow("GST Number", formData.gst)}
          </div>

          <div className="w-full h-[1px] border-t-[1.5px] border-dashed border-[#CBD5E1] my-5 print:border-black print:my-2"></div>

          <div className="flex flex-col w-full">
            {renderReceiptRow("Dealing In", formData.dealingIn)}
            {renderReceiptRow("Address", formData.address)}
          </div>

          <div className="w-full h-[1px] border-t-[1.5px] border-dashed border-[#CBD5E1] my-5 print:border-black print:my-2"></div>

          <div className="text-center text-[13px] text-[#334155] mt-5 print:text-black print:text-[10px]">
            Thank you for registering with us!
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-8 mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px] text-[15px] font-medium bg-[#3B82F6] text-white hover:bg-[#2563EB] active:scale-[0.98] transition-all font-inter shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print Receipt
          </button>
          <button onClick={handleNewCustomer} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px] text-[15px] font-medium bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] active:scale-[0.98] transition-all font-inter shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Form
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-[#CBD5E1] rounded-[14px] p-6 sm:p-10 shadow-sm w-full mx-auto max-w-[1000px]">
      <div className="mb-8 sm:mb-10 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] font-inter">Business Registration Form</h1>
        <p className="text-[15px] text-[#334155] mt-2 font-roboto">
          Please fill in the business details below. Fields marked with an asterisk (*) are required.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 font-roboto w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-[#334155]">Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" className="h-11 rounded-[10px] text-[15px] border-[#CBD5E1] focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6] w-full bg-[#F8FAFC] hover:bg-white transition-colors text-[#0F172A]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-[#334155]">Firm Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your firm name" className="h-11 rounded-[10px] text-[15px] border-[#CBD5E1] focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6] w-full bg-[#F8FAFC] hover:bg-white transition-colors text-[#0F172A]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-[#334155]">Mobile Number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your mobile number" className="h-11 rounded-[10px] text-[15px] border-[#CBD5E1] focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6] w-full bg-[#F8FAFC] hover:bg-white transition-colors text-[#0F172A]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gst"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] font-medium text-[#334155]">GST Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GST number (Optional)" className="h-11 rounded-[10px] text-[15px] border-[#CBD5E1] focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6] w-full bg-[#F8FAFC] hover:bg-white transition-colors text-[#0F172A]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[#EF4444]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[14px] font-medium text-[#334155]">Address *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your complete business address" className="rounded-[10px] min-h-[80px] resize-y text-[15px] border-[#CBD5E1] focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6] w-full bg-[#F8FAFC] hover:bg-white transition-colors text-[#0F172A]" {...field} />
                </FormControl>
                <FormMessage className="text-[#EF4444]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dealingIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[14px] font-medium text-[#334155]">Dealing In *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the products or services your business deals in" className="rounded-[10px] min-h-[80px] resize-y text-[15px] border-[#CBD5E1] focus-visible:ring-[#3B82F6]/20 focus-visible:border-[#3B82F6] w-full bg-[#F8FAFC] hover:bg-white transition-colors text-[#0F172A]" {...field} />
                </FormControl>
                <FormMessage className="text-[#EF4444]" />
              </FormItem>
            )}
          />

          {error && (
            <div className="mt-4 p-4 bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] text-[14px] rounded-[10px] font-roboto">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-4 border-t border-[#CBD5E1]">
            <button type="button" onClick={() => { form.reset(); clearFormData(); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px] text-[15px] font-medium bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] active:scale-[0.98] transition-all font-inter shadow-sm">
              Clear Form
            </button>
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px] text-[15px] font-medium bg-[#3B82F6] text-white hover:bg-[#2563EB] active:scale-[0.98] transition-all font-inter shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : "Submit Details"}
            </button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
