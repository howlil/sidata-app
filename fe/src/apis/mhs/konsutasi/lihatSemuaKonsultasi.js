export default async function lihatSemuaKonsultasi() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/getAllJadwalKonsultasi`;
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("error", error);
    }
}