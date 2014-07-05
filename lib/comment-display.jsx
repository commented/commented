
var format = require('./format')
  , AutoTextarea = require('./auto-textarea.jsx')
  , cx = React.addons.classSet

var CommentDisplay = React.createClass({
  propTypes: {
    editing: React.PropTypes.bool.isRequired,
    canEdit: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired,
    isReply: React.PropTypes.bool,

    onEdit: React.PropTypes.func,
    doneEditing: React.PropTypes.func,
    onRemove: React.PropTypes.func,

    onReply: React.PropTypes.func,
    onUpvote: React.PropTypes.func,
    onDownvote: React.PropTypes.func,
    onClearVote: React.PropTypes.func,
    onFlag: React.PropTypes.func,
  },

  getInitialState: function () {
    return {
      text: this.props.data.text,
    }
  },

  cancelEdit: function () {
    this.setState({text: this.props.data.text})
    this.props.cancelEdit()
  },

  doneEditing: function () {
    this.props.doneEditing(this.state.text)
  },

  onChange: function (e) {
    this.setState({text: e.target.value});
  },

  getVotes: function () {
    var votes = {
      up: false,
      upCount: 0,
      down: false,
      downCount: 0,
      flagged: this.props.data.flags && this.props.data.flags[this.props.userid],
      flagCount: 0
    }

    switch (this.props.data.votes && this.props.data.votes[this.props.userid]) {
      case true:
        votes.up = true; break;
      case false:
        votes.down = true; break;
      default: break;
    }
    for (var id in this.props.data.votes) {
      if (this.props.data.votes[id]) {
        votes.upCount += 1
      } else {
        votes.downCount += 1
      }
    }
    for (var id in this.props.data.flags) {
      if (this.props.data.flags[id]) {
        votes.flagCount += 1
      }
    }
    return votes
  },

  voteButtons: function (votes) {
    if (!this.props.canVote) return

    return <div className='commented_buttons'>
      <span
        onClick={this.props.onFlag.bind(null, !votes.flagged)}
        className={cx({
          "button commented_flag": true,
          "commented_flag--active": votes.flagged
        })}>
        <i className="fa fa-flag"/>
      </span>
      <span
        onClick={votes.down ? this.props.onClearVote : this.props.onDownvote}
        className={cx({
          "button commented_down": true,
          "commented_down--shown shown": !!votes.downCount,
          "commented_down--active active": votes.down
        })}>
        <span className="count">{votes.downCount}</span>
        <i className="fa fa-thumbs-o-down"/>
      </span>
      <span
        onClick={votes.up ? this.props.onClearVote : this.props.onUpvote}
        className={cx({
          "button commented_up": true,
          "commented_up--shown shown": !!votes.upCount,
          "commented_up--active active": votes.up
        })}>
        <span className="count">{votes.upCount}</span>
        <i className="fa fa-thumbs-o-up"/>
      </span>
      {!this.props.isReply && <span onClick={this.props.onReply} className="commented_reply">reply</span>}
    </div>;
  },

  editButtons: function () {
    return <div className="commented_buttons">
      <span onClick={this.doneEditing} className="commented_done-edit button">
        save
      </span>
      <span onClick={this.cancelEdit} className="commented_remove button">
        cancel
      </span>
    </div>
  },

  buttons: function (votes) {
    if (!this.props.canEdit) {
      return this.voteButtons(votes)
    }
    if (this.props.editing) {
      return this.editButtons()
    }
    return <div className='commented_buttons'>
      <span onClick={this.props.onEdit} className="commented_edit button">
        <i className="fa fa-pencil"/>
      </span>
      <span onClick={this.props.onRemove} className="commented_remove button">
        <i className="fa fa-times"/>
      </span>
      {!this.props.isReply && <span onClick={this.props.onReply} className="commented_reply">reply</span>}
    </div>;
  },

  body: function () {
    if (!this.props.editing) {
      return format(this.props.data.text, "text")
    }
    return <AutoTextarea
      placeholder="Type your comment here"
      onChange={this.onChange}
      value={this.state.text}/>
  },

  render: function () {
    var comment = this.props.data
      , cls = "commented_comment"
    if (this.props.editing) {
      cls += ' commented_comment--editing'
    }
    if (this.props.isReply) {
      cls += ' commented_comment--reply'
    }
    if (this.props.hasReplies) {
      cls += ' commented_comment--has-replies'
    }

    var votes = this.getVotes()
    if (votes.flagCount > 2 && this.props.userid !== this.props.data.userid) {
      return <div className={cls + " commented_comment--flagged"}>
        <span className="commented_pic fa-stack fa-lg">
          <i className="fa fa-circle fa-stack-2x"></i>
          <i className="fa fa-flag fa-stack-1x fa-inverse"></i>
        </span>
        <span className="display-name">
          flagged comment hidden
        </span>
      </div>
    }

    return <div className={cls}>
      <img className="commented_pic" src={comment.picture}/>
      <div className="right">
        {this.buttons(votes)}
        <strong className="display-name">{comment.displayName}</strong>
        {comment.created && // TODO have this time auto-update
          <span className="display-time">{moment(comment.created).fromNow()}</span>}
        {this.props.parentDeleted &&
          <span className="parent-deleted">in reply to a deleted comment</span>}
        {this.body()}
      </div>
    </div>;
  }
});

module.exports = CommentDisplay
