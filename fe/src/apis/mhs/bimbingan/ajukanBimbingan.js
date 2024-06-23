export default async function ajukanBimbingan(
  idMahasiswa,
  dosPembimbingId,
  kendala,
  progresTA,
  tanggal,
  waktuMulai,
  waktuSelesai
) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    idMahasiswa,
    dosPembimbingId,
    kendala,
    progresTA,
    tanggal,
    waktuMulai,
    waktuSelesai,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/ajukanBimbinganTA`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
