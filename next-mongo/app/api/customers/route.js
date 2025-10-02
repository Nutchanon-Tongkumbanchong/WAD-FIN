import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongoose';
import Customer from '../../../models/Customer';

export async function GET() {
  await connectDB();
  const customers = await Customer.find().sort({ createdAt: -1 });
  return NextResponse.json(customers, { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  try {
    const created = await Customer.create({
      name: body.name,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      memberNumber: body.memberNumber,
      interests: body.interests ?? '',
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}