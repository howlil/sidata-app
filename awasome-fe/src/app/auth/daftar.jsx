import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import daftarAkun from './api/daftarAkun';

export default function Daftar() {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    isSuccess: true,
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await daftarAkun(form);
      if (!response) {
        throw new Error('Invalid response from daftarAkun');
      }
      setToast({
        isVisible: true,
        isSuccess: true,
        message: response.message,
      });
      // setForm({
      //   nama: '',
      //   email: '',
      //   password: '',
      // });
      // navigate('/login');
    } catch (error) {
      console.error(error);
      setToast({
        isVisible: true,
        isSuccess: false,
        message: error.message || 'Failed to register.',
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
        label="Nama Lengkap"
        placeholder="Inputkan Nama Lengkap"
        value={form.nama}
        onChange={handleInputChange('nama')}
      />
      <Input
        type="text"
        label="Email"
        placeholder="Inputkan Email"
        value={form.email}
        onChange={handleInputChange('email')}
      />
      <Input
        type="password"
        label="Kata Sandi"
        placeholder="*********"
        value={form.password}
        onChange={handleInputChange('password')}
      />
      <p className="text-sm text-neutral-400">
        Sudah memiliki akun?
        <Link to="/login" className="text-ijau-100 ml-1 underline">
          Login disini
        </Link>
      </p>
      <Button variant="default" type="submit">
        Daftar
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
