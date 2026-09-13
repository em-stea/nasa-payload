export function Cube({...props}) {
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
        d="M12 2.75L20.5 7.25V16.75L12 21.25L3.5 16.75V7.25L12 2.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 7.25L12 11.75L20.5 7.25"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M12 11.75V21.25" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
