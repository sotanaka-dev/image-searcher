export const fetchFolders = async (apiEndpoint, token, setFolders) => {
  try {
    const res = await fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Failed to get folder: ${res.statusText}`);
      return;
    }

    const data = await res.json();
    setFolders(data.folders);
  } catch (error) {
    console.error("Error:", error);
  }
};
