import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="flex space-x-4 mb-10">
            <div data-testid="bouncing-dot" className="w-4 h-4 sm:w-8 sm:h-8 bg-red-600 rounded-full animate-bounce [animation-delay:-0.5s]"></div>
            <div data-testid="bouncing-dot" className="w-4 h-4 sm:w-8 sm:h-8 bg-red-600 rounded-full animate-bounce [animation-delay:-0.25s]"></div>
            <div data-testid="bouncing-dot" className="w-4 h-4 sm:w-8 sm:h-8 bg-red-600 rounded-full animate-bounce"></div>
        </div>
        <p className="mt-2 text-2xl sm:text-4xl font-semibold text-black">
            Loading
            <span className="dot1 sm:ml-1 ml-0.5">.</span>
            <span className="dot2 sm:ml-1 ml-0.5">.</span>
            <span className="dot3 sm:ml-1 ml-0.5">.</span>
        </p>
    </div>
  )
}

export default Loading