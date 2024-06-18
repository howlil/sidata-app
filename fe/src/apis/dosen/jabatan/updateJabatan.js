export default async function updateJabatan (nama,email,password,nim,alamat,id){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    
    const raw = JSON.stringify({
      "nama": nama,
      "email": email,
      "password": password,
      "nim": nim,
      "alamat": alamat
    });
    
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    
   try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/updateJabatan/${id}`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;

   } catch (error) {
    console.log(error)
   }
}