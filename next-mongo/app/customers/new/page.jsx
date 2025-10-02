'use client';import React from 'react';import { useRouter } from 'next/navigation';import CustomerForm from '@/app/components/CustomerForm';export default function NewCustomerPage() {  const router = useRouter();  return (    <main className="m-5">
      <h1 className="text-2xl mb-4">Add Customer</h1>
      <CustomerForm onSuccess={() => router.push('/customers')} />
    </main>
  );
}