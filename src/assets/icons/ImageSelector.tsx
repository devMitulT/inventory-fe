import * as React from "react";

interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {}

const imageSelector: React.FC<SVGComponentProps> = (props) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.5"
      d="M1 20.5L7.08959 15.0194C7.88025 14.3078 9.08958 14.3396 9.84174 15.0917L12.25 17.5L18.3358 11.4142C19.1168 10.6332 20.3832 10.6332 21.1642 11.4142L25 15.25M11.5 8.5C11.5 9.32843 10.8284 10 10 10C9.17157 10 8.5 9.32843 8.5 8.5C8.5 7.67157 9.17157 7 10 7C10.8284 7 11.5 7.67157 11.5 8.5ZM3 25H23C24.1046 25 25 24.1046 25 23V3C25 1.89543 24.1046 1 23 1H3C1.89543 1 1 1.89543 1 3V23C1 24.1046 1.89543 25 3 25Z"
      stroke="#7F7F7F"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default imageSelector;
