export default async function getJumlahDosen (){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
   try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/jumlahDosen`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;

   } catch (error) {
    console.log(error)
   }
}