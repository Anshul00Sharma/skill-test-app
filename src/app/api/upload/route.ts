import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Upload file to Supabase storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${Date.now()}_${file.name}`;

    
    const { data, error } = await supabase
    .storage
    .from('files')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      data: data
    });
    
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
