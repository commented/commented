
var Login = require('./login.jsx')
  , CreateComment = require('./create-comment.jsx')

var AddComment = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    autoAdd: React.PropTypes.bool,
  },
  getInitialState: function () {
    return {
      adding: false
    }
  },
  onShow: function () {
    this.setState({adding: true});
  },
  onHide: function () {
    this.setState({adding: false});
  },
  render: function () {
    if (!this.state.adding && !this.props.autoAdd) {
      return <div className="add-comment" onClick={this.onShow}>
        Add a comment
      </div>
    }
    if (!this.props.user) {
      return <Login db={this.props.db} auth={this.props.auth}/>
    }
    return <CreateComment
      onHide={this.onHide}
      target={this.props.target}
      db={this.props.db}
      user={this.props.user}/>
  }
});

module.exports = AddComment
