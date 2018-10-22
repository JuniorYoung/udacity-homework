import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Books from './Books'

/**
 * 书架组件
 */
class BookShelf extends Component {
    static propTypes = {
        bookShelfs: PropTypes.array.isRequired,
        onMoveBook: PropTypes.func.isRequired
    }
    render() {
        const { bookShelfs, onMoveBook } = this.props;
        return (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        {bookShelfs.map((bookShelf) => (
                            <div className="bookshelf" key={bookShelf.id}>
                                <h2 className="bookshelf-title">{bookShelf.title}</h2>
                                <div className="bookshelf-books">
                                    <ol className="books-grid">
                                        {bookShelf.books.map( (book) => (
                                            <li key={book.id}>
                                                <Books
                                                    book={book}
                                                    onMoveBook={onMoveBook}
                                                />
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="open-search">
                    <Link to="/search">Add a book</Link>
                </div>
            </div>
        )

    }
}

export default BookShelf