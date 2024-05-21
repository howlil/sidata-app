export default async function infoProfil() {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
  
      const response = await fetch("http://localhost:5000/infoAkun", requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }