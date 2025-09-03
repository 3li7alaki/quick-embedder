import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  const format = searchParams.get('format') || 'json'
  const maxwidth = searchParams.get('maxwidth') || '800'
  const maxheight = searchParams.get('maxheight') || '600'

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' }, 
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'no-cache',
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
          'Cache-Control': 'no-cache',
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

    // Build embed URL for professional HTML page preview
    const embedUrl = `${baseUrl}/embed/${id}`
    
    // Professional dimensions optimized for full HTML page viewing
    // Default to desktop-friendly dimensions with 16:10 aspect ratio
    const requestedWidth = parseInt(maxwidth) || 1280
    const requestedHeight = parseInt(maxheight) || 800
    
    // Apply reasonable limits while maintaining good viewing experience
    const width = Math.min(requestedWidth, 1920)
    const height = Math.min(requestedHeight, 1200)
    
    // Professional oEmbed response optimized for HTML document previews
    const oembedData = {
      version: '1.0',
      type: 'rich',
      provider_name: 'Quick Embedder',
      provider_url: baseUrl,
      cache_age: 86400, // 24 hour cache for better performance
      title: fileData.filename || 'HTML Document',
      author_name: 'Quick Embedder',
      author_url: baseUrl,
      width: width,
      height: height,
      html: `<iframe 
        src="${embedUrl}" 
        width="${width}" 
        height="${height}" 
        frameborder="0" 
        allowfullscreen="true" 
        loading="lazy" 
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads" 
        scrolling="yes" 
        style="width: 100%; height: ${height}px; max-width: ${width}px; min-height: 400px; border: none; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06); border-radius: 8px; background: #ffffff;" 
        title="${fileData.filename?.replace(/"/g, '&quot;') || 'HTML Preview'}">
      </iframe>`,
      thumbnail_url: `${baseUrl}/api/og?id=${id}`,
      thumbnail_width: 1200,
      thumbnail_height: 630
    }

    if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="utf-8"?>
<oembed>
  <version>${oembedData.version}</version>
  <type>${oembedData.type}</type>
  <provider_name>${oembedData.provider_name}</provider_name>
  <provider_url>${oembedData.provider_url}</provider_url>
  <title>${oembedData.title}</title>
  <author_name>${oembedData.author_name}</author_name>
  <author_url>${oembedData.author_url}</author_url>
  <cache_age>${oembedData.cache_age}</cache_age>
  <html><![CDATA[${oembedData.html}]]></html>
  <width>${oembedData.width}</width>
  <height>${oembedData.height}</height>
  <thumbnail_url>${oembedData.thumbnail_url}</thumbnail_url>
  <thumbnail_width>${oembedData.thumbnail_width}</thumbnail_width>
  <thumbnail_height>${oembedData.thumbnail_height}</thumbnail_height>
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
        'Cache-Control': 'public, max-age=3600',
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