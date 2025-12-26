import { useRef, useEffect } from 'react'
import { Play, Download, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const VideoCard = ({ video, registerVideoRef, unregisterVideoRef }) => {
  const { user } = useAuth()
  const { processingVideos } = useSocket()
  const videoRef = useRef(null)

  const processingData = processingVideos[video._id]
  const isProcessing = processingData?.status === 'processing'
  const isSafe = video.status === 'safe'
  const isFlagged = video.status === 'flagged'
  const isReady = video.status === 'safe'

  const videoUrl = video.cloudinaryUrl

  useEffect(() => {
    if (videoRef.current) {
      registerVideoRef(video._id, videoRef)
    }
    return () => {
      unregisterVideoRef(video._id)
    }
  }, [video._id, registerVideoRef, unregisterVideoRef])

  const handleOpenFullscreen = () => {
    const el = videoRef.current
    if (!el) return

    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen()
    }

    try {
      el.play()
    } catch (e) {}
  }

  const formatSize = (bytes) => {
    if (!bytes || bytes <= 0) return 'N/A'
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(1)} MB`
  }

  const handlePlay = () => {
    const el = videoRef.current
    if (!el) return
    const event = new CustomEvent('video:play', { detail: { id: video._id } })
    window.dispatchEvent(event)
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative h-40 sm:h-44 lg:h-48">
        {isProcessing ? (
          <div className="h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-medium text-gray-700">
                Processing {processingData?.progress || 0}%
              </div>
            </div>
          </div>
        ) : isReady ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            onPlay={handlePlay}
            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            poster={videoUrl + '?q=50&w=640&h=360&f=auto'}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              {isSafe ? (
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-2" />
              ) : isFlagged ? (
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-2" />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse" />
              )}
              <div className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
                {video.status}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[70%]"
            title={video.filename}
          >
            {video.filename}
          </h3>
          <span
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
              isSafe
                ? 'bg-green-100 text-green-800'
                : isFlagged
                ? 'bg-orange-100 text-orange-800'
                : isProcessing
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {video.status}
          </span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mb-1">
          Uploaded {new Date(video.createdAt).toLocaleDateString()}
        </div>
        <div className="text-[11px] sm:text-xs text-gray-400 mb-3">
          {formatSize(video.size)}
        </div>
        <div className="flex gap-2">
          {isReady && (
            <button
              type="button"
              onClick={handleOpenFullscreen}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Open Fullscreen</span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
          {user.role === 'admin' && (
            <button
              type="button"
              className="p-2 sm:p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCard
