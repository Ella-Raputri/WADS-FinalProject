import React from 'react'
import Footer from '../components/Footer'

const WelcomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Dummy Page</h1>
        <p className="text-gray-700 text-lg text-center">
          This page is filled with placeholder content to test the footer positioning.
        </p>

        {/* Dummy Content with Scroll */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Section {index + 1}</h2>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula justo at eros ultricies, nec tincidunt justo consequat.
              </p>
            </div>
          ))}
        </div>
      </main>
      
    </div>

  )
}

export default WelcomePage