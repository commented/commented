
var format = require('./format')
  , AutoTextarea = require('./auto-textarea.jsx')
  , cx = React.addons.classSet

var CommentDisplay = React.createClass({
  propTypes: {
    editing: React.PropTypes.bool.isRequired,
    canEdit: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired,

    onEdit: React.PropTypes.func,
    doneEditing: React.PropTypes.func,
    onRemove: React.PropTypes.func,

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

  doneEditing: function () {
    this.props.doneEditing(this.state.text)
  },

  onChange: function (e) {
    this.setState({text: e.target.value});
  },

  voteButtons: function () {
    if (!this.props.canVote) return
    var upVoted = false
      , downVoted = false
      , flagged = this.props.data.flags && this.props.data.flags[this.props.userid]

    switch (this.props.data.votes && this.props.data.votes[this.props.userid]) {
      case true:
        upVoted = true; break;
      case false:
        downVoted = true; break;
      default: break;
    }

    return <div className='commented_buttons'>
      <span
        onClick={this.props.onFlag.bind(null, !flagged)}
        className={cx({
          "commented_flag": true,
          "commented_flag--active": flagged
        })}>
        <i className="fa fa-flag"/>
      </span>
      <span
        onClick={downVoted ? this.props.onClearVote : this.props.onDownvote}
        className={cx({
          "commented_down": true,
          "commented_down--active": downVoted
        })}>
        <i className="fa fa-thumbs-o-down"/>
      </span>
      <span
        onClick={upVoted ? this.props.onClearVote : this.props.onUpvote}
        className={cx({
          "commented_up": true,
          "commented_up--active": upVoted
        })}>
        <i className="fa fa-thumbs-o-up"/>
      </span>
    </div>;
  },

  buttons: function () {
    if (!this.props.canEdit) {
      return this.voteButtons()
    }
    return <div className='commented_buttons'>
      {this.props.editing ?
        <span onClick={this.doneEditing} className="commented_done-edit">
          <i className="fa fa-check"/>
        </span> :
        <span onClick={this.props.onEdit} className="commented_edit">
          <i className="fa fa-pencil"/>
        </span>}
      <span onClick={this.props.onRemove} className="commented_remove">
        <i className="fa fa-times"/>
      </span>
    </div>;
  },

  body: function () {
    if (!this.props.editing) return format(this.props.data.text, "text")
    return <AutoTextarea
      onChange={this.onChange}
      value={this.state.text}/>
  },

  render: function () {
    var comment = this.props.data
      , cls = "commented_comment"
    if (this.props.editing) {
      cls += ' commented_comment--editing'
    }
    return <div className={cls}>
      <img className="commented_pic" src={comment.picture}/>
      <div className="right">
        {this.buttons()}
        <strong className="display-name">{comment.displayName}</strong>
        {comment.created && // TODO have this time auto-update
          <span className="display-time">{moment(comment.created).fromNow()}</span>}
        {this.body()}
      </div>
    </div>;
  }
});

module.exports = CommentDisplay
