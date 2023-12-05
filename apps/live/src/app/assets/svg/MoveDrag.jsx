import React from 'react'

export const MoveDrag = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-arrows-move"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#ffffff"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        position: 'absolute',
        top: '10%',
        left: '85%',
        transform: 'translate(-50%, -50%)',
        zIndex: '1000',
      }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 9l3 3l-3 3" />
      <path d="M15 12h6" />
      <path d="M6 9l-3 3l3 3" />
      <path d="M3 12h6" />
      <path d="M9 18l3 3l3 -3" />
      <path d="M12 15v6" />
      <path d="M15 6l-3 -3l-3 3" />
      <path d="M12 3v6" />
    </svg>
  )
}
