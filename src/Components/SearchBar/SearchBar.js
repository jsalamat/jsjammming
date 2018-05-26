import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  //70a create a contstructor method with a call to super(props)
  constructor(props) {
    super(props);
    //70b bind the current value of this to .search()
    this.search = this.search.bind(this);
    //72 bind the current value of this to this.handleTermChange
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search() {
    //69 create a method called search that passes the state of the term to this.props.onSearch
    this.props.onSearch(this.state.term)
  }

  handleTermChange(event) {
    //71a Accepts an event argument
    this.setState({term: event.target.value});
    //71b Sets the state of the search bar's term to the event target's value.
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <a>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
