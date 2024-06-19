import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import InputCheckList from "@/components/ui/InputCheckList";
import getDosenByBidang from "@/apis/admin/datamaster/dosen/getDosenByBidang";
import getAllBidang from "@/apis/dosen/bidang/getAllBidang";
import getAllAkunDosen from "@/apis/admin/datamaster/dosen/getAllAkunDosen";
import Toast from "@/components/ui/Toast";
import getDosenPembimbingByBidang from "@/apis/admin/datamaster/dosen/getDosenPembimbingByBidang";
import getJabatanById from "@/apis/dosen/jabatan/getJabatanbyId";
import ajukanIde from "@/apis/mhs/TA/ajukanIde";
import { getDataFromToken } from "@/utils/getDataToken";

const jabatanRank = {
  "Asisten Ahli": 1,
  "Lektor": 2,
  "Lektor Kepala": 3,
  "Profesor": 4
};

export default function PengajuanIde() {
  const [ideTA, setIdeTA] = useState("");
  const [deskripsiIde, setDeskripsiIde] = useState("");
  const [bidangId, setBidangId] = useState("");
  const [bidangOptions, setBidangOptions] = useState([]);
  const [dosenOptions, setDosenOptions] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState([]);
  const [dosenPembimbingData, setDosenPembimbingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const userID = getDataFromToken()?.userId;

  useEffect(() => {
    const fetchBidangOptions = async () => {
      try {
        const response = await getAllBidang();
        if (response.success) {
          setBidangOptions(
            response.data.map((bidang) => ({
              value: bidang.bidangId,
              label: bidang.namaBidang,
            }))
          );
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data bidang");
        console.error("Fetch error:", error);
      }
    };

    fetchBidangOptions();
  }, []);

  useEffect(() => {
    const fetchDosenOptions = async () => {
      if (bidangId) {
        try {
          const response = await getDosenByBidang(bidangId);
          if (response?.success) {
            setDosenOptions(
              response?.data.map((dosen) => ({
                value: dosen.idDosen,
                name: dosen.nama,
                jabatanId: dosen.jabatanId,
              }))
            );

            const pembimbingResponse = await getDosenPembimbingByBidang(
              bidangId
            );
            console.log(pembimbingResponse);
            if (pembimbingResponse?.success) {
              setDosenPembimbingData(pembimbingResponse.data);
            } else {
              setDosenPembimbingData([]);
              setError(pembimbingResponse.message);
            }
          } else {
            setError(response.message);
            setDosenOptions([]);
          }
        } catch (error) {
          setError("Terjadi kesalahan saat mengambil data dosen by bidang");
          console.error("Fetch error:", error);
        }
      } else {
        try {
          const response = await getAllAkunDosen();
          if (response?.success) {
            setDosenOptions(
              response?.data.map((dosen) => ({
                value: dosen.idDosen,
                name: dosen.nama,
                jabatanId: dosen.jabatanId,
              }))
            );
          } else {
            setError(response.message);
          }
        } catch (error) {
          setError("Terjadi kesalahan saat mengambil data semua dosen");
          console.error("Fetch error:", error);
        }
      }
    };

    fetchDosenOptions();
  }, [bidangId]);

  const handleSelectBidang = (e) => {
    setBidangId(e.target.value);
  };

  const handleSelectDosen = (selectedDosen) => {
    setSelectedDosen((prev) => {
      console.log(prev, selectedDosen);
      if (prev.includes(selectedDosen.value)) {
        return prev.filter((dosen) => dosen !== selectedDosen.value);
      } else {
        return [...prev, selectedDosen.value];
      }
    });
  };

  const determinePembimbingType = async (dosenList) => {
    const pembimbingData = dosenPembimbingData.filter((pembimbing) =>
      dosenList.some((dosen) => dosen.value === pembimbing.Dosen.idDosen)
    );
    const uniqueDosenIds = [ ...new Set(pembimbingData.map((pembimbing) => pembimbing.Dosen.idDosen)),  ];

    const getRank = async (jabatanId, idDosen,pembimbingId) => {
      const jabatanResponse = await getJabatanById(jabatanId);
      const jabatanName = jabatanResponse.data?.namaJabatan;
      return {
        idDosen,
        jabatanId,
        rank: jabatanRank[jabatanName],
      };
    };

    if (uniqueDosenIds.length === 1) {
      const singleDosen = pembimbingData.find(
        (pembimbing) => pembimbing.Dosen.idDosen === uniqueDosenIds[0]
      );
      return [
        { idDosen: singleDosen.id, jabatanId: singleDosen.Dosen.jabatanId },
      ];
    } else if (uniqueDosenIds.length === 2) {
      const dosenMatch = pembimbingData.find(
        (pembimbing) => pembimbing.Dosen.idDosen === uniqueDosenIds[0]
      );
      const dosenMatch2 = pembimbingData.find(
        (pembimbing) => pembimbing.Dosen.idDosen === uniqueDosenIds[1]
      );
      console.log(dosenMatch, dosenMatch2);
      const rank1 = await getRank(
        dosenMatch.Dosen.jabatanId,
        dosenMatch.Dosen.idDosen
      );
      const rank2 = await getRank(
        dosenMatch2.Dosen.jabatanId,
        dosenMatch2.Dosen.idDosen
      );


      if (rank1.rank > rank2.rank) {
        return [
          { idDosen: rank1.idDosen, jabatanId: rank1.jabatanId, tipePembimbing: "utama"},
          { idDosen: rank2.idDosen, jabatanId: rank2.jabatanId , tipePembimbing: "asisten" },
        ];
      } else {
        return [
          { idDosen: rank1.idDosen, jabatanId: rank1.jabatanId , tipePembimbing: "asisten"},
          { idDosen: rank2.idDosen, jabatanId: rank2.jabatanId, tipePembimbing: "utama"},
        ];
      }
    }
    return dosenList.map(dosen => ({ idDosen: dosen.value }));
  };

  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const selectedDosenData = dosenOptions.filter((dosen) =>selectedDosen.includes(dosen.value));
    const pembimbingList = await determinePembimbingType(selectedDosenData);

    try {
      const response = await ajukanIde({
        idMahasiswa: userID,
        ideTA,
        deskripsiIde,
        bidangId,
        dosenPembimbingIDs: pembimbingList.map((dosen) => ({
          dosenPembimbingID: dosen.value,
        })),
      });

      if (response.success) {
        setSuccess("Ide TA berhasil diajukan!");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Gagal mengajukan ide TA. Silakan coba lagi.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 className="font-bold text-2xl mb-6">Pengajuan Ide</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <TextArea
            label="Ide Tugas Akhir"
            placeholder="Ide Tugas Akhir"
            value={ideTA}
            onChange={(e) => setIdeTA(e.target.value)}
          />
          <p className="text-sm mt-2 text-neutral-500">
            Belum memiliki ide TA?{" "}
            <Link
              className="font-semibold text-ijau-300"
              to="/mhs/ajukanJadwalKonsultasi"
            >
              Disini
            </Link>
          </p>
        </div>
        <TextArea
          label="Deskripsi Judul"
          placeholder="Deskripsi Judul"
          value={deskripsiIde}
          onChange={(e) => setDeskripsiIde(e.target.value)}
        />
        <Select
          label="Bidang Peminatan"
          options={bidangOptions}
          value={bidangId}
          onChange={handleSelectBidang}
        />
        {dosenOptions.length > 0 && (
          <>
            <InputCheckList
              label="Calon Dosen Pembimbing"
              items={dosenOptions}
              selectedItems={selectedDosen}
              onSelect={handleSelectDosen}
            />
            <p className="text-sm text-neutral-500">
              Pilih minimal 1 maksimal 2
            </p>
          </>
        )}

        <div className="flex justify-end">
          <Button custom="mt-8" type="submit" disabled={loading}>
            {loading ? "Mengajukan..." : "Ajukan Ide"}
          </Button>
        </div>
      </form>
      {error && (
        <Toast
          message={error}
          isVisible={!!error}
          onClose={() => setError(null)}
          isSuccess={false}
        />
      )}
      {success && (
        <Toast
          message={success}
          isVisible={!!success}
          onClose={() => setSuccess(null)}
          isSuccess={true}
        />
      )}
    </section>
  );
}
