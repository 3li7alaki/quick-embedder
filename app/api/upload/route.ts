import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.html')) {
      return NextResponse.json({ error: 'Only HTML files are allowed' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max size is 5MB' }, { status: 400 })
    }

    // Generate unique filename
    const fileId = uuidv4()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${fileId}_${sanitizedName}`
    const filePath = `html-files/${fileName}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(buffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('html-files')
      .upload(filePath, fileBuffer, {
        contentType: 'text/html',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        id: fileId,
        filename: sanitizedName,
        file_path: filePath,
        file_size: file.size
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('html-files').remove([filePath])
      return NextResponse.json({ error: 'Failed to save file metadata' }, { status: 500 })
    }

    return NextResponse.json({
      id: fileId,
      filename: sanitizedName,
      viewUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/view/${fileId}`,
      size: file.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}