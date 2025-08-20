'use client'

import React from 'react'

export default function ShareButton() {
  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert('Link copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className='mt-4 mb-8 flex items-center justify-end w-full'>
      <button onClick={handleCopyUrl} aria-label="Copy URL" className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-100 hover:opacity-70 w-8 h-8'>
        {shareButton}
      </button>
    </div>
  )
}

const shareButton = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-5 h-5'>
    <g clipPath="url(#clip0_15_72)">
      <rect width="24" height="24" fill="inherit" />
      <circle cx="7" cy="12" r="2" stroke="#000000" strokeLinejoin="round" />
      <circle cx="17" cy="6" r="2" stroke="#000000" strokeLinejoin="round" />
      <path d="M15 7L8.5 11" stroke="#000000" />
      <circle cx="17" cy="18" r="2" stroke="#000000" strokeLinejoin="round" />
      <path d="M8.5 13.5L15 17" stroke="#000000" />
    </g>
    <defs>
      <clipPath id="clip0_15_72">
        <rect width="24" height="24" fill="inherit" />
      </clipPath>
    </defs>
  </svg>
)