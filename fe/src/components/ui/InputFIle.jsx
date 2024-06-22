import { useRef, useState } from "react";

const InputFile = ({ label, onChange, placeholder }) => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileList = event.target.files;
    if (fileList.length > 0) {
      const selectedFile = fileList[0];
      setFileName(selectedFile.name);
      onChange(selectedFile); 
    }
  };

  return (
    <div className="mb-2">
      <label htmlFor="file" className="block text-md font-normal text-neutral-800">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type="file"
          id="file"
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          ref={inputRef}
          onChange={handleFileChange}
          accept=".pdf"
          required
        />
        <input
          className={`pl-32 w-full px-3 py-2 border border-neutral-600 rounded-md shadow-sm focus:outline-none   sm:text-md ${
            fileName ? "text-black" : "text-gray-400"
          }`}
          placeholder={placeholder}
          value={fileName}
          readOnly
        />
        <button
          type="button"
          className="absolute inset-y-0 left-0 flex items-center px-4 py-2 bg-ijau-200 ts hover:bg-ijau-300 rounded-l-md text-neutral-100 font-medium focus:outline-none "
          onClick={handleButtonClick}
        >
          Choose File
        </button>
      </div>
    </div>
  );
};

export default InputFile;
