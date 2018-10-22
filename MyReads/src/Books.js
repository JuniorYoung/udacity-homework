import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Books extends Component {
    constructor(props) {
        super(props);
        const book = this.props.book;
        this.state = {
            shelf: book.shelf ? book.shelf : 'none'
        };
    }
    static propTypes = {
        book: PropTypes.object.isRequired,
        onMoveBook: PropTypes.func.isRequired
    }
    render() {
        const {book, onMoveBook} = this.props;
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks ? book.imageLinks.smallThumbnail : ''})` }}></div>
                    <div className="book-shelf-changer">
                        <select onChange={(event) => {
                            const _shelf = event.target.value;
                            this.setState({shelf: _shelf})
                            onMoveBook(book, _shelf);
                        }} value={this.state.shelf}>
                            <option disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{book.title}</div>
                {book.authors && (
                    <div className="book-authors" dangerouslySetInnerHTML={{__html: book.authors.join('<br>')}}></div>
                )}
            </div>
        )
    }
}

export default Books