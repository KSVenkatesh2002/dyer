'use client';
import ProductForm from '../components/ProductForm';
import { createProduct } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AddProduct() {
    const router = useRouter();
    const handleSubmit = async (form) => {
        await createProduct(form); // this should only call your product create API
        toast.success('Product created successfully');
        router.back()
    };

    return (
        <ProductForm onSubmit={handleSubmit} hidePays={true} />
    );
}