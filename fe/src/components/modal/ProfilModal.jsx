const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed  top-12 right-8 flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-sm w-full z-50">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Profile Options
          </h3>
          <ul className="mt-5">
            <li>
              <a
                href="/infoProfil"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Info User
              </a>
            </li>
            <li>
              <a
                href="/ubahSandi"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Ubah Password
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
