import { useEffect, useState } from 'react';
import axios from 'axios';

function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [hasMore, sethasMore] = useState(true);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: {
        q: query,
        page: pageNumber
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c))
    })
      .then((res) => {
        console.log(res.data);
        setBooks((prevBook) => {
          return [
            ...new Set([...prevBook, ...res.data.docs.map((b) => b.title)])
          ];
        });
        sethasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(e);
      });
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}

export default useBookSearch;
