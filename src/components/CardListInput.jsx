import { useState, useMemo } from 'react';
import './CardListInput.css';

// Utility function to parse card list
const parseCardList = (cardListText) => {
  return cardListText
    .split('\n')
    .map(card => card.trim())
    .filter(card => card.length > 0);
};

const CardListInput = ({ onCardsSubmit }) => {
  const [cardList, setCardList] = useState('');

  // Memoize card count to avoid recalculation on every render
  const cardCount = useMemo(() => parseCardList(cardList).length, [cardList]);

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
        Enter one card per line. You can paste a list from your collection or deck.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="card-textarea"
          value={cardList}
          onChange={(e) => setCardList(e.target.value)}
          placeholder="Example:&#10;Lightning Bolt&#10;Black Lotus&#10;Counterspell&#10;Sol Ring"
          rows={15}
        />
        <div className="button-group">
          <button type="submit" className="submit-btn">
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
