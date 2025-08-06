import React, { useState } from "react";

const NativeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmit , setIsSubmit] = useState(false)

  const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSubmit(true)
      await new Promise(reslove =>setTimeout(reslove, 2000));
      console.log("form submitted :" , formData);
      setIsSubmit(false)
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4   py-10 bg-gray-200 p-4 rounded"
      >
        <div>
          <label className=" text-sm mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e)=>setFormData({
                ...formData, name:e.target.value
            })}
            placeholder="Enter your name"
            className="outline-none p-2 rounded bg-white text-sm w-full"
          />
        </div>
        <div>
          <label className="  text-sm mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e)=>setFormData({
                ...formData , email:e.target.value
            })}
            placeholder="Enter your email"
            className="outline-none p-2 rounded bg-white text-sm w-full"
          />
        </div>
        <button
          type="submit"
          className=" px-4 py-2  mt-2 rounded-sm text-white text-sm cursor-pointer hover:bg-blue-800 bg-blue-600 "
        >
          {isSubmit ? 'submiting...' : 'submit'}
        </button>
      </form>
    </div>
  );
};

export default NativeForm;
