import { useState, useMemo } from 'react';
import './CardListInput.css';

// Utility function to parse card list
const parseCardList = (cardListText) => {
  return cardListText
    .split('\n')
    .map(card => card.trim())
    .filter(card => card.length > 0)
    .map(card => {
      // Check for pipe format: "Card Name | SET"
      if (card.includes('|')) {
        const parts = card.split('|').map(part => part.trim());
        return {
          name: parts[0],
          setCode: parts[1] || null
        };
      }
      
      // Check for collection format: "1x Card Name (set) number [tags]"
      const collectionMatch = card.match(/^(\d+x\s+)?(.+?)\s+\(([^)]+)\)/);
      if (collectionMatch) {
        return {
          name: collectionMatch[2].trim(),
          setCode: collectionMatch[3].trim().toLowerCase()
        };
      }
      
      // If no format matches, return just the card name with no set
      return {
        name: card,
        setCode: null
      };
    });
};

const CardListInput = ({ onCardsSubmit }) => {
  const [cardList, setCardList] = useState('');

  // Memoize card count to avoid recalculation on every render
  const cardCount = useMemo(() => parseCardList(cardList).length, [cardList]);

  // Check if all cards have set codes
  const allCardsHaveSetCodes = useMemo(() => {
    if (!cardList.trim()) return false;
    const cards = parseCardList(cardList);
    return cards.length > 0 && cards.every(card => card.setCode !== null);
  }, [cardList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardList.trim()) {
      const cards = parseCardList(cardList);
      onCardsSubmit(cards);
    }
  };

  const handleClear = () => {
    setCardList('');
  };

  return (
    <div className="card-list-input">
      <h2>Enter Your Card List</h2>
      <p className="instructions">
        Enter one card per line. Supports two formats:
        <br />• Card Name | SET
        <br />• 1x Card Name (set) number [tags]
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="card-textarea"
          value={cardList}
          onChange={(e) => setCardList(e.target.value)}
          placeholder="Lightning Bolt | LEA
Black Lotus | LEA
1x Amonkhet Raceway (dft) 248
1x Umbral Collar Zealot (eoe) 395"
          rows={15}
        /> 
        <div className="button-group">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={!allCardsHaveSetCodes}
            title={!allCardsHaveSetCodes ? "All cards must have a set code (e.g., Card Name | SET)" : "Process the card list"}>
            Process Cards
          </button>
          <button type="button" onClick={handleClear} className="clear-btn">
            Clear
          </button>
        </div>
      </form>
      <p className="card-count">
        Cards entered: {cardCount}
      </p>
    </div>
  );
};

export default CardListInput;
