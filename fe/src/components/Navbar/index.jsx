import Avatar from "../ui/Avatar";
import ProfileModal from "../modal/ProfilModal";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

function getLocalStorage(key) {
  try {
    const item = window.localStorage.getItem(key);
    return item
  } catch (error) {
    console.error("Error reading from local storage", error);
    return null;
  }
}
export default function NavbarIndex() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', role: '' });

  const handleAvatarClick = () => {
    setIsModalOpen(!isModalOpen);
  };
useEffect(() => {
    const token = getLocalStorage("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserDetails({ name: decoded.name, role: decoded.role });
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex gap-4">
      <section className="text-end border-r-2 mr-3 pr-6">
        <h1 className="font-semibold text-xl">{userDetails.name}</h1>
        <p className="text-neutral-500">{userDetails.role}</p>
      </section>
      <Avatar onClick={handleAvatarClick} />
      <ProfileModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
