const generateDoc = async (idTA) => {
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

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
};

export default generateDoc;
