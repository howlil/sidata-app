import { useState } from 'react';
import a from '/public/loga.svg';
import b from '/public/logb.svg';
import logo from '/public/logosidata.svg';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import ubahPassword from './api/ubahPassword';

export default function UbahSandi() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    isSuccess: true,
  });

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await ubahPassword({ email, oldPassword, newPassword });
      if (response.success) {
        setToast({ isVisible: true, message: 'Password updated successfully!', isSuccess: true });
        setEmail('');
        setOldPassword('');
        setNewPassword('');
      } else {
        throw new Error(response.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error(error);
      setToast({ isVisible: true, message: error.message, isSuccess: false });
    }
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="bg-ijau-100 h-screen flex items-center justify-center overflow-hidden">
      <img src={a} alt="Logo A" className="absolute left-0 top-0 w-8/12" />
      <img src={b} alt="Background B" className="absolute w-full right-0 bottom-0" />
      <section className="bg-white z-50 shadow-sm rounded-md relative w-1/3 px-8 py-12">
        <div className="flex justify-center">
          <img src={logo} alt="Logo Sidata" />
        </div>
        <div className="my-3">
          <h3 className="mt-8 font-semibold text-xl">Ubah Sandi</h3>
          <hr className="w-1/6 border-b-4 border-ijau-100" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            label="Email"
            placeholder="@example.ac.id"
            value={email}
            onChange={handleInputChange(setEmail)}
          />
          <Input
            type="password"
            label="Password Lama"
            placeholder="******"
            value={oldPassword}
            onChange={handleInputChange(setOldPassword)}
          />
          <Input
            type="password"
            label="Password Baru"
            placeholder="******"
            value={newPassword}
            onChange={handleInputChange(setNewPassword)}
          />
          <Button variant="default" type="submit">Ubah Sandi</Button>
        </form>
        {toast.isVisible && (
          <Toast
            message={toast.message}
            isVisible={toast.isVisible}
            isSuccess={toast.isSuccess}
            onClose={hideToast}
          />
        )}
      </section>
    </div>
  );
}
