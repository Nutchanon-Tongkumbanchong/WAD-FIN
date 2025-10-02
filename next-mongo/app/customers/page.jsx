"use client";

import CustomerList from '../components/CustomerList';

export default function CustomersPage() {
  return (
    <main className="m-5">
      <h1 className="text-2xl mb-4">Customers</h1>
      <CustomerList />
    </main>
  );
}