import React from 'react';
import { getDataFromToken } from '@/utils/getDataToken';

const ProfileModal = ({ isOpen, onClose }) => {
  const role = getDataFromToken()?.role;
  let links = [
    { href: '/infoProfil', text: 'Info User' },
    { href: '/ubahSandi', text: 'Ubah Password' },
    { href: '/sidatabot', text: 'SIDATA BOT', roles: ['mahasiswa'] },
    {
      text: 'Logout',
      onClick: () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    },
  ];

  links = links.filter(link => !link.roles || link.roles.includes(role));

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-8 flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-sm w-full z-50">
        <div className=" sm:p-3">
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                {link.href ? (
                  <a
                    href={link.href}
                    className="block px-4 py-2 rounded-md text-gray-800 hover:bg-ijau-100"
                  >
                    {link.text}
                  </a>
                ) : (
                  <button
                    onClick={link.onClick}
                    className="block w-full rounded-md text-left px-4 py-2 text-gray-800 hover:bg-ijau-100"
                  >
                    {link.text}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;