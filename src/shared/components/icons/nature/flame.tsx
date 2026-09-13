export function Flame({...props}) {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2.75c.8 3.1 2.6 4.3 4.1 6 1.4 1.6 2.15 3.2 2.15 5.05A6.25 6.25 0 0 1 12 20.9a6.25 6.25 0 0 1-6.25-7.1c.2-2 1.2-3.4 2.3-4.6.3 1 .9 1.7 1.75 2.05-.15-2.9.75-6 2.2-8.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12 20.9a3 3 0 0 1-3-3c0-1.6 1.3-2.5 1.9-3.9.75.9 1.35 1.25 2.2 1.7 1.1.6 1.9 1.35 1.9 2.5a3 3 0 0 1-3 2.7Z"
        fill="currentColor"
        fillOpacity="0.35"
      />
    </svg>
  );
}
