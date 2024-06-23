const addAkunDosen = async (nama, nip, email, password, jabatanId, bidangDosen,id) => {
  const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    
    const raw = JSON.stringify({
      nama,
      nip,
      email,
      password,
      jabatanId,
      BidangDosen: bidangDosen.map(bidang => ({ bidangId: bidang }))
    });
    
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    
   try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/editAkunDosen/${id}`;
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    return result;

   } catch (error) {
    console.log(error)
   }
}
export default addAkunDosen;