import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import { formSchema } from '@/schemas/formSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = formSchema.parse(body);

    await connectToDatabase();
    const newSubmission = new FormSubmission(validatedData);
    await newSubmission.save();

    return NextResponse.json({ success: true, data: newSubmission }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NextResponse.json({ error: 'Validation Error', details: (error as any).errors }, { status: 400 });
    }
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const submissions = await FormSubmission.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: submissions }, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    await FormSubmission.deleteMany({});
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
