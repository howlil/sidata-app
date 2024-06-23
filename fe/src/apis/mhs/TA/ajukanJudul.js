export default async function ajukanJudul(idTA, judulTA) {
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

  try {
    
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/ajukanJudulTA`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;

  } catch (error) {
    console.log("error", error);
  }
}
