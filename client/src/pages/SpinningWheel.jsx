import { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import clickSound from "../assets/click.wav";
import { GoUnmute, GoMute } from "react-icons/go";
import confettiSound from "../assets/winSound.mp3";

const SpinningWheel = ({ segments, isFullScreen }) => {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [muted, setMuted] = useState(false);
  const [segmentImages, setSegmentImages] = useState({}); // preloaded images

  const canvasRef = useRef(null);
  const clickSoundRef = useRef(null);
  const lastSegmentRef = useRef(null);
  const confettiSoundRef = useRef(null);

  const radius = isFullScreen ? 300 : 230;
  const center = radius;
  const pointerAngleDeg = 270;
  const segmentAngle = 360 / segments.length;
  const canvasSize = 2 * radius;

  // Preload all segment images
  useEffect(() => {
    const loadAllImages = async () => {
      const images = {};
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].image) {
          const img = new Image();
          img.src = segments[i].image;
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          images[segments[i].id] = img;
        }
      }
      setSegmentImages(images);
    };
    loadAllImages();
  }, [segments]);

  // Draw the wheel
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((angle * Math.PI) / 180);

    for (let i = 0; i < segments.length; i++) {
      const start = (i * segmentAngle * Math.PI) / 180;
      const end = ((i + 1) * segmentAngle * Math.PI) / 180;

      // Segment color
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(i * 360) / segments.length}, 80%, 60%)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2); // full circle
      ctx.lineWidth = 3; // thickness of the outline
      ctx.strokeStyle = "#000"; // black color
      ctx.stroke();

      // Draw image if exists
      const segImg = segmentImages[segments[i].id];
      if (segImg) {
        ctx.save();
        const midAngle = start + (end - start) / 2;
        const imgSize = Math.max(30, 80 - segments.length * 2);
        const imgDistanceFromCenter = radius * 0.75;

        ctx.translate(
          Math.cos(midAngle) * imgDistanceFromCenter,
          Math.sin(midAngle) * imgDistanceFromCenter
        );

        ctx.beginPath();
        ctx.arc(0, 0, imgSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(segImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();
      }

      // Draw text
      if (segments[i].showText && segments[i].text) {
        ctx.save();
        const midAngle = start + (end - start) / 2;
        const textRadius = radius * 0.75;
        ctx.translate(
          Math.cos(midAngle) * textRadius,
          Math.sin(midAngle) * textRadius
        );
        ctx.rotate(midAngle);
        ctx.fillStyle = "#fff";
        ctx.font = `${Math.max(10, 14 - segments.length * 0.3)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(segments[i].text ?? "", 0, 0);
        ctx.restore();
      }
    }

    ctx.restore();
  };

  // Redraw when angle or segments change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    drawWheel();
  }, [angle, segments, canvasSize, segmentImages]);

  // Spin wheel
  const spinWheel = () => {
    if (spinning || segments.length === 0) return;
    setSpinning(true);
    setWinnerIndex(null);
    lastSegmentRef.current = null;

    const spins = 5;
    const randomOffset = Math.random() * 360;
    const stopAngle = 360 * spins + randomOffset;
    const startAngle = angle;
    const targetAngle = angle + stopAngle;
    const duration = 4000;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + easeOut * (targetAngle - startAngle);
      setAngle(currentAngle);

      // Pointer calculations
      const normalizedAngle = currentAngle % 360;
      const pointerAngle = (360 + pointerAngleDeg - normalizedAngle) % 360;
      const currentSegmentIndex =
        Math.floor(pointerAngle / segmentAngle) % segments.length;

      if (lastSegmentRef.current !== currentSegmentIndex) {
        if (clickSoundRef.current && !muted) {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play();
        }
        lastSegmentRef.current = currentSegmentIndex;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setWinnerIndex(currentSegmentIndex);
        setSpinning(false);
        // Play confetti sound
        if (confettiSoundRef.current && !muted) {
          confettiSoundRef.current.currentTime = 0;
          confettiSoundRef.current.play();
        }

        confetti({ particleCount: 600, spread: 300, origin: { y: 0.6 } });
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col pt-10 items-center relative space-y-4">
      {/* Pointer */}
      <div
        className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[24px] border-transparent border-l-red-500 rotate-180"
        style={{
          position: "absolute",
          top: "10px",
          left: "45.3%",
          transform: "translateX(-50%) rotate(270deg)",
          zIndex: 10,
        }}
      ></div>

      {/* Canvas */}
      <div
        className="relative"
        style={{ width: canvasSize, height: canvasSize }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{ borderRadius: "50%" }}
        ></canvas>

        {/* Spin Button */}
        <button
          className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full shadow-md flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2 z-10 bg-black text-white"
          onClick={spinWheel}
          disabled={spinning || segments.length === 0}
        >
          {spinning ? "" : "Spin"}
        </button>
      </div>

      {/* Winner modal */}
      {winnerIndex !== null && (
        <div className="fixed inset-0 flex h-full items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 w-80">
            <h2 className="text-xl font-bold text-green-700">🎉 Winner! 🎉</h2>
            <p className="text-lg font-semibold">
              {segments[winnerIndex].text ?? "No Name"}
            </p>
            {segments[winnerIndex].image && (
              <img
                src={segments[winnerIndex].image}
                alt="Winner"
                className="w-24 h-24 object-cover rounded-full border"
              />
            )}
            <button
              onClick={() => setWinnerIndex(null)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mute/Unmute */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-[100%] left-[-50%] w-full text-[25px]"
        aria-label={muted ? "Unmute" : "Mute"}
        title={muted ? "Unmute Click Sound" : "Mute Click Sound"}
      >
        {muted ? <GoMute /> : <GoUnmute />}
      </button>

      {/* Click sound */}
      <audio ref={clickSoundRef} src={clickSound} preload="auto" />
      <audio ref={confettiSoundRef} src={confettiSound} preload="auto" />
    </div>
  );
};

export default SpinningWheel;
