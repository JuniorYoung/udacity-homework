import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import BookShelf from './BookShelf'
import SearchBook from './SearchBook'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends Component {
  state = {
    currentlyReading: {
      id: 'currentlyReading',
      title: 'Currently Reading',
      books: []
    }, //当前阅读
    wantToRead: {
      id: 'wantToRead',
      title: 'Want to Read',
      books: []
    },//想要阅读
    read: {
      id: 'read',
      title: 'Read',
      books: []
    } //已经阅读
  }
  componentDidMount() {
    //发出请求
    BooksAPI.getAll().then((books) => {
      let { allBooks, currentlyReading, wantToRead, read } = this.state;
      books.map((book) => {
        const _bs = book.shelf;
        if (_bs) {
          if (_bs === 'currentlyReading') {
            currentlyReading.books.push(book);
          } else if (_bs === 'wantToRead') {
            wantToRead.books.push(book);
          } else if (_bs === 'read') {
            read.books.push(book);
          }
        }
      });
      const _newState = { currentlyReading, wantToRead, read };
      this.setState(_newState);
    });
  }
  /**
   * 移动至其他书架
   * book [Object]
   * toShelf [String]
   */
  moveToOtherShelf = (handleBook, toShelf) => {
    const fromShelf = handleBook.shelf;
    const bookid = handleBook.id;
    BooksAPI.update(handleBook, toShelf).then((resp) => {
      //更新状态
      this.setState((prevState) => {
        if(fromShelf && fromShelf !== 'none') {
          //旧书架移除
          prevState[fromShelf].books.find((book, index) => {
            if (book.id === bookid) {
              prevState[fromShelf].books.splice(index, 1);
              return true;
            }
          })
        }
        //新书架添加
        if (toShelf !== 'none') {
          handleBook.shelf = toShelf;
          prevState[toShelf].books.push(handleBook);
        }
        return prevState;
      });
    });
  }

  render() {
    const _state = this.state;
    const allBooks = _state.currentlyReading.books.concat(_state.wantToRead.books).concat(_state.read.books);
    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <BookShelf
            bookShelfs={[this.state.currentlyReading, this.state.wantToRead, this.state.read]}
            onMoveBook={this.moveToOtherShelf}
          />
        )} />
        <Route path="/search" render={() => (
          <SearchBook
            shelfBooks={allBooks}
            onMoveBook={this.moveToOtherShelf}
          />
        )} />
      </div>
    )
  }
}

export default BooksApp
