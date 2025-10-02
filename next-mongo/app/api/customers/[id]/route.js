import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../lib/mongoose';
import Customer from '../../../../models/Customer';

export async function GET(_req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const doc = await Customer.findById(id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc, { status: 200 });
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const body = await req.json();
  try {
    const updated = await Customer.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.dateOfBirth !== undefined && { dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null }),
          ...(body.memberNumber !== undefined && { memberNumber: body.memberNumber }),
          ...(body.interests !== undefined && { interests: body.interests }),
        },
      },
      { new: true, runValidators: true }
    );
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const deleted = await Customer.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}