// API service for fetching MTG JSON data with daily caching

const CACHE_KEY = 'mtgjson_data';
const CACHE_DATE_KEY = 'mtgjson_cache_date';
const PRICES_CACHE_KEY = 'mtgjson_prices';
const PRICES_CACHE_DATE_KEY = 'mtgjson_prices_date';
const API_BASE_URL = 'https://mtgjson.com/api/v5';

/**
 * Check if cached data is from today
 * @param {string} set - The set code
 * @returns {boolean}
 */
const isCacheValid = (set) => {
  const cachedDate = localStorage.getItem(`${CACHE_DATE_KEY}_${set}`);
  if (!cachedDate) return false;
  
  const today = new Date().toDateString();
  return cachedDate === today;
};

/**
 * Get cached data from localStorage
 * @param {string} set - The set code
 * @returns {Object|null}
 */
const getCachedData = (set) => {
  if (!isCacheValid(set)) {
    // Invalidate cache if not from today
    localStorage.removeItem(`${CACHE_KEY}_${set}`);
    localStorage.removeItem(`${CACHE_DATE_KEY}_${set}`);
    return null;
  }
  
  const cachedData = localStorage.getItem(`${CACHE_KEY}_${set}`);
  return cachedData ? JSON.parse(cachedData) : null;
};

/**
 * Save data to cache with today's date
 * @param {Object} data
 * @param {string} set - The set code
 */
const setCachedData = (data, set) => {
  const today = new Date().toDateString();
  localStorage.setItem(`${CACHE_KEY}_${set}`, JSON.stringify(data));
  localStorage.setItem(`${CACHE_DATE_KEY}_${set}`, today);
};

/**
 * Fetch MTG JSON data with caching
 * Checks cache first, only calls API if cache is invalid
 * @param {string} set - The set code to fetch
 * @returns {Promise<Object>}
 */
export const fetchMTGData = async (set) => {
  // Check cache first
  const cachedData = getCachedData(set);
  if (cachedData) {
    console.log(`Using cached MTG data for ${set} from today`);
    return cachedData;
  }
  
  // Fetch from API
  console.log(`Fetching fresh MTG data for ${set} from API...`);
  const url = `${API_BASE_URL}/${set}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - URL: ${url} `);
    }
    
    const data = await response.json();
    
    // Cache the data
    setCachedData(data, set);
    console.log(`MTG data for ${set} cached successfully`);
    
    return data;
  } catch (error) {
    console.error(`Error fetching MTG data for ${set} from ${url} :`, error);
    throw new Error(`Failed to fetch ${set} from ${url} : ${error.message}`);
  }
};

/**
 * Clear the cache manually
 */
export const clearCache = () => {
  // Clear all localStorage items that start with our cache keys
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_KEY) || key.startsWith(CACHE_DATE_KEY)) {
      localStorage.removeItem(key);
    }
  });
  console.log('All caches cleared');
};

/**
 * Get cache status information
 * @returns {Object}
 */
export const getCacheStatus = () => {
  const keys = Object.keys(localStorage);
  const cachedSets = keys
    .filter(key => key.startsWith(CACHE_KEY))
    .map(key => key.replace(`${CACHE_KEY}_`, ''));
  
  const hasCache = cachedSets.length > 0;
  const today = new Date().toDateString();
  
  // Check if any cached set is valid (from today)
  const isValid = cachedSets.some(set => {
    const cachedDate = localStorage.getItem(`${CACHE_DATE_KEY}_${set}`);
    return cachedDate === today;
  });
  
  // Get detailed info about each cached set
  const setDetails = cachedSets.map(set => {
    const cachedData = localStorage.getItem(`${CACHE_KEY}_${set}`);
    const cachedDate = localStorage.getItem(`${CACHE_DATE_KEY}_${set}`);
    let cardCount = 0;
    
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        if (data && data.data && data.data.cards) {
          cardCount = data.data.cards.length;
        }
      } catch (e) {
        console.error(`Error parsing cache for ${set}:`, e);
      }
    }
    
    return {
      setCode: set,
      cachedDate,
      cardCount,
      isValid: cachedDate === today
    };
  });
  
  return {
    hasCache,
    isValid,
    cachedSets,
    setDetails,
    currentDate: today
  };
};

/**
 * Get detailed information about a specific cached set
 * @param {string} set - The set code
 * @returns {Object|null}
 */
export const getCachedSetDetails = (set) => {
  const cachedData = getCachedData(set);
  if (!cachedData) return null;
  
  return {
    setCode: set,
    cardCount: cachedData?.data?.cards?.length || 0,
    cards: cachedData?.data?.cards || [],
    cachedDate: localStorage.getItem(`${CACHE_DATE_KEY}_${set}`)
  };
};

/**
 * Check if pricing cache is valid (from today)
 * @returns {boolean}
 */
const isPricingCacheValid = () => {
  const cachedDate = localStorage.getItem(PRICES_CACHE_DATE_KEY);
  if (!cachedDate) return false;
  
  const today = new Date().toDateString();
  return cachedDate === today;
};

/**
 * Get cached pricing data from localStorage
 * @returns {Object|null}
 */
const getCachedPricingData = () => {
  if (!isPricingCacheValid()) {
    // Invalidate cache if not from today
    localStorage.removeItem(PRICES_CACHE_KEY);
    localStorage.removeItem(PRICES_CACHE_DATE_KEY);
    return null;
  }
  
  const cachedData = localStorage.getItem(PRICES_CACHE_KEY);
  return cachedData ? JSON.parse(cachedData) : null;
};

/**
 * Save pricing data to cache with today's date
 * @param {Object} data
 */
const setCachedPricingData = (data) => {
  const today = new Date().toDateString();
  localStorage.setItem(PRICES_CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(PRICES_CACHE_DATE_KEY, today);
};

/**
 * Fetch AllPricesToday.json with caching
 * Checks cache first, only calls API if cache is invalid
 * @returns {Promise<Object>}
 */
export const fetchPricingData = async () => {
  // Check cache first
  const cachedData = getCachedPricingData();
  if (cachedData) {
    console.log('Using cached pricing data from today');
    return cachedData;
  }
  
  // Fetch from API
  console.log('Fetching fresh pricing data from API...');
  const url = `${API_BASE_URL}/AllPricesToday.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - URL: ${url}`);
    }
    
    const data = await response.json();
    
    // Cache the data
    setCachedPricingData(data);
    console.log('Pricing data cached successfully');
    
    return data;
  } catch (error) {
    console.error(`Error fetching pricing data from ${url}:`, error);
    throw new Error(`Failed to fetch pricing data from ${url}: ${error.message}`);
  }
};
