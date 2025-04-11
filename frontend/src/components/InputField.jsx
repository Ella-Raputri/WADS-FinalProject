import React from 'react'

const InputField = ({ id, type = "text", value, onChange, placeholder }) => (
    <div className="relative">
      <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">
        {id === "fullName" ? "Full Name" :
        id === "mandarinName" ? "Mandarin Name" :
        id.charAt(0).toUpperCase() + id.slice(1)}
      </p>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="font-poppins w-full bg-white placeholder:text-slate-400 active:bg-white text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
      />
    </div>
  );

export default InputField