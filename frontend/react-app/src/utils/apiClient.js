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
  onSuccess
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

    onSuccess();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateFolderName = async (
  apiEndpoint,
  token,
  newFolderName,
  setErrorMessage,
  onSuccess
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

    onSuccess();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteFolder = async (apiEndpoint, token, onSuccess) => {
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

    onSuccess();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const addFavoritesToFolders = async (
  apiEndpoint,
  token,
  selectedIds,
  folderIds,
  onSuccess
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

    onSuccess();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const removeFavoritesToFolders = async (
  apiEndpoint,
  token,
  selectedIds,
  onSuccess
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

    onSuccess();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const removeFavorites = async (
  apiEndpoint,
  token,
  selectedIds,
  onSuccess
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

    onSuccess();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateUsername = async (
  apiEndpoint,
  token,
  username,
  setErrorMessage,
  onSuccess
) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const result = await res.json();

    if (!res.ok) {
      setErrorMessage(result.errors);
      return;
    }

    onSuccess();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export const updatePassword = async (
  apiEndpoint,
  token,
  password,
  setErrorMessage,
  onSuccess
) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setErrorMessage(result.errors);
      return;
    }

    onSuccess();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export const destroyUser = async (apiEndpoint, token, onSuccess) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Failed to delete account: ${res.statusText}`);
      return;
    }

    onSuccess();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export const getFavoriteStatus = async (apiEndpoint, token, post_id) => {
  const res = await fetch(`${apiEndpoint}/exists?post_id=${post_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const toggleFavoriteStatus = async (
  apiEndpoint,
  token,
  isFavorite,
  favoriteId,
  post_id,
  service_id,
  onSuccess
) => {
  try {
    const res = await fetch(
      `${apiEndpoint}${isFavorite ? `/${favoriteId}` : ""}`,
      {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          favorite: { post_id: post_id, service_id: service_id },
        }),
      }
    );

    if (!res.ok) {
      console.error(`Failed to favorite: ${res.statusText}`);
      return;
    }

    onSuccess();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export const get = async (apiEndpoint, token) => {
  try {
    const res = await fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch data from API: ${res.statusText}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
