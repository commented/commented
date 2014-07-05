
var CreateComment = React.createClass({
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    db: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      text: ''
    }
  },
  _onChange: function (e) {
    this.setState({text: e.target.value})
  },
  _onSubmit: function () {
    this.props.db.addComment(this.state.text, 'main', false)
    this.setState({text: ''})
    this.props.onHide()
  },
  render: function () {
    return <div className="commented_create">
      <img className="commented_pic" src={this.props.user.picture}/>
      <div className="right">
        <textarea value={this.state.text} onChange={this._onChange}/>
        <button onClick={this._onSubmit}>Add</button>
      </div>
    </div>;
  }
});

module.exports = CreateComment

