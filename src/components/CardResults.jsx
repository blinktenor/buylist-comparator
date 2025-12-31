import './CardResults.css';

const CardResults = ({ cards, mtgData }) => {
  if (!cards || cards.length === 0) {
    return null;
  }

  const getCardInfo = (card) => {
    if (!mtgData || Object.keys(mtgData).length === 0) {
      return null;
    }
    
    const cardName = typeof card === 'string' ? card : card.name;
    const setCode = typeof card === 'object' ? card.setCode : null;
    
    // If we have a set code, look in that specific set's data
    if (setCode && mtgData[setCode]) {
      const setData = mtgData[setCode];
      if (setData.data && setData.data.cards) {
        // Search through the cards array in the set
        return setData.data.cards.find(c => 
          c.name.toLowerCase() === cardName.toLowerCase()
        );
      }
    }
    
    // Fallback: search through all loaded sets
    for (const set of Object.values(mtgData)) {
      if (set.data && set.data.cards) {
        const found = set.data.cards.find(c => 
          c.name.toLowerCase() === cardName.toLowerCase()
        );
        if (found) return found;
      }
    }
    
    return null;
  };

  return (
    <div className="card-results">
      <h2>Card Results ({cards.length} cards)</h2>
      <div className="results-list">
        {cards.map((card, index) => {
          const cardInfo = getCardInfo(card);
          const cardName = typeof card === 'string' ? card : card.name;
          const setCode = typeof card === 'object' ? card.setCode : null;
          
          return (
            <div key={index} className="card-result-item">
              <div className="card-name">
                {cardName}
                {setCode && <span className="set-code"> ({setCode.toUpperCase()})</span>}
              </div>
              {cardInfo ? (
                <div className="card-info">
                  <p>Found in database</p>
                  {cardInfo.type && <p>Type: {cardInfo.type}</p>}
                  {cardInfo.manaCost && <p>Mana Cost: {cardInfo.manaCost}</p>}
                  {cardInfo.text && <p className="card-text">{cardInfo.text}</p>}
                </div>
              ) : (
                <div className="card-info not-found">
                  <p>Not found in database</p>
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
