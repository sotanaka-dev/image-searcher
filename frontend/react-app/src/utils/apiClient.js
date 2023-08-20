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
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    console.log(error.stack);
    return null;
  }
};

export const post = async (apiEndpoint, token, dataBody) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataBody),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    }

    if (data.errors) {
      return data;
    }

    throw new Error(`${res.status} ${res.statusText}`);
  } catch (error) {
    console.error("Error:", error.message);
    console.log(error.stack);
    return {
      errors: ["予期しないエラーが発生しました"],
    };
  }
};

export const patch = async (apiEndpoint, token, dataBody) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataBody),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    }

    if (data.errors) {
      return data;
    }

    throw new Error(`${res.status} ${res.statusText}`);
  } catch (error) {
    console.error("Error:", error.message);
    console.log(error.stack);
    return {
      errors: ["予期しないエラーが発生しました"],
    };
  }
};

export const destroy = async (apiEndpoint, token, dataBody = null) => {
  try {
    const res = await fetch(apiEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataBody),
    });

    if (res.ok) {
      return true;
    }

    throw new Error(`${res.status} ${res.statusText}`);
  } catch (error) {
    console.error("Error:", error.message);
    console.log(error.stack);
    return false;
  }
};
