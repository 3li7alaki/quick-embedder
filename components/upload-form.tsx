'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface UploadFormProps {
  onUploadSuccess: () => void
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.html')) {
      toast.error('Please select an HTML file')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      onUploadSuccess()
      toast.success('File uploaded successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Your HTML File</h3>
          <p className="text-slate-600">Drag and drop or click to browse</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragOver 
              ? 'border-blue-400 bg-blue-50 scale-105' 
              : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileText className={`h-12 w-12 mx-auto mb-4 transition-colors ${
            dragOver ? 'text-blue-500' : 'text-slate-400'
          }`} />
          <p className="mb-6 text-slate-600">
            Drop your HTML file here, or
          </p>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept=".html"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
            disabled={isUploading}
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border-0 px-8 py-3 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Browse Files
              </>
            )}
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Supported format: HTML files only • Max file size: 10MB
          </p>
        </div>
      </div>
    </div>
  )
}