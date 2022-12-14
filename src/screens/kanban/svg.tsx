export const BugSvg = () => (
  <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg">
    <title>{"bug"}</title>
    <g transform="translate(1 1)" fill="none" fillRule="evenodd">
      <rect fill="#E5493A" width={14} height={14} rx={2} />
      <path d="M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0" fill="#FFF" />
    </g>
  </svg>
);

export const TaskSvg = () => (
  <svg width={16} height={16} xmlns="http://www.w3.org/2000/svg">
    <title>{"task"}</title>
    <g transform="translate(1 1)" fill="none" fillRule="evenodd">
      <rect fill="#4BADE8" width={14} height={14} rx={2} />
      <g stroke="#FFF" strokeWidth={2} strokeLinecap="round">
        <path d="m6 9.5 4-5M6 9.5l-2-2" />
      </g>
    </g>
  </svg>
);
