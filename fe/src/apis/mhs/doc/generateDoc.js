const generateDoc = async (idTA) => {
<<<<<<< HEAD
  const myHeaders = new Headers();
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token not found');
  }
  
  myHeaders.append('Authorization', `Bearer ${token}`);
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generatePdf/${idTA}`, requestOptions);
    console.log('response', response);
    
    if (!response.ok) {
      console.error(`Error generating document: ${response.status} - ${response.statusText}`);
      throw new Error(`Error generating document: ${response.status} - ${response.statusText}`);
    }
    
=======
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generatePdf/${idTA}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error('Error generating document');
    }

>>>>>>> origin/faizz
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
};

export default generateDoc;
