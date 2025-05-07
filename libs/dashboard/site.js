const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://popfast.vercel.app";

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

export async function getSites(userId) {
  try {
    const url = `${BASE_URL}/api/sites?user_id=${userId}`; // Pass user_id as a query parameter

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const { sites, success } = await response.json();

    if (!success) {
      throw new Error("Failed to fetch sites");
    }

    return sites;
  } catch (error) {
    console.error("Error fetching sites:", error);
    throw new Error(error.message || "An error occurred while fetching the sites");
  }
}

export async function getSiteById(siteId) {
  try {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const { success, site } = await response.json();

    if (!success) {
      throw new Error("Failed to fetch site details");
    }

    return site;
  } catch (error) {
    console.error("Error fetching site details:", error);
    throw error;
  }
}
