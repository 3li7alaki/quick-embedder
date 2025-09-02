import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  const format = searchParams.get('format') || 'json'

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' }, 
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        }
      }
    )
  }

  // Extract ID from URL - support both /view/ and /embed/ paths
  const match = url.match(/\/(view|embed)\/([a-zA-Z0-9-]+)/)
  if (!match) {
    return NextResponse.json(
      { error: 'Invalid URL format' }, 
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        }
      }
    )
  }

  const id = match[2]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    // Get file metadata
    const { data: fileData, error } = await supabase
      .from('uploaded_files')
      .select('filename')
      .eq('id', id)
      .single()

    if (error || !fileData) {
      return NextResponse.json(
        { error: 'File not found' }, 
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
          }
        }
      )
    }

    // Use /embed/ URL for iframe src
    const embedUrl = `${baseUrl}/embed/${id}`
    
    const oembedData = {
      success: true,
      version: '1.0',
      type: 'rich',
      provider_name: 'Quick Embedder',
      provider_url: baseUrl,
      title: fileData.filename,
      author_name: 'Quick Embedder User',
      author_url: baseUrl,
      width: '800',
      height: '600',
      html: `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen style="width: 100%;"></iframe>`
    }

    if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="utf-8"?>
<oembed>
  <version>${oembedData.version}</version>
  <type>${oembedData.type}</type>
  <provider_name>${oembedData.provider_name}</provider_name>
  <provider_url>${oembedData.provider_url}</provider_url>
  <title>${oembedData.title}</title>
  <html><![CDATA[${oembedData.html}]]></html>
  <width>${oembedData.width}</width>
  <height>${oembedData.height}</height>
</oembed>`
      
      return new NextResponse(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        }
      })
    }

    return NextResponse.json(oembedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    })
  } catch (error) {
    console.error('oEmbed error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        }
      }
    )
  }
}