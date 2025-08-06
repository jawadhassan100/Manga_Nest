import React, { useState } from "react";
import NativeForm from "./NativeForm";
import DigitalSignature from "./DigitalSignature";

const Tabs = () => {
  const [tab, setTab] = useState("tab1");

  return (
    <div className="h-screen bg-white">
    <div className="flex bg-white justify-center gap-10 items-center flex-col">
      <div className=" w-fit flex gap-5 border-b-2 border-gray-300 mt-10 mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium 
                ${
                  tab === "tab1"
                    ? "bg-blue-400 text-white border-gray-300"
                    : "bg-gray-100 text-gray-500"
                }`}
          onClick={() => {
            setTab("tab1");
          }}
        >
          tab1
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium 
                ${
                  tab === "tab2"
                    ? "bg-blue-400 text-white border-gray-300"
                    : "bg-gray-100 text-gray-500"
                }`}
          onClick={() => {
            setTab("tab2");
          }}
        >
          tab2
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium 
                ${
                  tab === "tab3"
                    ? "bg-blue-400 text-white border-gray-300"
                    : "bg-gray-100 text-gray-500"
                }`}
          onClick={() => {
            setTab("tab3");
          }}
        >
          tab3
        </button>
      </div>

      <div className="p-4   border-gray-300 rounded-b">
        {tab === "tab1" && <div>Content for Tab 1</div>}
        {tab === "tab2" && <div className=""><NativeForm/></div>}
        {tab === "tab3" && <div><DigitalSignature/></div>}
      </div>
    </div>
    </div>
  );
};

export default Tabs;
