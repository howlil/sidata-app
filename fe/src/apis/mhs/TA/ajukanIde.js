export default async function ajukanIde({ idMahasiswa, ideTA, deskripsiIde, bidangId, dosenPembimbingIDs }) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  const raw = JSON.stringify({
    idMahasiswa,
    ideTA,
    deskripsiIde,
    bidangId,
    dosenPembimbingIDs 
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/ajukanIdeTA`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
