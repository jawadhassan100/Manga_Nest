import { useState } from "react";
import SpinningWheel from "./SpinningWheel";
import screenfull from 'screenfull';
import { RiFullscreenLine } from "react-icons/ri";
import { BsFullscreenExit } from "react-icons/bs";



const Wheel = () => {
  const [segments, setSegments] = useState(
    Array.from({ length: 4 }, (_, i) => `Prize ${i + 1}`)
  );
  const [input, setInput] = useState("");
  const [fullScreen, setFullScreen] = useState(false);

   const toggleFullScreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle();
    setFullScreen(true);
  }
};

  const addSegment = () => {
    if (input.trim()) {
      setSegments([...segments, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🎡 Spinning Wheel</h1>
      {/* <div><iframe src="https://pickerwheel.com/emb/?choices=Jan,Feb,Mar,Apr" width="100%" height="550px" scrolling="no" frameborder="0"></iframe></div> */}
      <div className="flex justify-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new segment"
          className="border p-2"
        />
        <button
          onClick={addSegment}
          className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <SpinningWheel segments={segments} />
      <div className=" flex justify-end text-[30px] cursor-pointer">
        {fullScreen ? (
          <BsFullscreenExit onClick={() => {
            toggleFullScreen();
            setFullScreen(false);
          }} />
        ):(<RiFullscreenLine  onClick={toggleFullScreen}/>)}
        
        </div>
    </div>
  );
};

export default Wheel;
