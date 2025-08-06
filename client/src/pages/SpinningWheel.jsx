// import React, { useState } from "react";
// import { Wheel } from "react-custom-roulette";

// const SpinningWheel = ({ segments }) => {
//   const [mustSpin, setMustSpin] = useState(false);
//   const [prizeNumber, setPrizeNumber] = useState(0);
//   const [winner, setWinner] = useState(null);

//  const data = segments.map(({ option, image, showText }) => ({
//   option: showText ? option : "",
//   image: image ? { uri: image } : null
// }));


//   const handleSpinClick = () => {
//     const randomIndex = Math.floor(Math.random() * data.length);
//     setPrizeNumber(randomIndex);
//     setMustSpin(true);
//     setWinner(null);
//   };

//     const pointer = {
//         style: {
//            width: "40px",
//            height: "40px",
//            position : 'absolute',
//            top: "5%",
//            left: "78%",
//         },
//     }

//   return (
//     <div className="flex flex-col items-center" >
//         <div >

//       <Wheel
//   mustStartSpinning={mustSpin}
//   prizeNumber={prizeNumber}
//   data={data}
//   backgroundColors={["#3e3e3e", "#df3428"]}
//   textColors={["#ffffff"]}
//   onStopSpinning={() => {
//     setMustSpin(false);
//     setWinner(data[prizeNumber].option);
//   }}
//   pointerProps={pointer}
//   fontSize={16}
//   startRotationAngle={90}
//   outerBorderColor="#ccc"
//   innerRadius={10}
//   radiusLineColor="#fff"
//   textDistance={60}
//   perpendicularText
//   spinDuration={0.5}
//   hasImage
// />

//         </div>

//       <button
//         onClick={handleSpinClick}
//         disabled={mustSpin}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {mustSpin ? "Spinning..." : "Spin"}
//       </button>

//       {winner && (
//         <div className="mt-3 text-lg font-semibold text-green-700">
//           🎉 You got: <span className="underline">{winner}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SpinningWheel;



import { useRef, useState } from "react";

const SpinningWheel = ({ segments }) => {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const wheelRef = useRef(null);

  const radius = 150;
  const center = radius;
  const segmentAngle = 360 / segments.length;
  const pointerAngleDeg = 270; // 2 o'clock


const spinWheel = () => {
  if (spinning) return;
  setSpinning(true);
  setWinnerIndex(null);

  const spins = 5;
  const randomOffset = Math.random() * 360;
  const stopAngle = 360 * spins + randomOffset;

  setAngle((prev) => prev + stopAngle);

  setTimeout(() => {
    const finalRotation = (angle + stopAngle) % 360;

    // Use pointerAngleDeg to get actual pointer location relative to wheel
    const pointerAngle = (360 + pointerAngleDeg - finalRotation) % 360;

    const index = Math.floor(pointerAngle / segmentAngle) % segments.length;

    setWinnerIndex(index);
    setSpinning(false);
  }, 4000);
};

  return (
    <div className="flex flex-col items-center relative">
      {/* Arrow Pointer - moved to right */}
      <div
        className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[24px] border-transparent border-l-red-500 rotate-180"
       style={{ position: "absolute", top: "-10px", left: "48.20%", transform: "translateX(-50%) rotate(270deg)", zIndex: 10 }}

      ></div>

      {/* Wheel */}
   <div className="relative" style={{ width: 2 * radius, height: 2 * radius }}>
  {/* Wheel SVG */}
  <svg
    width={2 * radius}
    height={2 * radius}
    viewBox={`0 0 ${2 * radius} ${2 * radius}`}
    style={{
      transform: `rotate(${angle}deg)`,
      transition: "transform 4s ease-out",
    }}
    ref={wheelRef}
  >
    {/* Segments */}
    {segments.map((segment, i) => {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);
      const largeArc = segmentAngle > 180 ? 1 : 0;

      const fillColor =
        i === winnerIndex
          ? `hsl(${(i * 360) / segments.length}, 80%, 30%)`
          : `hsl(${(i * 360) / segments.length}, 80%, 60%)`;

      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = radius * 0.65;

      return (
        <g key={i}>
          <path
            d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
            fill={fillColor}
          />
          <text
            x={center + textRadius * Math.cos((textAngle * Math.PI) / 180)}
            y={center + textRadius * Math.sin((textAngle * Math.PI) / 180)}
            fill="#fff"
            fontSize="14"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textAngle}, ${center + textRadius * Math.cos((textAngle * Math.PI) / 180)}, ${center + textRadius * Math.sin((textAngle * Math.PI) / 180)})`}
          >
            {segment.option ?? segment}
          </text>
        </g>
      );
    })}
  </svg>

  {/* Spin Button FIXED in center */}
  <button
    className={`absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-black text-white font-semibold shadow-md flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2 z-10 ${
      spinning ? "cursor-not-allowed" : "hover:scale-105"
    }`}
    onClick={spinWheel}
    disabled={spinning}
  >
    {spinning ? "" : "Spin"}
  </button>
</div>





      {/* Spin Button */}
     

      {/* Winner Display */}
      {/* {winnerIndex !== null && (
        <div className="mt-3 text-lg font-semibold text-green-700">
          🎉 You got: <span className="underline">{segments[winnerIndex]}</span>
        </div>
      )} */}
    </div>
  );
};

export default SpinningWheel;

