export const DraftWebsiteIcon: React.FC<React.SVGAttributes<{}>> = (props) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    {...props}
  >
    {/* Browser Window Frame */}
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    
    {/* Browser Header Bar */}
    <path
      stroke="currentColor"
      strokeLinecap="round"
      d="M2 8h20"
    />
    
    {/* Browser Controls */}
    <circle
      cx="5"
      cy="6"
      r="0.75"
      fill="currentColor"
    />
    <circle
      cx="8"
      cy="6"
      r="0.75"
      fill="currentColor"
    />
    <circle
      cx="11"
      cy="6"
      r="0.75"
      fill="currentColor"
    />
    
    {/* Draft Content Lines (dashed) */}
    <line
      x1="6"
      y1="11"
      x2="14"
      y2="11"
      stroke="currentColor"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <line
      x1="6"
      y1="14"
      x2="18"
      y2="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <line
      x1="6"
      y1="17"
      x2="16"
      y2="17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    
    {/* Pencil Icon */}
    <g transform="translate(13, 9) scale(0.8)">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      />
    </g>
  </svg>
);
  