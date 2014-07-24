
var mixing = require('./mixin')
  , Comment = require('./comment.jsx')
  , ShowAller = require('./show-aller.jsx')
  , AddComment = require('./add-comment.jsx')

var ViewComments = React.createClass({
  propTypes: {
    comments: React.PropTypes.object,
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired,
    target: React.PropTypes.string.isRequired,
    startAdding: React.PropTypes.bool
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


  _onLogin: function (user) {
    this.setState({user: user})
  },

  renderComments: function () {
    if (!this.props.comments) {
      if (this.state.loading) {
        return <span>
            <i className="fa fa-spin fa-spinner"/>
            {' '}Loading...
        </span>
      }
      return null
    }

    var organized = this.props.comments
    var user = this.state.user
    var db = this.props.db
    var isMain = this.props.target === 'main'

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
      {(isMain && organized.inlines) ? ShowAller({
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
          autoAdd={this.props.startAdding}
          target={this.props.target}
          user={this.state.user}
          auth={this.props.auth}
          db={this.props.db}/>
      </div>
      <div className="commented_attribution">
        Comments powered by <a target="_blank" href="http://commented.github.io">//commented</a>
      </div>
    </div>;
  }
});

module.exports = ViewComments;
