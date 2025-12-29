// API service for fetching MTG JSON data with daily caching

const CACHE_KEY = 'mtgjson_data';
const CACHE_DATE_KEY = 'mtgjson_cache_date';
const API_BASE_URL = 'https://mtgjson.com/api/v5';

/**
 * Check if cached data is from today
 * @returns {boolean}
 */
const isCacheValid = () => {
  const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
  if (!cachedDate) return false;
  
  const today = new Date().toDateString();
  return cachedDate === today;
};

/**
 * Get cached data from localStorage
 * @returns {Object|null}
 */
const getCachedData = () => {
  if (!isCacheValid()) {
    // Invalidate cache if not from today
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_DATE_KEY);
    return null;
  }
  
  const cachedData = localStorage.getItem(CACHE_KEY);
  return cachedData ? JSON.parse(cachedData) : null;
};

/**
 * Save data to cache with today's date
 * @param {Object} data
 */
const setCachedData = (data) => {
  const today = new Date().toDateString();
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_DATE_KEY, today);
};

/**
 * Fetch MTG JSON data with caching
 * Checks cache first, only calls API if cache is invalid
 * @param {string} endpoint - The endpoint to fetch (e.g., 'AtomicCards.json')
 * @returns {Promise<Object>}
 */
export const fetchMTGData = async () => {
  // Check cache first
  const cachedData = getCachedData();
  if (cachedData) {
    console.log('Using cached MTG data from today');
    return cachedData;
  }
  
  // Fetch from API
  console.log('Fetching fresh MTG data from API...');
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the data
    setCachedData(data);
    console.log('MTG data cached successfully');
    
    return data;
  } catch (error) {
    console.error('Error fetching MTG data:', error);
    throw error;
  }
};

/**
 * Clear the cache manually
 */
export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_DATE_KEY);
  console.log('Cache cleared');
};

/**
 * Get cache status information
 * @returns {Object}
 */
export const getCacheStatus = () => {
  const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
  const hasCache = localStorage.getItem(CACHE_KEY) !== null;
  const isValid = isCacheValid();
  
  return {
    hasCache,
    isValid,
    cachedDate,
    currentDate: new Date().toDateString()
  };
};
