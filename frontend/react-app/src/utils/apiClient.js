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

export const createNewFolder = async (
  apiEndpoint,
  token,
  folderName,
  parentId,
  setErrorMessage,
  reloadFolders,
  closeModal
) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: folderName, parent_id: parentId }),
    });

    const result = await res.json();

    if (!res.ok) {
      setErrorMessage(result.errors);
      return;
    }

    reloadFolders();
    closeModal();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateFolderName = async (
  apiEndpoint,
  token,
  newFolderName,
  setErrorMessage,
  reloadFolders,
  closeModal
) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newFolderName }),
    });

    const result = await res.json();

    if (!res.ok) {
      setErrorMessage(result.errors);
      return;
    }

    reloadFolders();
    closeModal();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteFolder = async (apiEndpoint, token, reloadFolders) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Failed to delete folder: ${res.statusText}`);
      return;
    }
    reloadFolders();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const addFavoritesToFolders = async (
  apiEndpoint,
  token,
  selectedIds,
  folderIds,
  onComplete
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

    onComplete();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const removeFavoritesToFolders = async (
  apiEndpoint,
  token,
  selectedIds,
  onComplete,
  reloadFavorites
) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        favorite_ids: selectedIds,
      }),
    });

    if (!res.ok) {
      console.error("Failed to add favorites to folder");
      return;
    }

    onComplete();
    reloadFavorites();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchFavoritesByFolder = async (apiEndpoint, token, setPosts) => {
  try {
    const res = await fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setPosts(data);
  } catch (error) {
    console.error("Error fetching the posts:", error);
  }
};

export const fetchFavorites = async (apiEndpoint, token, setPosts) => {
  const res = await fetch(apiEndpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setPosts(data);
};

export const removeFavorites = async (
  apiEndpoint,
  token,
  selectedIds,
  onComplete,
  reloadFavorites
) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        favorite_ids: selectedIds,
      }),
    });

    if (!res.ok) {
      console.error("Failed to add favorites to folder");
      return;
    }

    onComplete();
    reloadFavorites();
  } catch (error) {
    console.error("Error:", error);
  }
};
