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

  try {
    const { data: fileData } = await supabase
      .from('uploaded_files')
      .select('filename')
      .eq('id', id)
      .single()

    return {
      title: fileData?.filename || 'Quick Embedder',
      robots: 'noindex, nofollow'
    }
  } catch {
    return {
      title: 'Quick Embedder',
      robots: 'noindex, nofollow'
    }
  }
}