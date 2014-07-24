
var CommentDisplay = require('./comment-display.jsx')
var PT = React.PropTypes

var CreateComment = React.createClass({
  propTypes: {
    onHide: React.PropTypes.oneOfType([
        PT.bool, PT.func
    ]),
    target: React.PropTypes.string.isRequired,
    db: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      text: ''
    }
  },

  _onSubmit: function (text) {
    if (!text) return
    this.props.db.addComment(text, this.props.target, false)
    this.props.onHide && this.props.onHide()
  },

  render: function () {
    return CommentDisplay({
      canEdit: true,
      editing: true,
      creating: true,
      data: {
        picture: this.props.user.picture,
        displayName: this.props.user.displayName,
        text: '',
      },
      userid: this.props.user.uid,

      onLogout: this.props.db.logout.bind(this.props.db),
      cancelEdit: this.props.onHide,
      doneEditing: this._onSubmit,
      onRemove: this.props.onHide
    })
  }
});

module.exports = CreateComment

