import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="flex space-x-4 mb-10">
            <div className="w-8 h-8 bg-red-600 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
            <div className="w-8 h-8 bg-red-600 rounded-full animate-bounce [animation-delay:-0.25s]"></div>
            <div className="w-8 h-8 bg-red-600 rounded-full animate-bounce"></div>
        </div>
        <p className="mt-2 text-4xl font-semibold text-black">
            Loading
            <span className="dot1 ml-1">.</span>
            <span className="dot2 ml-1">.</span>
            <span className="dot3 ml-1">.</span>
        </p>
    </div>
  )
}

export default Loading