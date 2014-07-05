
var AutoTextarea = require('./auto-textarea.jsx')
var CommentDisplay = require('./comment-display.jsx')

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

  _onSubmit: function (text) {
    if (!text) return
    this.props.db.addComment(text, 'main', false)
    this.props.onHide()
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

      onLogout: this.props.db.logout.bind(this.props.db),
      cancelEdit: this.props.onHide,
      doneEditing: this._onSubmit,
      onRemove: this.props.onHide
    })
  }
});

module.exports = CreateComment

