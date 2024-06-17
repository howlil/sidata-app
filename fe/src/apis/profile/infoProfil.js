export default async function infoProfil() {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/infoAkun`;
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }