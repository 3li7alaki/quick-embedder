'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Trash2, Copy, FileText, Check, Edit2 } from 'lucide-react'
import type { UploadedFile } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface FilesListProps {
  files: UploadedFile[]
  onFileDeleted: () => void
  onFileRenamed?: () => void
}

export function FilesList({ files, onFileDeleted, onFileRenamed }: FilesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      onFileDeleted()
      toast.success('File deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete file')
    } finally {
      setDeletingId(null)
    }
  }

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Copy error:', error)
      toast.error('Failed to copy link')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRename = async (id: string, newName: string) => {
    try {
      const response = await fetch(`/api/files/${id}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: newName })
      })

      if (!response.ok) {
        throw new Error('Failed to rename file')
      }

      setEditingId(null)
      onFileRenamed?.()
      toast.success('File renamed successfully')
    } catch (error) {
      console.error('Rename error:', error)
      toast.error('Failed to rename file')
    }
  }

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No files yet</h3>
        <p className="text-slate-600">Upload your first HTML file to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Your Files ({files.length})
          </h3>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {files.map((file) => {
          const viewUrl = `${window.location.origin}/view/${file.id}`
          
          return (
            <div
              key={file.id}
              className="p-6 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingId === file.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(file.id, editingName)
                              } else if (e.key === 'Escape') {
                                cancelEditing()
                              }
                            }}
                            onBlur={() => handleRename(file.id, editingName)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900 truncate">{file.filename}</h4>
                          <button
                            onClick={() => startEditing(file.id, file.filename)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                          >
                            <Edit2 className="h-3 w-3 text-slate-500" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(file.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border">
                    <p className="text-xs text-slate-600 mb-2">Embeddable URL:</p>
                    <code className="text-xs font-mono text-slate-800 break-all">{viewUrl}</code>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => copyToClipboard(viewUrl, file.id)}
                    className={`h-9 px-3 text-sm ${
                      copiedId === file.id 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    } transition-colors`}
                  >
                    {copiedId === file.id ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => window.open(viewUrl, '_blank')}
                    className="h-9 px-3 text-sm bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  <Button
                    onClick={() => handleDelete(file.id)}
                    disabled={deletingId === file.id}
                    className="h-9 px-3 text-sm bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}