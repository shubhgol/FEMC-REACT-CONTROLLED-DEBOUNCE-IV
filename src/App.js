import { useEffect, useState, useRef, useMemo } from "react";
import "./styles.css";
import useDebounce from "./useDebounce";

const debounce = (callback, wait) => {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

export default function App() {
  /**
   * 1. Load books from books.json using fetch api
   * 2. Render options
   * 3. User can search books either by name or author
   * 4. The search filter is applied based on the selected value from the dropdown
   * 5. The search filter should be applied as user types in the search box.
   */
  // const books = useRef([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("author");

  const onChangeHandler = (value) => {
    setSearchQuery(value);
  };

  const debounceOnChangeHandler = debounce(onChangeHandler, 500);

  const selectOnChangeHandler = (e) => {
    setSearchBy(e.target.value);
  };

  // const searchHandler = () => {
  //   const searchText = searchQuery.trim();
  //   if (!searchText) {
  //     setData(books.current);
  //   } else {
  //     const filterData = books.current.filter((books) => {
  //       return (
  //         books[searchBy].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
  //       );
  //     });
  //     setData(filterData);
  //   }
  // };

  useEffect(() => {
    async function fetchBookData() {
      const response = await fetch("books.json");
      const data = await response.json();
      if (data?.books) {
        // books.current = data.books;
        setData(data.books);
      }
    }
    fetchBookData();
  }, []);

  // useDebounce(searchHandler, 500, [searchBy, searchQuery]);

  const filterData = useMemo(() => {
    const searchText = searchQuery.trim();
    return data.filter((book) => {
      if (!searchText) return book;
      else
        return (
          book[searchBy].toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
    });
  }, [searchQuery, searchBy, data]);

  return (
    <div className="App">
      <form>
        <input
          type="text"
          onChange={(e) => debounceOnChangeHandler(e.target.value)}
        />
        <select value={searchBy} onChange={selectOnChangeHandler}>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </form>
      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {filterData.map((book, index) => {
            const { title, author } = book;
            return (
              <tr key={`${title}_${index}`}>
                <td>{title}</td>
                <td>{author}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
