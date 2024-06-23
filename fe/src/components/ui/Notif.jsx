import { Bell } from "lucide-react";

export default function Notif({ text }) {
  return (
    <p className=" flex  gap-4 justify-center w-full p-4 bg-ijau-500 text-neutral-800 font-semibold bg-opacity-50 rounded-md">
      <Bell />
      {text}
    </p>
  );
}