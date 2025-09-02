import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { filename } = await request.json()

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Update filename in database
    const { data, error } = await supabase
      .from('uploaded_files')
      .update({ filename })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Database update error:', error)
      return NextResponse.json({ error: 'Failed to update filename' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Rename error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}