const InputCheck = ({ label, item, onSelect }) => {
  return (
    <section>
      <label className="mb-1 text-md font-semibold text-gray-700">
        {label}
      </label>{" "}
      <div className="flex items-center border-neutral-800 border py-3 px-4 rounded-lg">
        <input
          type="checkbox"
          className="mr-2"
          onChange={() => onSelect(item)}
        />
        <span>{item.name}</span>
        <span className="ml-auto">{item.details}</span>
      </div>
    </section>
  );
};

export default InputCheck;
