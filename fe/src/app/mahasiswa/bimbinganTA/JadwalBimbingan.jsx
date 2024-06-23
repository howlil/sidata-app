import "rsuite/Calendar/styles/index.css";
import "rsuite/Badge/styles/index.css";
import { Calendar, Whisper, Popover, Badge } from "rsuite";
import { useEffect, useState, useCallback } from "react";
import getRiwayatBimbinganTA from "@/apis/mhs/bimbingan/getRiwayatBimbinganTA";

export default function JadwalBimbingan() {
  const [jadwalKonsul, setJadwalKonsul] = useState([]);
  const [todoListCache, setTodoListCache] = useState({});

  useEffect(() => {
    async function fetchData() {
      const result = await getRiwayatBimbinganTA();
      if (result.success) {
        setJadwalKonsul(result.data);
      } else {
        console.error("Gagal mengambil data jadwal konsultasi");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const cache = {};
    jadwalKonsul.forEach((jadwal) => {
      const jadwalDate = new Date(jadwal.tanggal);
      const key = `${jadwalDate.getFullYear()}-${
        jadwalDate.getMonth() + 1
      }-${jadwalDate.getDate()}`;
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(jadwal);
    });
    setTodoListCache(cache);
  }, [jadwalKonsul]);

  const getTodoList = useCallback(
    (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${year}-${month}-${day}`;
      return todoListCache[key] || [];
    },
    [todoListCache]
  );

  const renderCell = useCallback(
    (date) => {
      const list = getTodoList(date);
      const displayList = list.filter((item, index) => index < 2);

      if (list.length) {
        const moreCount = list.length - displayList.length;
        const moreItem = (
          <li key="more">
            <Whisper
              placement="top"
              trigger="click"
              speaker={
                <Popover>
                  {list.map((item, index) => (
                    <p className="bg-green-100" key={index}>
                      {item.kendala}
                    </p>
                  ))}
                </Popover>
              }
            >
              <a>{moreCount} more</a>
            </Whisper>
          </li>
        );

        return (
          <ul className="calendar-todo-list ">
          {displayList.map((item, index) => {
            const { status } = item;
            const badgeColor =
              status === "selesai"
                ? "green"
                : status === "diproses"
                ? "yellow"
                : "red";
            const bgColor =
              status === "selesai"
                ? "bg-green-100"
                : status === "diproses"
                ? "bg-yellow-100"
                : "bg-red-100";
            return (
              <li key={index}>
                <Badge style={{ backgroundColor: badgeColor }} />{" "}
                <p className={bgColor}>
                   {status}
                </p>
              </li>
            );
          })}
          {moreCount ? moreItem : null}
        </ul>
        );
      }

      return null;
    },
    [getTodoList]
  );

  return (
    <div>
      <section >
          <Calendar bordered compact renderCell={renderCell} />
      </section>
    </div>
  );
}
