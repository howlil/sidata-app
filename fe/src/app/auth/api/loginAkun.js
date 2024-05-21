export default async function LoginAkun({ email, password }) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/login`;
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    const token = data.token;
    console.log("====================================");
    console.log(token);
    console.log("====================================");

    if (token) {
      localStorage.setItem("token", token);
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
