import { useEffect, useRef } from "react";

export default function SvgDotAnimation() {
  const pathRef = useRef(null);
  const circleRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    const dots = [
      { progress: 0, speed: 2, direction: 1 },  
      { progress: 20, speed: 2, direction: -1 },  
      { progress: 100, speed: 3, direction: 1 },
    ];

    const animate = () => {
      dots.forEach((dot, index) => {
        dot.progress += dot.speed * dot.direction;

        if (dot.progress >= pathLength) dot.progress = 0;
        if (dot.progress < 0) dot.progress = pathLength;

        const point = path.getPointAtLength(dot.progress);
        if (circleRefs) {
              circleRefs[index].current.setAttribute("cx", point.x);
              circleRefs[index].current.setAttribute("cy", point.y);
        }  
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="742" height="537" viewBox="0 0 742 537" fill="none">
      <g id="Layer_1" data-name="Layer 1">
        <path
          ref={pathRef}
          fill="none"
          stroke="#c18aee"
          strokeWidth="2"
          d="M283.260,131.327 C480.473,5.721 679.403,-34.777 727.584,40.872 C775.765,116.520 654.952,279.670 457.740,405.275 C260.527,530.880 61.597,571.379 13.416,495.730 C-34.765,420.081 86.048,256.933 283.260,131.327 Z"
        />
      </g>

      <circle ref={circleRefs[0]} r="16" fill="#a234df" />
      <circle ref={circleRefs[1]} r="8" fill="blue" />
      <circle ref={circleRefs[2]} r="10" fill="red" />
    </svg>
  );
}
