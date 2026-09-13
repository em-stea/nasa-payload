export function Cyclone({...props}) {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 6.25c3.2 0 5.75 1.1 5.75 3.1S15.2 12 12 12s-5.75 1.1-5.75 3.1 2.55 3.1 5.75 3.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" fill="currentColor" r="1.75" />
    </svg>
  );
}
