const Select = ({ label, options, onChange, value }) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 text-lg font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="px-3 py-2 text-gray-700 border-neutral-400 rounded-lg border"
      >
        <option value="">Select</option>
        {options?.map((option, index) => (
          <option className="text-black" key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;