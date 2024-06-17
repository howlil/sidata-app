export default function TextArea({ label, customLabel, name, value, placeholder, onChange }) {
    return (
        <div className="flex flex-col gap-y-1 ">
            <label className={`font-normal ${customLabel}`}>
                {label}
            </label>
            <textarea
                className="w-full h-32 px-3 py-2 text-sm text-gray-700 border border-neutral-800 rounded-lg focus:outline-none focus:shadow-outline resize-none"
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    );
}