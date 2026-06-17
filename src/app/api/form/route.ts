import { NextResponse } from 'next/server';
import { getDbConnection, initializeDatabase } from '@/lib/mysql';
import { formSchema } from '@/schemas/formSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = formSchema.parse(body);

    await initializeDatabase();
    const db = getDbConnection();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result] = await db.execute<any>(
      `INSERT INTO form_submissions (name, firm_name, address, mobile_number, gst_number, dealing_in) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        validatedData.name,
        validatedData.firmName,
        validatedData.address,
        validatedData.mobile,
        validatedData.gst || null,
        validatedData.dealingIn
      ]
    );

    const insertId = result.insertId;

    return NextResponse.json({ 
      success: true, 
      data: { 
        _id: insertId.toString(),
        ...validatedData,
        createdAt: new Date().toISOString()
      } 
    }, { status: 201 });
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
    await initializeDatabase();
    const db = getDbConnection();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows] = await db.query<any[]>('SELECT * FROM form_submissions ORDER BY created_at DESC');
    
    // Map to frontend expected format
    const submissions = rows.map(row => ({
      _id: row.id.toString(),
      name: row.name,
      firmName: row.firm_name,
      address: row.address,
      mobile: row.mobile_number,
      gst: row.gst_number,
      dealingIn: row.dealing_in,
      createdAt: row.created_at
    }));

    return NextResponse.json({ success: true, data: submissions }, { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await initializeDatabase();
    const db = getDbConnection();
    await db.execute('DELETE FROM form_submissions');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
