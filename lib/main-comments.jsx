
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

  renderComments: function () {
    if (!this.state.comments.length) {
      if (this.state.loading) {
        return <span><i className="fa fa-spin fa-spinner"/> Loading...</span>
      }
      return null
    }
    var showAll = this.state.showAll
    var skipping = 0
    var comments = this.state.comments.map(function (comment) {
      if (comment.target !== 'main') {
        skipping += 1
        if (!showAll) {
          return
        }
      }
      return Comment({
        key: comment._id,
        canEdit: this.state.user && this.state.user.uid == comment.userid,
        canVote: !!this.state.user,
        userid: this.state.user && this.state.user.uid,
        db: this.props.db,
        data: comment
      })
    }.bind(this))
    return <div className="commented_comments">
      {skipping ? ShowAller({
        count: skipping,
        showAll: showAll,
        onChange: this._onChangeShow
      }) : false}
      {comments}
    </div>;
  },

  _onLogin: function (user) {
    this.setState({user: user})
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
