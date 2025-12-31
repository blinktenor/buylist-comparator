import { useState, useEffect, useCallback } from 'react';
import CardListInput from './components/CardListInput';
import CacheStatus from './components/CacheStatus';
import CardResults from './components/CardResults';
import { fetchMTGData, clearCache, getCacheStatus } from './api/mtgJsonService';
import './App.css';

function App() {
  const [mtgData, setMtgData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(getCacheStatus());
  const [submittedCards, setSubmittedCards] = useState([]);

  // Fetch MTG data for multiple sets
  const fetchSetsData = async (setCodes) => {
    const uniqueSets = [...new Set(setCodes.map(code => code.toUpperCase()))];
    const dataPromises = uniqueSets.map(setCode => 
      fetchMTGData(setCode)
        .then(data => ({ setCode, data }))
        .catch(err => ({ setCode, error: err.message }))
    );
    
    const results = await Promise.all(dataPromises);
    const newMtgData = {};
    const errors = [];
    
    results.forEach(result => {
      if (result.error) {
        errors.push(`${result.setCode}: ${result.error}`);
      } else {
        newMtgData[result.setCode] = result.data;
      }
    });
    
    return { data: newMtgData, errors };
  };

  const handleCardsSubmit = async (cards) => {
    setSubmittedCards(cards);
    setLoading(true);
    setError(null);
    
    try {
      // Extract unique set codes from cards
      const setCodes = cards
        .map(card => card.setCode)
        .filter(setCode => setCode !== null);
      
      if (setCodes.length === 0) {
        setError('No valid set codes found in cards');
        setLoading(false);
        return;
      }
      
      // Fetch data for all sets
      const { data, errors } = await fetchSetsData(setCodes);
      setMtgData(data);
      
      if (errors.length > 0) {
        setError(`Failed to load some sets: ${errors.join(', ')}`);
      }
      
      setCacheInfo(getCacheStatus());
    } catch (err) {
      setError(`Failed to load MTG data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    setMtgData({});
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
      
      {submittedCards.length > 0 && Object.keys(mtgData).length > 0 && !loading && (
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
