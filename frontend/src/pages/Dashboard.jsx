import { useState, useEffect } from 'react'
import { LogOut, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import VideoUpload from '../components/VideoUpload'
import VideoList from '../components/VideoList'

const Dashboard = () => {
  const { user, logout, api } = useAuth()
  const { socket } = useSocket()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('upload')
  const [profileOpen, setProfileOpen] = useState(false)

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos')
      setVideos(data)
    } catch {
      toast.error('Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'P'

  const memberSince =
    user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null
  const lastLogin =
    user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                <img
                  src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/6f5a8e7b0cac4a01871d5c215eeac9a2?ik-sanitizeSvg=true"
                  alt="Pulse Logo"
                  className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 object-contain"
                />
              </div>

              <div className="leading-tight min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 truncate">
                  PULSE STREAM
                </h1>
                <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 truncate">
                  Video insights workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Logout</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-indigo-700 transition-transform duration-200 hover:scale-105"
              >
                {initials}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    socket?.connected ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <p className="text-[11px] sm:text-xs lg:text-sm font-semibold tracking-[0.18em] uppercase text-slate-400">
            Dashboard
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-sm px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1 py-1 w-full max-w-xs sm:max-w-sm">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 sm:px-4 lg:px-6 py-1.5 rounded-full text-sm font-medium transition-colors flex-1 ${
                    activeTab === 'upload'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Upload New
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-3 sm:px-4 lg:px-6 py-1.5 rounded-full text-sm font-medium transition-colors flex-1 ${
                    activeTab === 'list'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  My Videos
                </button>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                {activeTab === 'upload'
                  ? 'Upload and analyze new videos in your workspace.'
                  : 'Browse and manage the videos you have already uploaded.'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white/90 p-3 sm:p-4 lg:p-6 xl:p-8">
            {activeTab === 'upload' ? (
              <VideoUpload onUploadComplete={fetchVideos} />
            ) : (
              <VideoList
                videos={videos}
                loading={loading}
                onRefresh={fetchVideos}
              />
            )}
          </div>
        </div>
      </main>

      <div
        className={`fixed inset-0 z-50 flex ${
          profileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`flex-1 bg-black/50 transition-opacity duration-300 ${
            profileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setProfileOpen(false)}
        />

        <div
          className={`w-screen sm:w-full sm:max-w-xs md:max-w-sm lg:max-w-md h-full bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-out ${
            profileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-slate-400">
                Profile
              </p>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition ml-auto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 px-1">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm sm:text-base lg:text-lg font-semibold flex-shrink-0">
                {initials}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    socket?.connected ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 truncate">
                  {user?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
            <section>
              <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-slate-400 mb-2">
                Account
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm lg:text-base text-slate-700 space-y-1.5">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium truncate text-right max-w-[60%] sm:max-w-[220px]">
                    {user?.email || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Member since</span>
                  <span className="font-medium">{memberSince || '—'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Last login</span>
                  <span className="font-medium text-right truncate max-w-[60%] sm:max-w-[220px]">
                    {lastLogin || 'Current session'}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-slate-400 mb-2">
                Connection
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm lg:text-base flex items-center justify-between">
                <span className="text-slate-600">Socket status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs lg:text-sm font-medium ${
                    socket?.connected
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      socket?.connected ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  {socket?.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </section>

            <section>
              <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-slate-400 mb-2">
                Usage
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs sm:text-sm lg:text-base text-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total videos</span>
                  <span className="font-semibold">{videos.length}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-red-500 text-white text-sm lg:text-base font-medium shadow-sm hover:bg-red-600 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
