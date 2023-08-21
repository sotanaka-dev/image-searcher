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
