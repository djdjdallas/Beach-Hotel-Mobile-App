import axios from "axios";

export const getPlacesData = async (bl_lat, bl_lng, tr_lat, tr_lng, type) => {
  try {
    // Validate inputs
    if (!type) {
      throw new Error("Place type is required");
    }

    // Check for API keys
    if (!process.env.EXPO_PUBLIC_RAPIDAPI_KEY || !process.env.EXPO_PUBLIC_RAPIDAPI_HOST) {
      throw new Error("API configuration is missing. Please check your environment variables.");
    }

    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: bl_lat ? bl_lat : "33.71495697977352",
          tr_latitude: tr_lat ? tr_lat : "33.88545905340229",
          bl_longitude: bl_lng ? bl_lng : "-118.2489659765446",
          tr_longitude: tr_lng ? tr_lng : "-118.0632530381559",
          restaurant_tagcategory_standalone: "10591",
          restaurant_tagcategory: "10591",
          limit: "30",
          currency: "USD",
          open_now: "false",
          lunit: "km",
          lang: "en_US",
        },
        headers: {
          "X-RapidAPI-Key": process.env.EXPO_PUBLIC_RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.EXPO_PUBLIC_RAPIDAPI_HOST,
        },
        timeout: 10000, // 10 second timeout
      }
    );
    
    // Validate response data
    if (!data || !Array.isArray(data)) {
      console.warn("Invalid response format from API");
      return [];
    }
    
    return data;
  } catch (error) {
    // Log detailed error information
    console.error("Error fetching places data:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    // Provide user-friendly error messages
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      } else if (error.response.status === 401) {
        throw new Error("API authentication failed. Please check your API key.");
      } else if (error.response.status === 404) {
        throw new Error("The requested data was not found.");
      } else if (error.response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("Network error. Please check your internet connection.");
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("Request timeout. Please try again.");
    }
    
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};
