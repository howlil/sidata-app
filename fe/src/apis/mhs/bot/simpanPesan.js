export default async function simpanPesan(idMahasiswa, text, role) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  myHeaders.append("Content-Type", "application/json"); 

  console.log("Sending data:", idMahasiswa, text, role);

  const raw = JSON.stringify({
    idMahasiswa,
    text,
    role,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const url = `${import.meta.env.VITE_API_BASE_URL}/chatBot/add`;

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
