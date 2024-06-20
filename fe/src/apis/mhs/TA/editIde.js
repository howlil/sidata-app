export default async function editAjukanIdeTA({ idMahasiswa, ideTA, deskripsiIde, bidangId, dosenPembimbingIDs,idTA, id }) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  console.log(id);
  const raw = JSON.stringify({
    idMahasiswa,
    ideTA,
    deskripsiIde,
    bidangId,
    dosenPembimbingIDs,
    idTA,

  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/editAjukanIdeTA/${id}`;
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
