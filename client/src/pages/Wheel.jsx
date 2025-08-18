import { useEffect, useRef, useState } from "react";
import SpinningWheel from "./SpinningWheel";
import { RiFullscreenLine } from "react-icons/ri";
import { BsFullscreenExit, BsSortDownAlt } from "react-icons/bs";
import screenfull from "screenfull";
import { FaTrash, FaImage, FaCopy } from "react-icons/fa";
import { nanoid } from "nanoid";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { CiShuffle } from "react-icons/ci";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import './wheel.css'


// Sortable segment card
function SortableSegment({
  seg,
  index,
  updateSegment,
  handleImageUpload,
  duplicateSegment,
  removeSegment,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: seg.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {/* Text input */}
      <input
        type="text"
        placeholder="Enter text"
        value={seg.text}
        onChange={(e) => updateSegment(index, "text", e.target.value)}
        className="border border-gray-300 rounded-lg px-2 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      {/* Image upload */}
      <label className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
        <FaImage />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(index, e)}
          className="hidden"
        />
      </label>

      {/* Segment image */}
      {seg.image && (
        <img
          src={seg.image}
          alt="Segment"
          className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
        />
      )}

      {/* Show text checkbox */}
      <input
        type="checkbox"
        checked={seg.showText}
        onChange={(e) => updateSegment(index, "showText", e.target.checked)}
        className="w-5 h-5 accent-blue-500"
        title="Show Text"
      />

      {/* Duplicate & remove buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => duplicateSegment(index)}
          className="text-blue-500 hover:text-blue-600 transition"
          title="Duplicate"
        >
          <FaCopy />
        </button>
        <button
          onClick={() => removeSegment(index)}
          className="text-red-500 hover:text-red-600 transition"
          title="Remove"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default function Wheel() {
  const dummySegments = [
  { id: nanoid(), text: "Dummy 1", image: null, showText: true, dummy: true },
  { id: nanoid(), text: "Dummy 2", image: null, showText: true, dummy: true },
  { id: nanoid(), text: "Dummy 3", image: null, showText: true, dummy: true },
  { id: nanoid(), text: "Dummy 4", image: null, showText: true, dummy: true },
];
  const [segments, setSegments] = useState(dummySegments);

  const [fullScreen, setFullScreen] = useState(false);
  const [newText, setNewText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const wheelRef = useRef(null);

  useEffect(() => {
  if (segments.length === 0) {
    setSegments(dummySegments);
  }
}, [segments]);

  useEffect(() => {
    if (!screenfull.isEnabled) return;

    const handler = () => {
      setFullScreen(screenfull.isFullscreen);
    };

    screenfull.on("change", handler);

    return () => {
      screenfull.off("change", handler);
    };
  }, []);
  const toggleFullScreen = () => {
    if (screenfull.isEnabled && wheelRef.current) {
      screenfull.toggle(wheelRef.current);
    }
  };

  // Update individual segment
  const updateSegment = (index, field, value) => {
    const updated = [...segments];
    updated[index][field] = value;
    setSegments(updated);
  };

  // Upload image for an existing segment
  const handleSegmentImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateSegment(index, "image", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image for new segment
  const handleNewSegmentImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addNewSegment = () => {
    if (!newText.trim()) return;
    const newSeg = {
      id: nanoid(),
      text: newText,
      image: selectedImage,
      showText: true,
      dummy: false,
    };
    const newSegs = [...segments.filter((s) => !s.dummy), newSeg];
    setSegments(newSegs);
    setNewText("");
    setSelectedImage(null);
  };

  const removeSegment = (index) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const duplicateSegment = (index) => {
    const copy = { ...segments[index], id: nanoid(), dummy: false };
    setSegments([
      ...segments.slice(0, index + 1),
      copy,
      ...segments.slice(index + 1),
    ]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = segments.findIndex((s) => s.id === active.id);
    const newIndex = segments.findIndex((s) => s.id === over.id);

    setSegments((items) => arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="p-4 bg-gray-100 pb-12">
      <div className="absolute top-16 right-5 cursor-pointer text-xl z-20">
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </div>
      <div className="flex gap-6">
        {/* Wheel Left */}
        <div
          className={`flex-1 flex items-center justify-center bg-gray-100 w-full h-full transition-all duration-300`}
          style={{ marginRight: collapsed ? "-30%" : undefined }}
          ref={wheelRef} // Add a ref to target the wheel
        >
          <SpinningWheel segments={segments} isFullScreen={fullScreen} />
        </div>

        {/* Inputs Right */}
        <div
          className={`w-96 max-h-[500px] bg-white rounded-md p-4 mt-5 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-500 ease-in-out
  ${collapsed ? "w-0 p-0 opacity-0" : "opacity-100"}`}
        >
<div className="w-full flex gap-2 justify-end ">
            <div className="flex items-center border cursor-pointer border-gray-400 mb-2 rounded-lg px-5 py-0.5"
             onClick={() => {
              const sorted = [...segments].sort((a, b) =>
                a.text.localeCompare(b.text)
              );
              setSegments(sorted);
            }}
            >

          {/* Sort */}
          <BsSortDownAlt 
            className="text-xl mr-2 cursor-pointer"
          />
          <div className="text-xs ">sort</div>
          
            </div>

             <div className="flex items-center border cursor-pointer border-gray-400 mb-2 rounded-lg px-4 py-0.5"
             onClick={() => {
                const shuffled = [...segments].sort(() => Math.random() - 0.5);
                setSegments(shuffled);
              }}
             >
             <CiShuffle
              className="text-xl mr-2 cursor-pointer"
            />
            <div className="text-xs">Shuffle</div>
            </div>
</div>
           

          {/* Main input area */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            {/* Image button for new segment */}
            <label className="cursor-pointer flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-xl transition text-gray-600 hover:text-blue-500">
              <FaImage />
              <input
                type="file"
                accept="image/*"
                onChange={handleNewSegmentImageUpload}
                className="hidden"
              />
            </label>

            {/* Add button */}
            <button
              onClick={addNewSegment}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition"
              title="Add Segment"
            >
              +
            </button>
          </div>

          {/* List of segments */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={segments.filter((s) => !s.dummy).map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {segments
                  .filter((s) => !s.dummy)
                  .map((seg, i) => (
                    <SortableSegment
                      key={seg.id}
                      seg={seg}
                      index={i}
                      updateSegment={updateSegment}
                      handleImageUpload={handleSegmentImageUpload}
                      duplicateSegment={duplicateSegment}
                      removeSegment={removeSegment}
                    />
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      {/* Fullscreen button */}
      <div className="absolute top-[93%] right-5 text-[24px] cursor-pointer ">
        {fullScreen ? (
          <BsFullscreenExit onClick={toggleFullScreen} />
        ) : (
          <RiFullscreenLine onClick={toggleFullScreen} />
        )}
      </div>
    </div>
  );
}
