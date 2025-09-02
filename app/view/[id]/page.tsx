import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface ViewPageProps {
  params: Promise<{ id: string }>
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params

  try {
    // Get file metadata from database
    const { data: fileData, error: dbError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', id)
      .single()

    if (dbError || !fileData) {
      notFound()
    }

    // Download file content from storage
    const { data: fileContent, error: storageError } = await supabase.storage
      .from('html-files')
      .download(fileData.file_path)

    if (storageError || !fileContent) {
      notFound()
    }

    // Convert blob to text
    const htmlContent = await fileContent.text()

    // Return the HTML content directly
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{ width: '100%', height: '100vh' }}
      />
    )

  } catch (error) {
    console.error('View page error:', error)
    notFound()
  }
}

// Generate metadata for better embedding
export async function generateMetadata({ params }: ViewPageProps) {
  const { id } = await params
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    const { data: fileData } = await supabase
      .from('uploaded_files')
      .select('filename')
      .eq('id', id)
      .single()

    const title = fileData?.filename || 'Quick Embedder'
    const viewUrl = `${baseUrl}/view/${id}`

    return {
      title,
      description: `View ${title} - Quick Embedder`,
      openGraph: {
        title,
        description: `Interactive preview of ${title}`,
        url: viewUrl,
        type: 'website',
        siteName: 'Quick Embedder'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: `Interactive preview of ${title}`
      },
      alternates: {
        canonical: viewUrl,
        types: {
          'application/json+oembed': `${baseUrl}/api/oembed?url=${encodeURIComponent(viewUrl)}&format=json`,
          'text/xml+oembed': `${baseUrl}/api/oembed?url=${encodeURIComponent(viewUrl)}&format=xml`
        }
      },
      other: {
        'X-Frame-Options': 'ALLOWALL'
      }
    }
  } catch {
    return {
      title: 'Quick Embedder',
      robots: 'noindex, nofollow'
    }
  }
}