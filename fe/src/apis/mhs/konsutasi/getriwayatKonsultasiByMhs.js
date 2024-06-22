
export default async function getriwayatKonsultasiByMhs(id) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/getRiwayatKonsul/${id}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        return result;
      } catch (error) {
        console.log("error", error); 
      }
}
