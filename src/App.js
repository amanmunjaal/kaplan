import { useState, useEffect } from 'react';
import './App.scss';

function App() {
  const [books, setBooks] = useState('');
  const [text, setText] = useState('');
  const [modal, setModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    authors: ''
  })

  useEffect(() => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=kaplan%20test%20prep`)
      .then(response => response.json())
      .then(result =>
        checkStatus(result.items),
      );
  }, []);
  const startFetch = () => {
    if (text === '') {
      alert('Please enter text to search')
    }
    else {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}`)
        .then(response => response.json())
        .then(result =>
          checkStatus(result.items),
        );
    }

  }
  const create = () => {
    setModal(true);
  }
  const handleInputChange = event => {
    setText(event.target.value)

  };
  const handleFormInputChange = event => {
    const { name, value } = event.target;
    setNewItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  const createNewBook = () => {
    localStorage.setItem('book', JSON.stringify(newItem));
    setModal(false)
    alert(`Created new book with name: ${newItem.title} and author: ${newItem.authors}`)
  }

  const checkStatus = (data) => {
    setBooks(data);
  }

  return (
    <div className="book-search">
      <header>
        <h1>Books</h1>
      </header>

      <input type="textbox" placeholder="Search" value={text} onChange={handleInputChange} />
      <h3>All books</h3>
      <div className="button-set">
        <button onClick={() => startFetch()}>Search</button>
        <button onClick={() => create()}>Create book</button>
      </div>

      <div className="book-list">
        {books !== '' ?
          books.map((element, index) => {
            return (
              <ListItem key={index} item={element?.volumeInfo} />
            )
          })

          : <p>No Results</p>}
      </div>
      {modal &&
        <div className="book-modal">
          <p>Title</p>
          <input placeholder="title" name="title" onChange={handleFormInputChange} />
          <p>Author</p>
          <input placeholder="author" name="authors" onChange={handleFormInputChange} />
          <div className="modal-button-set">
            <button onClick={() => createNewBook()}>Create Now</button>
            <button onClick={() => setModal(false)}>Cancel</button>
          </div>

        </div>
      }
    </div>
  );
}

const ListItem = (props) => {
  return (
    <div className="list-item">
      <p className="book-title">{props.item.title}</p>
      <p>Authors: {props.item.authors && props.item.authors[0]}</p>
      <p>Publisher: {props.item.publisher}</p>
      <p>Published Date: {props.item.publishedDate}</p>
    </div>
  )
}

export default App;
