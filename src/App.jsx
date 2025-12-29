import { useState, useEffect } from 'react';
import CardListInput from './components/CardListInput';
import CacheStatus from './components/CacheStatus';
import CardResults from './components/CardResults';
import { fetchMTGData, clearCache, getCacheStatus } from './api/mtgJsonService';
import './App.css';

function App() {
  const [mtgData, setMtgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(getCacheStatus());
  const [submittedCards, setSubmittedCards] = useState([]);

  useEffect(() => {
    // Load data on mount if cache exists
    const loadData = async () => {
      if (cacheInfo.isValid && cacheInfo.hasCache) {
        setLoading(true);
        try {
          const data = await fetchMTGData();
          setMtgData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, []);

  const handleCardsSubmit = async (cards) => {
    setSubmittedCards(cards);
    
    // Fetch MTG data if not already loaded
    if (!mtgData) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMTGData();
        setMtgData(data);
        setCacheInfo(getCacheStatus());
      } catch (err) {
        setError(`Failed to load MTG data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearCache = () => {
    clearCache();
    setMtgData(null);
    setCacheInfo(getCacheStatus());
    setSubmittedCards([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🃏 Buylist Comparator</h1>
        <p>Compare prices for buyable MTG cards</p>
      </header>
      
      <CacheStatus cacheInfo={cacheInfo} onClearCache={handleClearCache} />
      
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Loading MTG data... This may take a moment on first load.</p>
        </div>
      )}
      
      <CardListInput onCardsSubmit={handleCardsSubmit} />
      
      {submittedCards.length > 0 && mtgData && !loading && (
        <CardResults cards={submittedCards} mtgData={mtgData} />
      )}
      
      <footer className="App-footer">
        <p>Data provided by <a href="https://mtgjson.com" target="_blank" rel="noopener noreferrer">MTGJSON</a></p>
        <p>Cache is automatically invalidated daily</p>
      </footer>
    </div>
  );
}

export default App;
