export default function Button({ children, variant , custom = '', onClick }) {
  const variantClasses = {
    primary: "bg-ijau-100 text-neutral-900 text-base text-neutral-800 font-normal active:scale-105 ts",
    secondary: "bg-gray-500 text-white hover:bg-gray-700",
    danger: "bg-red-500 text-white hover:bg-red-700",
  };

  const buttonClasses = `px-6 py-2 rounded ${
    variantClasses[variant] || variantClasses.primary
  }`;

  return (
    <button onClick={onClick} className={`${buttonClasses} ${custom}`}>
      {children}
    </button>
  );
};

