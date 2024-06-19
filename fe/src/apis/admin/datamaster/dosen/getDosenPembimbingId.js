
export default async function getDosenPembimbingId(
    dosenId,
    tipePembimbing,
    jabatanId
) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    console.log(dosenId, tipePembimbing, jabatanId)
    const raw = JSON.stringify({
        dosenId,
        tipePembimbing,
        jabatanId
      });
      
    const requestOptions = {
      method: "POST",
      body : raw,
      headers: myHeaders,
      redirect: "follow"
    };
        
   try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/getDosenPembimbingId`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;

   } catch (error) {
    console.log(error)
   }
}
