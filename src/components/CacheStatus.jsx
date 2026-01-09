import { useState } from 'react';
import { getCachedSetDetails } from '../api/mtgJsonService';
import './CacheStatus.css';

const CacheStatus = ({ cacheInfo, onClearCache, pricingData }) => {
  const [expandedSet, setExpandedSet] = useState(null);
  const [setCards, setSetCards] = useState([]);

  // Helper to get pricing info for a card by UUID
  const getPricingInfo = (uuid) => {
    if (!pricingData || !pricingData.data || !uuid) {
      return null;
    }
    return pricingData.data[uuid] || null;
  };

  const toggleSetExpansion = (setCode) => {
    if (expandedSet === setCode) {
      setExpandedSet(null);
      setSetCards([]);
    } else {
      setExpandedSet(setCode);
      const details = getCachedSetDetails(setCode);
      setSetCards(details?.cards || []);
    }
  };

  return (
    <div className="cache-status">
      <h3>Cache Status</h3>
      <div className="status-info">
        <span className={`status-indicator ${cacheInfo.isValid ? 'valid' : 'invalid'}`}>
          {cacheInfo.isValid ? '✓ Cache Valid' : '✗ No Valid Cache'}
        </span>
        <p>Current date: {cacheInfo.currentDate}</p>
        
        {cacheInfo.setDetails && cacheInfo.setDetails.length > 0 && (
          <div className="set-details">
            <h4>Cached Sets:</h4>
            <ul className="set-list">
              {cacheInfo.setDetails.map(set => (
                <li key={set.setCode} className={set.isValid ? 'valid-set' : 'invalid-set'}>
                  <div 
                    className="set-header" 
                    onClick={() => toggleSetExpansion(set.setCode)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="expand-icon">{expandedSet === set.setCode ? '▼' : '▶'}</span>
                    <strong>{set.setCode}</strong>: {set.cardCount} cards
                    <span className="cache-date"> (cached: {set.cachedDate})</span>
                  </div>
                  
                  {expandedSet === set.setCode && (
                    <div className="card-list-container">
                      <ul className="card-list">
                        {setCards.slice(0, 50).map((card, idx) => {
                          const hasBuylist = card.purchaseUrls?.cardKingdom;
                          const hasFoilBuylist = card.purchaseUrls?.cardKingdomFoil;
                          const pricing = card.uuid ? getPricingInfo(card.uuid) : null;
                          const buylistPrice = pricing?.buylist?.cardKingdom;
                          const buylistFoilPrice = pricing?.buylist?.cardKingdomFoil;
                          
                          return (
                            <li key={idx} className={`card-item ${hasBuylist || hasFoilBuylist ? 'has-buylist-indicator' : ''}`}>
                              <div className="card-item-name">
                                {card.name}
                                {card.manaCost && <span className="mana-cost"> {card.manaCost}</span>}
                              </div>
                              {(hasBuylist || hasFoilBuylist) && (
                                <div className="card-buylist-info">
                                  {hasBuylist && (
                                    <span className="buylist-tag">
                                      🛒 CK {buylistPrice ? `$${buylistPrice}` : ''}
                                    </span>
                                  )}
                                  {hasFoilBuylist && (
                                    <span className="buylist-tag foil">
                                      ✨ CK Foil {buylistFoilPrice ? `$${buylistFoilPrice}` : ''}
                                    </span>
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      {setCards.length > 50 && (
                        <p className="more-cards">...and {setCards.length - 50} more cards</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {cacheInfo.hasCache && (
        <button onClick={onClearCache} className="clear-cache-btn">
          Clear Cache
        </button>
      )}
    </div>
  );
};

export default CacheStatus;
