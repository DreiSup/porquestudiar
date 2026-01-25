import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
        <div className="text-4xl font-bold text-amber-500 animate-pulse">...</div>
        <p className="text-gray-300 font-mono text-3xl tracking-widest uppercase">...</p>
        </div>
    </div>
  )
}

export default LoadingScreen