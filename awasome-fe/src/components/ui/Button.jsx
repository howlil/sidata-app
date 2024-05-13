const Button = ({ children, variant, ...props }) => {
  const variantClasses = {
    primary: "bg-ijau-100 text-neutral-900 font-semibold active:scale-105 ts",
    secondary: "bg-gray-500 text-white hover:bg-gray-700",
    danger: "bg-red-500 text-white hover:bg-red-700",
  };

  const buttonClasses = `px-4 py-2 rounded ${
    variantClasses[variant] || variantClasses.primary
  }`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
