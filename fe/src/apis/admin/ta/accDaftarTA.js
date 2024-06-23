export default async function accDaftarTA(idDaftarTA, isApproved) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    idDaftarTA,
    isApproved,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/accDaftarTA`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}
