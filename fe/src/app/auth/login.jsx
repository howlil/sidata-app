import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { jwtDecode } from 'jwt-decode'
import LoginAkun from "@/apis/api/loginAkun";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    isSuccess: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await LoginAkun(form);
      if (!response) {
        throw new Error("Invalid response from loginAkun");
      }

      setToast({
        isVisible: true,
        isSuccess: response.success,
        message: response.message,
      });

      if (response.success && response.token) {
        const decodedToken = jwtDecode(response.token);
        if (decodedToken && decodedToken.role) {
          if (decodedToken.role === "admin") {
            navigate("/admin/dashboard");
          } else if (decodedToken.role === "mahasiswa") {
            navigate("/mhs/dashboard");
          } else if (decodedToken.role === "dosen") {
            navigate("/dosen/dashboard");
          } else {
            throw new Error("Invalid role in token");
          }
        } else {
          throw new Error("Failed to decode token or role is missing");
        }
      }
    } catch (error) {
      console.error(error);
      setToast({
        isVisible: true,
        isSuccess: false,
        message: error.message || "Login failed. Please try again.",
      });
    }
  };

  const handleInputChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        label="Email"
        placeholder="@example.ac.id"
        value={form.email}
        onChange={handleInputChange("email")}
      />
      <Input
        type="password"
        label="Kata Sandi"
        placeholder="*********"
        value={form.password}
        onChange={handleInputChange("password")}
      />

      <Button variant="default" type="submit">
        Login
      </Button>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        isSuccess={toast.isSuccess}
        onClose={hideToast}
      />
    </form>
  );
}
