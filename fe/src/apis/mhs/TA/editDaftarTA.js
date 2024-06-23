export default async function editDaftarTA(
    idDaftarTA,
    idMahasiswa,
    idTA,
    transkripNilai,
    buktiLulus,
    buktiKRS,
    suratTugas,
    suratIzinKuliah,
    buktiKP
  ) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  
    const formdata = new FormData();
    formdata.append("idDaftarTA", idDaftarTA);
    formdata.append("idMahasiswa", idMahasiswa);
    formdata.append("idTA", idTA);
    formdata.append("transkripNilai", transkripNilai);
    formdata.append("buktiLulus", buktiLulus);
    formdata.append("buktiKRS", buktiKRS);
    formdata.append("suratTugas", suratTugas);
    formdata.append("suratIzinKuliah", suratIzinKuliah);
    formdata.append("buktiKP", buktiKP);
  
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
  
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/editDaftarTA`;
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  