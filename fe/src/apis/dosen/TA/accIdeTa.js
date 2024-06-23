
export default async function accIdeTa(
    idTA,
    isApproved,
    id
) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        idTA,
        isApproved,
        id
    });

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/accIdeTA`;
        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();
<<<<<<< HEAD
        console.log(result);    
=======
>>>>>>> origin/faizz
        return result;

    } catch (error) {
        console.log(error)
    }

}
