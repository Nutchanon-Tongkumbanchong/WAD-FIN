'use client';

import React, { useEffect, useState } from 'react';

export default function CustomerForm({ initialData, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '',
    memberNumber: '',
    interests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().slice(0, 10)
          : '',
        memberNumber: initialData.memberNumber ?? '',
        interests: initialData.interests || '',
      });
    }
  }, [initialData]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === 'memberNumber' ? value.replace(/\D/g, '') : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const isEdit = Boolean(initialData?._id);
      const url = isEdit ? `/api/customers/${initialData._id}` : '/api/customers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
          memberNumber: form.memberNumber ? Number(form.memberNumber) : null,
          interests: form.interests.trim(),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed (${res.status})`);
      }

      const data = await res.json();
      onSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}

      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} required placeholder="John Doe" />
      </div>

      <div>
        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} required />
      </div>

      <div>
        <label>Member Number</label>
        <input
          name="memberNumber"
          value={form.memberNumber}
          onChange={onChange}
          required
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="1"
        />
      </div>

      <div>
        <label>Interests</label>
        <input name="interests" value={form.interests} onChange={onChange} placeholder="movies, football, gym" />
      </div>

      <button type="submit" disabled={submitting}>
        {initialData?._id ? 'Update Customer' : 'Create Customer'}
      </button>
    </form>
  );
}