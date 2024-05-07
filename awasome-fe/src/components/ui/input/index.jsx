export default function Input({ label, type, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-y-2 ">
      <label className="font-medium  text-base" htmlFor="">
        {label}
      </label>
      <input
        className="border rounded-md w-full py-2 px-3 text-sm border-neutral-600"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}
