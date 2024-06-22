
export default async function getRiwayatBimbinganTA() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };
    
    const url = `${import.meta.env.VITE_API_BASE_URL}/getRiwayatBimbinganTA`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
}
