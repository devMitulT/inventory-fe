import * as React from "react";

interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {}

const crossIcon: React.FC<SVGComponentProps> = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width={24} height={24} rx={12} fill="#EDEDED" />
    <path
      d="M17 7L7 17"
      stroke="#8C8C8C"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7L17 17"
      stroke="#8C8C8C"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default crossIcon;
