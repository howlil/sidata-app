const ajukanKonsultasi = async (
  idMahasiswa,
  kendala,
  tanggal,
  waktuMulai,
  waktuSelesai,
  adminId
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  const raw = JSON.stringify({
    idMahasiswa,
    kendala,
    tanggal,
    waktuMulai,
    waktuSelesai,
    adminId,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/ajukanKonsultasiKaprodi`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};

export default ajukanKonsultasi;
