import { useState, useMemo } from 'react';
import './CardListInput.css';

// Utility function to parse card list
const parseCardList = (cardListText) => {
  return cardListText
    .split('\n')
    .map(card => card.trim())
    .filter(card => card.length > 0)
    .map(card => {
      // Check for foil designation (*F* at the end)
      const isFoil = card.includes('*F*');
      const cardWithoutFoil = card.replace(/\s*\*F\*\s*$/, '').trim();
      
      // Check for pipe format: "Card Name | SET"
      if (cardWithoutFoil.includes('|')) {
        const parts = cardWithoutFoil.split('|').map(part => part.trim());
        // Remove leading quantity like "1x " or "2 "
        const nameWithoutQuantity = parts[0].replace(/^\d+x?\s+/, '');
        return {
          name: nameWithoutQuantity,
          setCode: parts[1] || null,
          isFoil,
          rawInput: card
        };
      }
      
      // Check for collection format: "1 Card Name (set) number" or "1x Card Name (set) number *F*"
      const collectionMatch = cardWithoutFoil.match(/^(\d+x?\s+)?(.+?)\s+\(([^)]+)\)\s*(\d+)?/);
      if (collectionMatch) {
        return {
          name: collectionMatch[2].trim(),
          setCode: collectionMatch[3].trim().toUpperCase(),
          isFoil,
          rawInput: card
        };
      }
      
      // If no format matches, try to remove quantity prefix anyway
      const nameWithoutQuantity = cardWithoutFoil.replace(/^\d+x?\s+/, '');
      return {
        name: nameWithoutQuantity,
        setCode: null,
        isFoil,
        rawInput: card
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
        Enter one card per line. Supports multiple formats:
        <br />• Card Name | SET
        <br />• 1 Card Name (SET) number
        <br />• 1x Card Name (SET) number *F* (foil)
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="card-textarea"
          value={cardList}
          onChange={(e) => setCardList(e.target.value)}
          placeholder="Lightning Bolt | LEA
1 Avatar's Wrath (TLA) 12
1x Haliya, Guided by Light (EOE) 19
1 The Rise of Sozin (TLA) 117 *F*"
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
