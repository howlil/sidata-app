import { useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

function Toast({ message, isVisible, onClose, isSuccess }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styleConfig = {
    success: {
      backgroundColor: "#DCF8C6",
      textColor: "#34D399",
      icon: <CheckCircle size={20} color="#34D399" />,
    },
    error: {
      backgroundColor: "#FECACA",
      textColor: "#CB3A30",
      icon: <XCircle size={20} color="#CB3A30" />,
    },
  };

  const currentStyle = isSuccess ? styleConfig.success : styleConfig.error;

  return (
    <div className="fixed top-0 right-2 m-6 z-50">
      <div
        className="bg-white shadow-lg flex items-center gap-3 p-4 rounded-md"
        style={{
          backgroundColor: currentStyle.backgroundColor,
          color: currentStyle.textColor,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {message}
        {currentStyle.icon}
      </div>
    </div>
  );
}

export default Toast;
