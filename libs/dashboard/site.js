const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function createSite({ domain, timezone, name }) {
  try {
    const response = await fetch(`${BASE_URL}/api/sites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain, timezone, name }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create site");
    }

    return result; // Return the created site data
  } catch (error) {
    throw new Error(error.message || "An error occurred while creating the site");
  }
}

export async function getSites(token) {
  try {
    const url = `${BASE_URL}/api/sites`;
    console.log('url', url);

    const response = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch sites");
    }

    return result; // Return the fetched sites data
  } catch (error) {
    console.log('error', error);
    throw new Error(error.message || "An error occurred while fetching the sites");
  }
}
