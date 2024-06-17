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
    <div className="flex gap-4">
      <section className="text-end border-r-2 mr-3 pr-6">
        <h1 className="font-semibold text-xl">Mhd Ulii Abshar</h1>
        <p className="text-neutral-500">Mahsiswa</p>
      </section>
      <Avatar onClick={handleAvatarClick} />
      <ProfileModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
