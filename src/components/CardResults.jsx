import './CardResults.css';

const CardResults = ({ cards, mtgData, pricingData }) => {
  if (!cards || cards.length === 0) {
    return null;
  }

  // Helper to get pricing info for a card by UUID
  const getPricingInfo = (uuid) => {
    if (!pricingData || !pricingData.data || !uuid) {
      return null;
    }
    return pricingData.data[uuid] || null;
  };

  const getCardInfo = (card) => {
    if (!mtgData || Object.keys(mtgData).length === 0) {
      return null;
    }
    
    const cardName = typeof card === 'string' ? card : card.name;
    const setCode = typeof card === 'object' ? card.setCode : null;
    
    // Helper function to check if a card matches
    const cardMatches = (dbCard, searchName) => {
      const dbName = dbCard.name.toLowerCase();
      const search = searchName.toLowerCase();
      
      // Exact match
      if (dbName === search) return true;
      
      // Partial match - check if the search term contains the full card name
      // or if the card name contains the search term
      if (dbName.includes(search) || search.includes(dbName)) return true;
      
      return false;
    };
    
    // If we have a set code, look in that specific set's data
    if (setCode && mtgData[setCode]) {
      const setData = mtgData[setCode];
      if (setData.data && setData.data.cards) {
        // Try exact match first
        let found = setData.data.cards.find(c => 
          c.name.toLowerCase() === cardName.toLowerCase()
        );
        
        // If not found, try partial match
        if (!found) {
          found = setData.data.cards.find(c => cardMatches(c, cardName));
        }
        
        return found || null;
      }
    }
    
    // Fallback: search through all loaded sets
    for (const set of Object.values(mtgData)) {
      if (set.data && set.data.cards) {
        // Try exact match first
        let found = set.data.cards.find(c => 
          c.name.toLowerCase() === cardName.toLowerCase()
        );
        
        // If not found, try partial match
        if (!found) {
          found = set.data.cards.find(c => cardMatches(c, cardName));
        }
        
        if (found) return found;
      }
    }
    
    return null;
  };

  // Helper to check if card has Card Kingdom buylist info
  const hasBuylistInfo = (cardInfo, isFoil) => {
    if (!cardInfo) return false;
    
    // Check for Card Kingdom buylist based on foil status
    if (cardInfo.purchaseUrls) {
      const buylistKey = isFoil ? 'cardKingdomFoil' : 'cardKingdom';
      return cardInfo.purchaseUrls[buylistKey] !== undefined;
    }
    
    return false;
  };

  // Sort cards: buylist available first, then not available, then not found
  const sortedCards = [...cards].sort((a, b) => {
    const aInfo = getCardInfo(a);
    const bInfo = getCardInfo(b);
    const aIsFoil = typeof a === 'object' ? a.isFoil : false;
    const bIsFoil = typeof b === 'object' ? b.isFoil : false;
    
    const aHasBuylist = hasBuylistInfo(aInfo, aIsFoil);
    const bHasBuylist = hasBuylistInfo(bInfo, bIsFoil);
    const aFound = aInfo !== null;
    const bFound = bInfo !== null;
    
    // Both found
    if (aFound && bFound) {
      if (aHasBuylist && !bHasBuylist) return -1;
      if (!aHasBuylist && bHasBuylist) return 1;
      return 0;
    }
    
    // One found, one not
    if (aFound && !bFound) return -1;
    if (!aFound && bFound) return 1;
    
    return 0;
  });

  // Count cards with buylist info
  const buylistCount = sortedCards.filter(card => {
    const info = getCardInfo(card);
    const isFoil = typeof card === 'object' ? card.isFoil : false;
    return hasBuylistInfo(info, isFoil);
  }).length;

  return (
    <div className="card-results">
      <h2>Card Results ({cards.length} cards)</h2>
      {buylistCount > 0 && (
        <p className="buylist-summary">
          🛒 {buylistCount} card{buylistCount !== 1 ? 's' : ''} available on Card Kingdom buylist
        </p>
      )}
      <div className="results-list">
        {sortedCards.map((card, index) => {
          const cardInfo = getCardInfo(card);
          const cardName = typeof card === 'string' ? card : card.name;
          const setCode = typeof card === 'object' ? card.setCode : null;
          const isFoil = typeof card === 'object' ? card.isFoil : false;
          const onBuylist = hasBuylistInfo(cardInfo, isFoil);
          
          // Get Card Kingdom buylist URL
          const buylistKey = isFoil ? 'cardKingdomFoil' : 'cardKingdom';
          const buylistUrl = cardInfo?.purchaseUrls?.[buylistKey];
          
          return (
            <div key={index} className={`card-result-item ${onBuylist ? 'has-buylist' : ''}`}>
              <div className="card-name">
                {cardName}
                {setCode && <span className="set-code"> ({setCode.toUpperCase()})</span>}
                {isFoil && <span className="foil-badge"> ✨ FOIL</span>}
              </div>
              {cardInfo ? (
                <div className="card-info">
                  <p>✓ Found in database</p>
                  {cardInfo.type && <p><strong>Type:</strong> {cardInfo.type}</p>}
                  {cardInfo.manaCost && <p><strong>Mana Cost:</strong> {cardInfo.manaCost}</p>}
                  {cardInfo.rarity && <p><strong>Rarity:</strong> {cardInfo.rarity}</p>}
                  
                  {/* Card Kingdom Buylist Information */}
                  {buylistUrl && (
                    <div className="buylist-info">
                      <p><strong>🛒 Card Kingdom Buylist:</strong></p>
                      
                      {/* Display buylist price if available */}
                      {cardInfo.uuid && getPricingInfo(cardInfo.uuid) && (
                        <div className="buylist-prices">
                          {isFoil ? (
                            <>
                              {getPricingInfo(cardInfo.uuid).buylist?.cardKingdomFoil && (
                                <p className="buylist-price">
                                  Buying for: <strong>${getPricingInfo(cardInfo.uuid).buylist.cardKingdomFoil}</strong> (Foil)
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              {getPricingInfo(cardInfo.uuid).buylist?.cardKingdom && (
                                <p className="buylist-price">
                                  Buying for: <strong>${getPricingInfo(cardInfo.uuid).buylist.cardKingdom}</strong>
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      
                      <a href={buylistUrl} target="_blank" rel="noopener noreferrer" className="buylist-button">
                        View on Card Kingdom {isFoil ? '(Foil)' : ''}
                      </a>
                    </div>
                  )}
                  
                  {!buylistUrl && (
                    <p className="no-buylist">⚠️ Not available on Card Kingdom buylist {isFoil ? '(foil)' : ''}</p>
                  )}
                  
                  {cardInfo.text && <p className="card-text">{cardInfo.text}</p>}
                </div>
              ) : (
                <div className="card-info not-found">
                  <p>✗ Not found in database</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardResults;
