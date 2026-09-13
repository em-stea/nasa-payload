export function Snowflake({ ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2.75v18.5M4 7.375l16 9.25M20 7.375l-16 9.25" />
        <path d="M9.75 4.75 12 7l2.25-2.25M9.75 19.25 12 17l2.25 2.25" />
      </g>
    </svg>
  )
}
