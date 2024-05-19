
export default async function ubahPassword({
  email,
  oldPassword,
  newPassword,
}) {
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

  const urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("oldPassword", oldPassword);
  urlencoded.append("newPassword", newPassword);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/ubahPassword`;
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
