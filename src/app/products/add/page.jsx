"use client";
import ProductForm from "@/components/forms/ProductForm";
import { createProduct } from "@/lib/api";
import { toast } from "react-toastify";

export default function AddProduct() {
  const handleSubmit = async (form) => {
    const { pays, ...filteredForm } = form;
    const id = await createProduct(filteredForm);
    toast.success("Product created successfully");
    return id.data;
  };

  return <ProductForm onSubmit={handleSubmit} hidePays={true} />;
}
