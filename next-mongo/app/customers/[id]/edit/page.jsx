'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CustomerForm from '@/app/components/CustomerForm';

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/customers/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Load failed (${res.status})`);
        setData(await res.json());
      } catch (e) {
        setErr(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: 'red' }}>{err}</div>;
  if (!data) return <div>Not found</div>;

  return (
    <main className="m-5">
      <h1 className="text-2xl mb-4">Edit Customer</h1>
      <CustomerForm initialData={data} onSuccess={() => router.push('/customers')} />
    </main>
  );
}