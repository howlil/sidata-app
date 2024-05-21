import { useState, useEffect } from "react";
import { User } from "lucide-react";
import infoProfil from "@/apis/profile/infoProfil";

const Avatar = ({ onClick }) => {
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await infoProfil();
        if (response.data && response.data.foto) {
          setFoto(response.data.foto);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      onClick={onClick}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      {foto ? (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/fotoUser/${foto}`}
          alt="User Avatar"
          className="rounded-full w-10 border-2"
        />
      ) : (
        <User style={{ width: 24, height: 24 }} />
      )}
    </div>
  );
};

export default Avatar;
