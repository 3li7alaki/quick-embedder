
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const filesWithUrls = data.map(file => ({
      ...file,
      viewUrl: `${baseUrl}/view/${file.id}`
    }))

    return NextResponse.json(filesWithUrls)
  } catch (error) {
    console.error('Files API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}