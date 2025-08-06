// import React, { useState } from "react";
// import SpinningWheel from "./SpinningWheel";



// const Wheel = () => {
//  const [segments, setSegments] = useState([
//   { option: "Prize 1", image: "", showText: true },
//   { option: "Prize 2", image: "", showText: true }
// ]);
// const [input, setInput] = useState("");
// const [imageURL, setImageURL] = useState("");
// const [showText, setShowText] = useState(true);

// const addSegment = () => {
//   if (input.trim() || imageURL.trim()) {
//     setSegments([
//       ...segments,
//       {
//         option: input.trim(),
//         image: imageURL.trim(),
//         showText
//       }
//     ]);
//     setInput("");
//     setImageURL("");
//     setShowText(true);
//   }
// };

// return (
//     <div className="p-4 text-center">
//         <h1 className="text-2xl font-bold mb-4">🎡 Spinning Wheel</h1>
//         <div className="flex flex-col items-center gap-2 mb-4">
//             <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Enter segment text"
//                 className="border p-2 w-64"
//             />
//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                         const reader = new FileReader();
//                         reader.onloadend = () => {
//                             setImageURL(reader.result);
//                         };
//                         reader.readAsDataURL(file);
//                     } else {
//                         setImageURL("");
//                     }
//                 }}
//                 className="border p-2 w-64"
//             />
//             <label className="flex items-center gap-2">
//                 <input
//                     type="checkbox"
//                     checked={showText}
//                     onChange={() => setShowText(!showText)}
//                 />
//                 Show Text
//             </label>
//             <button
//                 onClick={addSegment}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//                 Add Segment
//             </button>
//         </div>

//         <SpinningWheel segments={segments} />
//     </div>
// );
// };

// export default Wheel;
import React, { useState } from "react";
import SpinningWheel from "./SpinningWheel";

const Wheel = () => {
  const [segments, setSegments] = useState([ "Prize 1", "Prize 2", "Prize 3", "Prize 4", 
    ]);
  const [input, setInput] = useState("");

  const addSegment = () => {
    if (input.trim()) {
      setSegments([...segments, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🎡 Spinning Wheel</h1>
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
    </div>
  );
};

export default Wheel;
