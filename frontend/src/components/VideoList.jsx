import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import VideoCard from './VideoCard'

const VideoList = ({ videos, loading, onRefresh }) => {
  const [sortBy, setSortBy] = useState('date-desc')
  const videoRefs = useRef({})

  const registerVideoRef = (id, ref) => {
    videoRefs.current[id] = ref
  }

  const unregisterVideoRef = (id) => {
    delete videoRefs.current[id]
  }

  useEffect(() => {
    const handler = (e) => {
      const currentId = e.detail.id
      Object.entries(videoRefs.current).forEach(([id, ref]) => {
        if (id !== currentId && ref.current && !ref.current.paused) {
          ref.current.pause()
        }
      })
    }

    window.addEventListener('video:play', handler)
    return () => {
      window.removeEventListener('video:play', handler)
    }
  }, [])

  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'name-asc':
        return a.filename.localeCompare(b.filename)
      case 'name-desc':
        return b.filename.localeCompare(a.filename)
      case 'size-desc':
        return (b.size || 0) - (a.size || 0)
      case 'size-asc':
        return (a.size || 0) - (b.size || 0)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 sm:h-44 lg:h-48 xl:h-52 bg-gray-200 rounded-xl mb-4 sm:mb-5" />
            <div className="h-5 sm:h-6 bg-gray-200 rounded-lg mb-2 sm:mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
          Your Videos ({sortedVideos.length})
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="relative w-full sm:w-48 lg:w-56">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg lg:rounded-xl px-3 sm:px-4 lg:px-5 py-2.5 text-xs sm:text-sm lg:text-base font-medium text-gray-900 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-8 sm:pr-10 lg:pr-12"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-desc">Largest First</option>
              <option value="size-asc">Smallest First</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={onRefresh}
            className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm lg:text-base font-semibold rounded-lg lg:rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex-shrink-0"
          >
            Refresh
          </button>
        </div>
      </div>

      {sortedVideos.length === 0 ? (
        <div className="text-center py-16 sm:py-20 lg:py-24 xl:py-28">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10">
            <video className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 opacity-40" />
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
            No videos yet
          </h3>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 mb-6 sm:mb-8 lg:mb-10 max-w-md lg:max-w-lg xl:max-w-xl mx-auto leading-relaxed">
            Get started by uploading your first video. Supports all major formats
            up to 200MB.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
          {sortedVideos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              registerVideoRef={registerVideoRef}
              unregisterVideoRef={unregisterVideoRef}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoList
