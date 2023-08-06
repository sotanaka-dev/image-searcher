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

export const addFavoritesToFolders = async (
  apiEndpoint,
  token,
  selectedIds,
  folderIds,
  handleComplete
) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        favorite_ids: selectedIds,
        folder_ids: folderIds,
      }),
    });

    if (!res.ok) {
      console.error("Failed to add favorites to folder");
      return;
    }

    handleComplete();
  } catch (error) {
    console.error("Error:", error);
  }
};
