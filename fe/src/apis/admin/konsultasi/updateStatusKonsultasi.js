export default async function updateStatusKonsultasi (status,id){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
        status
      });
      
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
    
   try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/updateStatusKonsultasi/${id}`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;

   } catch (error) {
    console.log(error)
   }
}