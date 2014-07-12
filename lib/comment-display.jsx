
var format = require('./format')
  , AutoTextarea = require('./auto-textarea.jsx')
  , ReplyLogin = require('./reply-login.jsx')
  , cx = React.addons.classSet
  , SlideDown = require('./slide-down.js')

var CommentDisplay = React.createClass({
  mixins: [SlideDown],
  getSlide: function () {
    return {
      duration: .3,
      closeHeight: this.props.creating && !this.props.isReply ? 30 : 0
    }
  },
  propTypes: {
    editing: React.PropTypes.bool.isRequired,
    canEdit: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired,
    creating: React.PropTypes.bool,
    isReply: React.PropTypes.bool,

    onEdit: React.PropTypes.func,
    doneEditing: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onLogout: React.PropTypes.func,

    onReply: React.PropTypes.func,
    onHeart: React.PropTypes.func,
    onUnHeart: React.PropTypes.func,
    onFlag: React.PropTypes.func,
  },

  getInitialState: function () {
    return {
      text: this.props.data.text,
    }
  },

  onLogout: function () {
    this.slideAway(this.props.onLogout)
  },

  onRemove: function () {
    this.slideAway(this.props.onRemove)
  },

  cancelEdit: function () {
    this.setState({text: this.props.data.text})
    if (this.props.creating) {
      this.slideAway(this.props.cancelEdit)
    } else {
      this.props.cancelEdit();
    }
  },

  doneEditing: function () {
    if (this.props.creating) {
      this.slideAway(this.props.doneEditing.bind(null, this.state.text))
    } else {
      this.props.doneEditing(this.state.text)
    }
  },

  onChange: function (e) {
    this.setState({text: e.target.value});
  },

  getVotes: function () {
    var votes = {
      heart: false,
      heartCount: 0,
      flagged: this.props.data.flags && this.props.data.flags[this.props.userid],
      flagCount: 0
    }

    if (this.props.data.votes && this.props.data.votes[this.props.userid]) {
      votes.heart = true
    }
    for (var id in this.props.data.votes) {
      votes.heartCount += 1
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
        onClick={votes.heart ? this.props.onUnHeart : this.props.onHeart}
        className={cx({
          "button commented_heart": true,
          "commented_heart--shown shown": !!votes.heartCount,
          "commented_heart--active active": votes.heart
        })}>
        <span className="count">{votes.heartCount}</span>
        <i className="fa fa-heart"/>
      </span>
      {!this.props.isReply && <span onClick={this.props.onReply} className="commented_reply">reply</span>}
    </div>;
  },

  editButtons: function () {
    return <div className="commented_buttons">
      <span onClick={this.doneEditing} className="commented_done-edit button">
        {this.props.creating ? 'post' : 'save'}
      </span>
      <span onClick={this.cancelEdit} className="commented_remove button">
        cancel
      </span>
    </div>
  },

  replyLogin: function () {
    if (this.props.isReply) return false
    return <div className="commented_buttons">
      <ReplyLogin
        db={this.props.db}
        auth={this.props.db.options.auth}
        onCancel={this.props.cancelReply}
        onReply={this.props.onReply}/>
    </div>
  },

  buttons: function (votes) {
    if (!this.props.userid) {
      return this.replyLogin()
    }
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
      <span onClick={this.onRemove} className="commented_remove button">
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
    if (this.props.canEdit) {
      cls += ' commented_comment--mine'
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
        {this.props.creating &&
          <button className="commented_logout" onClick={this.onLogout}>logout</button>}
        {this.body()}
      </div>
    </div>;
  }
});

module.exports = CommentDisplay
