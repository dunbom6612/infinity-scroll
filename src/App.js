import './App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState('');
  const { books, error, loading, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleOnChange(e) {
    setPageNumber(1);
    setQuery(e.target.value);
  }

  useEffect(() => {}, [query]);

  return (
    <div className="app">
      <input type="text" value={query} onChange={handleOnChange}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book} className="book-item">
              {book}
            </div>
          );
        } else {
          return (
            <div key={book} className="book-item">
              {book}
            </div>
          );
        }
      })}
      {error && <div className="error">Error</div>}
      {loading && <div className="loading">...Loading</div>}
    </div>
  );
}

export default App;
