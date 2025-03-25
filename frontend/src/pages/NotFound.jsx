import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen text-center px-10 md:px-40 xl:px-90">
      <div className="lg:w-1/2 flex flex-col items-center">
        <h1 className="xl:text-9xl md:text-7xl text-5xl font-bold text-red-600">404</h1>
        <h2 className="xl:text-4xl md:text-2xl text-2xl font-semibold text-red-600 mt-2">Page Not Found</h2>
        <p className="md:mt-8 mt-4 xl:text-2xl md:text-xl text-lg text-gray-700 font-poppins">
          Try navigating to other pages through the navigation bar!
        </p>
      </div>
      <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-0">
        <img src="src/assets/panda.png" alt="Confused Panda" className="max-w-sm xl:w-xs" />
      </div>
    </div>

  )
}

export default NotFound