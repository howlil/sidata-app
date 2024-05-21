import Avatar from "../ui/Avatar";
import ProfileModal from "../modal/ProfilModal";
import { useState } from "react";
export default function NavbarIndex() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="">
      <Avatar onClick={handleAvatarClick} />
      <ProfileModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
