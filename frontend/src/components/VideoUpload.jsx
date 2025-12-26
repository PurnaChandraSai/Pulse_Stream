import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const VideoUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoId, setVideoId] = useState(null)
  const fileInputRef = useRef()
  const { api } = useAuth()

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 200 * 1024 * 1024) {
      toast.error('File size must be less than 200MB')
      return
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file')
      return
    }

    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('video', file)

    try {
      const { data } = await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total))
          }
        }
      })

      setVideoId(data.videoId)
      toast.success('Video uploaded! Processing started...')
      setProgress(100)

      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        setVideoId(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 2000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
      setUploading(false)
    }
  }

  return (
    <div className="bg-[#F7F9FC]">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16 flex justify-center">
        <div className="w-[420px] h-[420px] bg-white rounded-3xl border border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.08)] flex flex-col items-center justify-center px-8">
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Upload className="w-7 h-7 text-slate-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Upload Video
            </h2>
            <p className="text-xs text-slate-500">
              Max 200MB • MP4, MOV, AVI
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="video-upload"
          />

          <label
            htmlFor="video-upload"
            className={`w-full max-w-xs rounded-2xl border-2 border-dashed px-6 py-8 flex flex-col items-center text-center transition ${
              uploading
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer'
            }`}
          >
            {uploading ? (
              <>
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <span className="text-sm font-medium text-slate-900">
                  Uploading…
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-mono">
                  {progress}%
                </span>
              </>
            ) : (
              <>
                <Upload className="w-9 h-9 text-slate-400 mb-3" />
                <span className="text-sm font-medium text-slate-900">
                  Click to upload video
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  or drag and drop
                </span>
              </>
            )}
          </label>

          {videoId && (
            <div className="w-full max-w-xs mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-800 truncate">
                Video ID: {videoId.slice(-8)}
              </span>
              <button onClick={() => setVideoId(null)} className="ml-auto">
                <X className="w-3.5 h-3.5 text-emerald-600 hover:text-emerald-800" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoUpload
