'use client';import React, { useEffect, useState } from 'react';import { useParams, useRouter } from 'next/navigation';export default function CustomerDetailPage() {  const { id } = useParams();  const router = useRouter();  const [data, setData] = useState(null);  const [err, setErr] = useState('');  const [loading, setLoading] = useState(true);  useEffect(() => {    async function load() {      try {        const res = await fetch(`/api/customers/${id}`, { cache: 'no-store' });        if (!res.ok) throw new Error(`Load failed (${res.status})`);        setData(await res.json());      } catch (e) {        setErr(e.message || 'Failed to load');      } finally {        setLoading(false);      }    }    if (id) load();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: 'red' }}>{err}</div>;
  if (!data) return <div>Not found</div>;

  const dob = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().slice(0, 10) : '';

  return (
    <main className="m-5">
      <h1 className="text-2xl mb-4">Customer Detail</h1>
      <div className="space-y-2">
        <p><b>Name:</b> {data.name}</p>
        <p><b>Date of Birth:</b> {dob}</p>
        <p><b>Member Number:</b> {data.memberNumber}</p>
        <p><b>Interests:</b> {data.interests}</p>
      </div>

      <div style={{ marginTop: 12 }}>
        <a href={`/customers/${data._id}/edit`} style={{ marginRight: 12 }}>Edit</a>
        <a href="/customers">Back to list</a>
      </div>
    </main>
  );
}