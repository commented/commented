
var Login = require('./login.jsx')

var ReplyLogin = React.createClass({
  propTypes: {
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired,
    onCancel: React.PropTypes.func,
    onReply: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      open: false
    }
  },
  onOpen: function () {
    this.props.onReply()
    this.setState({open: true})
  },
  onCancel: function () {
    this.props.onCancel()
    this.setState({open: false})
  },
  render: function () {
    return <span className='commented_reply-login'>
      {this.state.open ?
        <Login
          db={this.props.db}
          auth={this.props.auth}
          onLogin={this.props.onReply}
          onCancel={this.onCancel}
        /> :
        <span onClick={this.onOpen} className="commented_reply">reply</span>
      }
    </span>
  },
})

module.exports = ReplyLogin
