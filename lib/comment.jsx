
var CommentDisplay = require('./comment-display.jsx')

var Comment = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    canEdit: React.PropTypes.bool.isRequired,
    userid: React.PropTypes.string.isRequired,
    db: React.PropTypes.object,
  },

  getInitialState: function () {
    return {
      editing: false
    }
  },

  onRemove: function () {
    this.props.db.removeComment(this.props.data._id)
  },

  onEdit: function () {
    this.setState({editing: true})
  },

  onClearVote: function () {
    this.props.db.clearVote(this.props.data._id, this.props.userid)
  },

  onDownvote: function (erase) {
    this.props.db.downVote(this.props.data._id, this.props.userid)
  },

  onUpvote: function () {
    this.props.db.upVote(this.props.data._id, this.props.userid)
  },

  onFlag: function (flag) {
    this.props.db.flag(this.props.data._id, this.props.userid, flag)
  },

  doneEditing: function (text) {
    if (!this.state.editing) return
    if (!text) return
    this.props.db.editComment(this.props.data._id, text)
    this.setState({editing: false})
  },

  render: function () {
    return CommentDisplay({
      editing: this.state.editing,
      canEdit: this.props.canEdit,
      canVote: this.props.canVote,
      data: this.props.data,
      userid: this.props.userid,

      onEdit: this.onEdit,
      onFlag: this.onFlag,
      doneEditing: this.doneEditing,
      onRemove: this.onRemove,
      onUpvote: this.onUpvote,
      onDownvote: this.onDownvote,
      onClearVote: this.onClearVote
    })
  }
});

module.exports = Comment;
