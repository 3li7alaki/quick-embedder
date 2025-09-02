'use client'

import React, { useEffect, useState } from 'react'
import { UploadForm } from '@/components/upload-form'
import { FilesList } from '@/components/files-list'
import type { UploadedFile } from '@/lib/supabase'

export default function HomePage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files')
      if (response.ok) {
        const data = await response.json()
        setFiles(data)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleUploadSuccess = () => {
    fetchFiles()
  }

  const handleFileDeleted = () => {
    fetchFiles()
  }

  const handleFileRenamed = () => {
    fetchFiles()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">QE</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Quick Embedder</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Embed HTML Files
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"> Instantly</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your HTML files and get shareable, embeddable links perfect for presentations, 
            slides, and anywhere you need to showcase interactive content.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <UploadForm onUploadSuccess={handleUploadSuccess} />
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-slate-600">Loading your files...</span>
            </div>
          ) : (
            <FilesList files={files} onFileDeleted={handleFileDeleted} onFileRenamed={handleFileRenamed} />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-500 text-sm">
            <p>Built for creators who need to embed interactive HTML content in presentations.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}