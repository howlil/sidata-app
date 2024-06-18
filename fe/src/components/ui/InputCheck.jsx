const InputCheckList = ({ label, items, onSelect }) => {
  return (
    <section>
      <label className="mb-1 text-md font-medium text-gray-700">
        {label}
      </label>
      {items?.map((item, index) => (
        <div key={index} className="flex items-center border-neutral-800 border py-3 px-4 rounded-lg my-2">
          <input
            type="checkbox"
            className="mr-2"
            onChange={() => onSelect(item)}
          />
          <span>{item.name}</span>
          <span className="ml-auto">{item.details}</span>
        </div>
      ))}
    </section>
  );
};

export default InputCheckList;