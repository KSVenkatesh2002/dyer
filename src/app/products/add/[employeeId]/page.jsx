'use client';
import { useParams } from 'next/navigation';
import ProductForm from '../../components/ProductForm';
import { createProductWithTask } from '@/lib/api';
import { toast } from 'react-toastify';

export default function AddProductWithTaskPage() {
  const { employeeId } = useParams();

  const handleSubmit = async (form) => {
    await createProductWithTask({ ...form, employeeId });
    toast.success('Product created and task assigned!');
  };

  return (
    <ProductForm
  onSubmit={handleSubmit}
  showPopup={true}
  employeeId={employeeId}
/>
  );
}