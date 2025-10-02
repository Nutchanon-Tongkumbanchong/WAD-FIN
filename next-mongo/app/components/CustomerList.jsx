'use client';

import React, { useEffect, useState } from 'react';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/customers', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        setCustomers(await res.json());
      } catch (e) {
        setErr(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onDelete(id) {
    if (!confirm('Delete this customer?')) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.status === 204 || res.ok) {
        setCustomers((list) => list.filter((c) => c._id !== id));
      } else {
        const msg = await res.text();
        alert(msg || 'Delete failed');
      }
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  }

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: 'red' }}>{err}</div>;

  if (!customers.length) {
    return (
      <div>
        <div>No customers found.</div>
        <div style={{ marginTop: 8 }}>
          <a href="/customers/new">Add Customer</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <a href="/customers/new">Add Customer</a>
      </div>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Member #</th>
            <th>Interests</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td><a href={`/customers/${c._id}`}>{c.name}</a></td>
              <td>{c.memberNumber}</td>
              <td>{c.interests}</td>
              <td>{c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().slice(0, 10) : ''}</td>
              <td>
                <a href={`/customers/${c._id}/edit`} style={{ marginRight: 8 }}>Edit</a>
                <button onClick={() => onDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}