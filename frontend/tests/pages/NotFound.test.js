import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import NotFound from '../../src/pages/NotFound'

describe('NotFound Component', () => {
  test('renders 404 heading', () => {
    render(<NotFound />)
    const heading = screen.getByText('404')
    expect(heading).toBeInTheDocument()
  })

  test('renders Page Not Found subheading', () => {
    render(<NotFound />)
    const subheading = screen.getByText('Page Not Found')
    expect(subheading).toBeInTheDocument()
  })

  test('renders navigation suggestion text', () => {
    render(<NotFound />)
    const text = screen.getByText(/Try navigating to other pages/i)
    expect(text).toBeInTheDocument()
  })

  test('renders panda image with correct alt text', () => {
    render(<NotFound />)
    const img = screen.getByAltText('Confused Panda')
    expect(img).toBeInTheDocument()
  })
})
