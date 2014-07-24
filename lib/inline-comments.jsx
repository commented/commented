
var PT = React.PropTypes
  , mixing = require('./mixin')
  , ViewComments = require('./view-comments.jsx')
  , cx = React.addons.classSet

function isDescendent(child, parent) {
  while (child) {
    if (child === parent) return true
    child = child.parentNode
  }
  return false;
}

var InlineComments = React.createClass({
  mixins: [mixing],
  propTypes: {
    target: PT.string.isRequired,
    body: PT.object.isRequired,
    auth: PT.array.isRequired,
    db: PT.object.isRequired,
  },

  componentDidMount: function () {
    document.addEventListener('click', this.docMouseDown);
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.docMouseDown);
  },

  docMouseDown: function (e) {
    if (!this.state.showing) {
      return
    }
    var isComment = false
      , node = e.target
      , me = this.getDOMNode()
    if (node.classList.contains('add-comment')) {
      return
    }
    while (node) {
      if (node === me) return
      if (node.classList) {
        if (node.classList.contains('commented_login-type')) {
          return
        }
        if (node.classList.contains('commented_inline')) {
          isComment = true
          break;
        }
      }
      node = node.parentNode
    }
    if (!isComment) {
      this.props.body.classList.remove('commented_inline-body--shifted')
    }
    this.setState({showing: false})
  },

  componentDidUpdate: function () {
    if (this.state.showing) {
      this.props.body.classList.add('commented_inline-body--shifted')
    }
  },

  onShow: function () {
    if (this.state.showing) {
      return this.onHide()
    }
    this.setState({showing: true});
  },

  onHide: function () {
    this.props.body.classList.remove('commented_inline-body--shifted')
    this.setState({showing: false});
  },

  render: function () {
    var comments = this.organizeComments();
    var hasComments = comments && comments.list.length
    return <div className={cx({
      "commented_inline": true,
      'commented_inline--empty': !hasComments,
      'commented_inline--showing': this.state.showing
    })}>
      <div className="commented_inline_flag" onClick={this.onShow}>
        {hasComments || '+'}
      </div>
      {this.state.showing && ViewComments({
        comments: comments,
        db: this.props.db,
        user: this.state.user,
        loading: this.state.loading,
        auth: this.props.auth,
        target: this.props.target,
        startAdding: !hasComments,
      })}
    </div>;
  }

});

module.exports = InlineComments;
