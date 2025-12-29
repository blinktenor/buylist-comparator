import './CardResults.css';

const CardResults = ({ cards, mtgData }) => {
  if (!cards || cards.length === 0) {
    return null;
  }

  const getCardInfo = (cardName) => {
    if (!mtgData || !mtgData.data) {
      return null;
    }
    
    // Search for card in the data
    // MTG JSON AtomicCards uses card names as keys
    return mtgData.data[cardName];
  };

  return (
    <div className="card-results">
      <h2>Card Results ({cards.length} cards)</h2>
      <div className="results-list">
        {cards.map((cardName, index) => {
          const cardInfo = getCardInfo(cardName);
          return (
            <div key={index} className="card-result-item">
              <div className="card-name">{cardName}</div>
              {cardInfo ? (
                <div className="card-info">
                  <p>Found in database</p>
                  {cardInfo[0] && (
                    <>
                      {cardInfo[0].type && <p>Type: {cardInfo[0].type}</p>}
                      {cardInfo[0].manaCost && <p>Mana Cost: {cardInfo[0].manaCost}</p>}
                      {cardInfo[0].text && <p className="card-text">{cardInfo[0].text}</p>}
                    </>
                  )}
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
