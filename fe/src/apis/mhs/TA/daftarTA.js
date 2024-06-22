export default async function daftarTA(idMahasiswa,idTA,transkripNilai, buktiLulus, buktiKRS, suratTugas, suratIzinKuliah, buktiKP) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  
    const formdata = new FormData();
    formdata.append("idMahasiswa", idMahasiswa);
    formdata.append("idTA", idTA);
      formdata.append("transkripNilai", transkripNilai.files[0]);
    formdata.append("buktiLulus", buktiLulus.files[0]);
    formdata.append("buktiKRS", buktiKRS.files[0]);
    formdata.append("suratTugas", suratTugas.files[0]);
    formdata.append("suratIzinKuliah", suratIzinKuliah.files[0]);
    formdata.append("buktiKP", buktiKP.files[0]);
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
  
    try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/daftarTA`;
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
   
  }