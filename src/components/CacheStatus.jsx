import './CacheStatus.css';

const CacheStatus = ({ cacheInfo, onClearCache }) => {
  return (
    <div className="cache-status">
      <h3>Cache Status</h3>
      <div className="status-info">
        <span className={`status-indicator ${cacheInfo.isValid ? 'valid' : 'invalid'}`}>
          {cacheInfo.isValid ? '✓ Cache Valid' : '✗ No Valid Cache'}
        </span>
        {cacheInfo.cachedDate && (
          <p>Cached on: {cacheInfo.cachedDate}</p>
        )}
        <p>Current date: {cacheInfo.currentDate}</p>
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
