import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Get file metadata from database
    const { data: fileData, error: dbError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', id)
      .single()

    if (dbError || !fileData) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Download file content from storage
    const { data: fileContent, error: storageError } = await supabase.storage
      .from('html-files')
      .download(fileData.file_path)

    if (storageError || !fileContent) {
      return new NextResponse('File content not found', { status: 404 })
    }

    // Convert blob to text
    const htmlContent = await fileContent.text()

    // Return the HTML content directly
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fileData.filename || 'Embedded Content'}</title>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      overflow: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      min-height: 100vh;
    }
    html, body {
      height: 100%;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': 'frame-ancestors *;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    console.error('Embed route error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}