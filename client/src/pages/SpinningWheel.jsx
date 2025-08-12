import { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import clickSound from "../assets/click.wav"; 
import { GoUnmute } from "react-icons/go";
import { GoMute } from "react-icons/go";

const SpinningWheel = ({ segments }) => {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [wheelBg, setWheelBg] = useState(null);
  const [spinBtnBg, setSpinBtnBg] = useState(null);
  const [segmentImages, setSegmentImages] = useState({});
    const [muted, setMuted] = useState(false); 

  const canvasRef = useRef(null);
  const clickSoundRef = useRef(null);
  const lastSegmentRef = useRef(null);

  const radius = 200;
  const center = radius;
  const segmentAngle = 360 / segments.length;
  const pointerAngleDeg = 270; // Pointer at top

  // Helper: Load image from src and return Promise<Image>
  const loadImage = (src) =>
    new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });

  // Draw the wheel on canvas
  const drawWheel = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((angle * Math.PI) / 180);

    const wheelBgImg = await loadImage(wheelBg);

    if (wheelBgImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(wheelBgImg, -radius, -radius, radius * 2, radius * 2);
      ctx.restore();
    }

    for (let i = 0; i < segments.length; i++) {
      const start = (i * segmentAngle * Math.PI) / 180;
      const end = ((i + 1) * segmentAngle * Math.PI) / 180;

      if (!wheelBgImg) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = `hsl(${(i * 360) / segments.length}, 80%, 60%)`;
        ctx.fill();
      }

    if (segmentImages[i]) {
      const segImg = await loadImage(segmentImages[i]);
      if (segImg) {
        ctx.save();
        const midAngle = start + (end - start) / 2;
        const imgDistanceFromCenter = radius * 0.6;
        const imgSize = 80;

        ctx.translate(
          Math.cos(midAngle) * imgDistanceFromCenter,
          Math.sin(midAngle) * imgDistanceFromCenter
        );
        ctx.rotate(-midAngle); 
        ctx.beginPath();
        ctx.arc(0, 0, imgSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip(); 
        ctx.drawImage(segImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore(); 
      }
    }

    // Draw segment text
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textAngle = start + (end - start) / 2;
    const textRadius = radius * 0.65; // Text position from center
    ctx.translate(
      Math.cos(textAngle) * textRadius,
      Math.sin(textAngle) * textRadius
    );
    ctx.rotate(textAngle); 
    ctx.fillText(segments[i].option ?? segments[i], 0, 0);
    ctx.restore(); 
  }

  ctx.restore();
  };

  useEffect(() => {
    drawWheel();
  }, [angle, wheelBg, segmentImages, segments]);

  const spinWheel = () => {
    if (spinning) return;
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

      // Calculate current segment index for clicking sound
      const normalizedAngle = currentAngle % 360;
      const pointerAngle = (360 + pointerAngleDeg - normalizedAngle) % 360;
      const currentSegmentIndex = Math.floor(pointerAngle / segmentAngle) % segments.length;

      // Play click if moved to new segment
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

        // Confetti burst
        confetti({
          particleCount: 600,
          spread: 300,
          origin: { y: 0.6 },
        });
      }
    };

    requestAnimationFrame(animate);
  };

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center relative space-y-4">
     
      {/* Upload Controls */}
      <div className="flex flex-wrap pb-10 gap-2">
        <label className="text-sm">
          Wheel BG:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, setWheelBg)}
          />
        </label>
        <label className="text-sm">
          Spin Btn BG:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, setSpinBtnBg)}
          />
        </label>
        <label className="text-sm">
          Segment 0 Img:
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileUpload(e, (img) =>
                setSegmentImages((prev) => ({ ...prev, 0: img }))
              )
            }
          />
        </label>
      </div>

      {/* Pointer */}
      <div
        className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[24px] border-transparent border-l-red-500 rotate-180"
        style={{
          position: "absolute",
          top: "40px",
          left: "48.2%",
          transform: "translateX(-50%) rotate(270deg)",
          zIndex: 10,
        }}
      ></div>

      {/* Canvas Wheel */}
      <div
        className="relative"
        style={{ width: 2 * radius, height: 2 * radius }}
      >
        <canvas
          ref={canvasRef}
          width={2 * radius}
          height={2 * radius}
          style={{ borderRadius: "50%" }}
        ></canvas>

        {/* Spin Button */}
        <button
          className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full shadow-md flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            background: spinBtnBg
              ? `url(${spinBtnBg}) center/cover no-repeat`
              : "black",
            color: spinBtnBg ? "transparent" : "white",
          }}
          onClick={spinWheel}
          disabled={spinning}
        >
          {spinning ? "" : !spinBtnBg && "Spin"}
        </button>
      </div>

      {/* Winner */}
      {winnerIndex !== null && (
        <div className="mt-3 text-lg font-semibold text-green-700">
          🎉 You got:{" "}
          <span className="underline">
            {segments[winnerIndex].option ?? segments[winnerIndex]}
          </span>
        </div>
      )}

 <button
        onClick={() => setMuted(!muted)}
        className="mb-2 p-2  w-full text-[25px]"
        aria-label={muted ? "Unmute" : "Mute"}
        title={muted ? "Unmute Click Sound" : "Mute Click Sound"}
      >
        {muted ?  <GoMute /> : <GoUnmute />}
      </button>

      {/* Click sound audio element */}
      <audio
        ref={clickSoundRef}
        src={clickSound}
        preload="auto"   
      />
    </div>
  );
};

export default SpinningWheel;
