
var mixing = require('./mixin')
  , Comment = require('./comment.jsx')
  , ShowAller = require('./show-aller.jsx')
  , AddComment = require('./add-comment.jsx')

var MainComments = React.createClass({
  mixins: [mixing],
  propTypes: {
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired
  },
  getInitialState: function () {
    return {
      showAll: false,
      loading: !this.props.db.loaded
    }
  },

  componentDidMount: function () {
    this.props.db.onLogin(this._onLogin)
    if (!this.props.db.loaded) {
      this.props.db.onceLoaded(this._onLoaded)
    }
  },

  componentWillUnmount: function () {
    this.props.db.offLogin(this._onLogin)
  },

  _onLoaded: function () {
    this.setState({loading: false})
  },

  _onChangeShow: function (which) {
    this.setState({
      showAll: which
    })
  },

  organizeComments: function () {
    var ids = Object.keys(this.state.comments)
      , comments = this.state.comments
      , showAll = this.state.showAll
      , inlines = 0
      , replies = []
      , map = {}
      , list = []

    ids.forEach(function (id) {
      if (!comments[id]) return
      var item = {
        comment: comments[id],
        replies: []
      }
      var target = comments[id].target
      map[id] = item
      if (target === 'main') {
        list.push(item)
      } else if (target.indexOf('inline:') === 0) {
        inlines += 1
        if (showAll) list.push(item)
      } else if (target.indexOf('reply:') === 0) {
        replies.push(comments[id])
      }
    })

    replies.forEach(function (comment) {
      var parent = comment.target.slice('reply:'.length)
      if (!map[parent]) {
        // this is in reply to a comment that was deleted...
        list.push({comment: comment, parentDeleted: true, replies: []})
        return
      }
      map[parent].replies.push(comment)
    });

    return {
      list: list,
      inlines: inlines
    }
  },

  _onLogin: function (user) {
    this.setState({user: user})
  },

  renderComments: function () {
    if (!Object.keys(this.state.comments).length) {
      if (this.state.loading) {
        return <span><i className="fa fa-spin fa-spinner"/> Loading...</span>
      }
      return null
    }

    var organized = this.organizeComments()
    var user = this.state.user
    var db = this.props.db

    var comments = organized.list.map(function (item) {
      return Comment({
        key: item.comment._id,
        replies: item.replies,
        parentDeleted: item.parentDeleted,
        canEdit: user && user.uid == item.comment.userid,
        canVote: !!user,
        userid: user && user.uid,
        data: item.comment,
        user: user,
        db: db,
      })
    }.bind(this))

    return <div className="commented_comments">
      {organized.inlines ? ShowAller({
        count: organized.inlines,
        showAll: this.state.showAll,
        onChange: this._onChangeShow
      }) : false}
      {comments}
    </div>;
  },

  render: function () {
    return <div className="commented_main">
      {this.renderComments()}
      <div className="commented_add">
        <AddComment
          user={this.state.user}
          auth={this.props.auth}
          db={this.props.db}/>
      </div>
    </div>;
  }
});

module.exports = MainComments;
