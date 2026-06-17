"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormValues } from "@/schemas/formSchema";

interface FormContextType {
  formData: Partial<FormValues>;
  setFormData: (data: Partial<FormValues>) => void;
  clearFormData: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Partial<FormValues>>({});

  const clearFormData = () => setFormData({});

  return (
    <FormContext.Provider value={{ formData, setFormData, clearFormData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
