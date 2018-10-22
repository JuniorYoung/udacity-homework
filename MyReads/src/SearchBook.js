import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Books from './Books'
import PropTypes from 'prop-types'
import * as BooksAPI from './BooksAPI'

/**
 * 查询页面组件
 */
class SearchBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allBooks: []
        };
    }
    static propTypes = {
        shelfBooks: PropTypes.array.isRequired,
        onMoveBook: PropTypes.func.isRequired
    }
    /**
   * 根据关键字搜索
   * query [String]
   */
    searchByKey = (query) => {
        const shelfBooks = this.props.shelfBooks;//已在书架的书籍
        if (query) {
            BooksAPI.search(query).then((books) => {
                if (Array.isArray(books)) {
                    this.setState({
                        allBooks: books.map((book) => {
                            const _shelfed = shelfBooks.find((shelfBook) => shelfBook.id === book.id);
                            if (_shelfed) {
                                book.shelf = _shelfed.shelf;
                            }
                            return book;
                        })
                    })
                } else {
                    this.setState({allBooks: []});
                }
            });
        }
    }
    render() {
        const { onMoveBook } = this.props;
        const allBooks = this.state.allBooks;
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to="/" className="close-search">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            onChange={(event) => this.searchByKey(event.target.value)}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    {allBooks.length === 0 && (
                        <div className="search-noresults">
                            <span>no result</span>
                        </div>
                    )}
                    {allBooks.length !== 0 && (
                        <ol className="books-grid">
                            {this.state.allBooks.map((book) => (
                                <li key={book.id}>
                                    <Books
                                        book={book}
                                        onMoveBook={onMoveBook}
                                    />
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        )
    }
}

export default SearchBook