import { useState } from 'react';
import './CardListInput.css';

const CardListInput = ({ onCardsSubmit }) => {
  const [cardList, setCardList] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardList.trim()) {
      // Split by newlines and filter out empty lines
      const cards = cardList
        .split('\n')
        .map(card => card.trim())
        .filter(card => card.length > 0);
      
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
        Cards entered: {cardList.split('\n').filter(line => line.trim().length > 0).length}
      </p>
    </div>
  );
};

export default CardListInput;
