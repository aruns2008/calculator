import React from "react";

const CircularProgress = ({ percentage }) => {
  const strokeWidth = 3;
  const radius = 30;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const cappedPercentage = Math.min(Math.floor(percentage), 100);

  const strokeDashoffset = circumference - (cappedPercentage / 100) * circumference;  
  const circleStyle = {
    transition: "stroke-dashoffset 0.35s",
    transform: "rotate(-90deg)",
    transformOrigin: "50% 50%",
  };

  return (
    <svg height={radius * 2} width={radius * 2} className="circular-progress">
      <circle
        stroke="#d3d3d3" // Background circle color
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={percentage === 100 ? "#077D55" : "red"} // Progress circle color
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        style={circleStyle}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="24px"
        fill="#333"
        className="percentage-text"
      >
        {!isNaN(cappedPercentage) ? `${cappedPercentage}%`: "0%"}        
      </text>
    </svg>
  );
};

export default CircularProgress;
