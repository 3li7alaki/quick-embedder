import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Script from 'next/script'

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
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const embedUrl = `${baseUrl}/embed/${id}`

    // Return the HTML content directly with discovery links
    return (
      <>
        <Script id="iframely-discovery" strategy="beforeInteractive">
          {`
            // Add Iframely discovery link
            var iframelyLink = document.createElement('link');
            iframelyLink.rel = 'iframely';
            iframelyLink.type = 'text/html';
            iframelyLink.href = '${embedUrl}';
            iframelyLink.media = 'aspect-ratio: 16/10; max-width: 1280';
            document.head.appendChild(iframelyLink);
          `}
        </Script>
        <div 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{ width: '100%', height: '100vh' }}
        />
      </>
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
        siteName: 'Quick Embedder',
        videos: [
          {
            url: `${baseUrl}/embed/${id}`,
            secureUrl: `${baseUrl}/embed/${id}`,
            type: 'text/html',
            width: 800,
            height: 600
          }
        ]
      },
      twitter: {
        card: 'player',
        title,
        description: `Interactive preview of ${title}`,
        players: [
          {
            playerUrl: `${baseUrl}/embed/${id}`,
            streamUrl: `${baseUrl}/embed/${id}`,
            width: 800,
            height: 600
          }
        ],
        player: `${baseUrl}/embed/${id}`,
        playerWidth: 800,
        playerHeight: 600
      },
      alternates: {
        canonical: viewUrl,
        types: {
          'application/json+oembed': `${baseUrl}/api/oembed?url=${encodeURIComponent(viewUrl)}&format=json`,
          'text/xml+oembed': `${baseUrl}/api/oembed?url=${encodeURIComponent(viewUrl)}&format=xml`
        }
      },
      other: {
        'iframely:href': `${baseUrl}/embed/${id}`,
        'iframely:media': 'aspect-ratio: 16/10; max-width: 1280',
        'iframely:rel': 'iframely app',
        'iframely:type': 'text/html',
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