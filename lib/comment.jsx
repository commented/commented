
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
      editing: false,
      replying: false,
    }
  },

  onRemove: function () {
    this.props.db.removeComment(this.props.data._id)
  },

  onEdit: function () {
    this.setState({editing: true})
  },

  onReply: function () {
    if (this.props.isReply) return
    this.setState({editing: false, replying: true});
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

  doneReplying: function (text) {
    if (!this.state.replying) return
    if (!text) return
    this.props.db.addComment(text, "reply:" + this.props.data._id, '')
    this.setState({replying: false})
  },

  cancelReply: function () {
    this.setState({replying: false})
  },
  
  renderReplies: function () {
    var replies = this.props.replies
    if (!replies.length && !this.state.replying) {
      return false
    }
    var user = this.props.user
    return <div className="commented_replies">
      {replies.map(function (comment) {
        return Comment({
          key: comment._id,
          isReply: true,
          replies: [],
          canEdit: user && user.uid == comment.userid,
          canVote: !!user,
          userid: user && user.uid,
          data: comment,
          user: user,
          db: db,
        })
      }.bind(this))}
      {this.state.replying && CommentDisplay({
        editing: true,
        canEdit: true,
        canVote: false,
        data: {
          picture: this.props.user.picture,
          displayName: this.props.user.displayName,
          text: ''
        },
        userid: this.props.userid,
        isReply: true,

        doneEditing: this.doneReplying,
        onRemove: this.cancelReply
      })}
  },

  render: function () {
    return <div className="commented_one">
      {CommentDisplay({
        editing: this.state.editing,
        canEdit: this.props.canEdit,
        canVote: this.props.canVote,
        data: this.props.data,
        isReply: this.props.isReply,
        userid: this.props.userid,

        onEdit: this.onEdit,
        onFlag: this.onFlag,
        onReply: !this.props.isReply && this.onReply,
        onRemove: this.onRemove,
        onUpvote: this.onUpvote,
        onDownvote: this.onDownvote,
        onClearVote: this.onClearVote,
        doneEditing: this.doneEditing,
      })}
      {this.renderReplies()}
    </div>
  }
});

module.exports = Comment;
