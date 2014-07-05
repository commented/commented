/** @jsx React.DOM */

var Commented = React.createClass({
  propTypes: {
    firebase: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    auth: React.PropTypes.array.isRequired
  },
  getInitialState: function () {
    return {
      loaded: false,
      comments: [],
      auth: null
    }
  },
  componentDidMount: function () {
    this.

  },
  render: function () {
  },
})

module.exports = Commented

