export default async function editJudul(idTA, judulTA) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  const raw = JSON.stringify({
    idTA,
    judulTA,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/editJudulTA`;
  fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error));
}
