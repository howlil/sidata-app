
const ajukanBimbingan = async (
    idMahasiswa,
    dosPembimbingId,
    kendala,
    progresTA,
    tanggal,
    waktuMulai,
    waktuSelesai
) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer"+ localStorage.getItem("token"));


const raw = JSON.stringify({
  idMahasiswa,
  dosPembimbingId,
  kendala,
  progresTA,
  tanggal,
  waktuMulai,
  waktuSelesai
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

const url = `${import.meta.env.VITE_API_BASE_URL}/ajukanBimbinganTA`;
fetch(url, requestOptions)
  .then((response) => response.json())
  .then((result) => {return result})
  .catch((error) => console.error(error));     
  
}

export default ajukanBimbingan
