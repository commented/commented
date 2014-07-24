
var PT = React.PropTypes
  , mixing = require('./mixin')

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
    document.addEventListener('mousedown', this.docMouseDown);
  },

  componentWillUnmount: function () {
    document.removeEventListener('mousedown', this.docMouseDown);
  },

  docMouseDown: function (e) {
    if (!this.state.showing) {
      return
    }
    if (isDescendent(e.target, this.getDOMNode())) {
      return
    }
    this.setState({showing: false})
    this.props.body.classList.remove('commented_inline-body--shifted')
  },

  componentDidUpdate: function () {
    if (this.state.showing) {
      this.props.body.classList.add('commented_inline-body--shifted')
    }
  },

  onShow: function () {
    this.setState({showing: true});
  },

  render: function () {
    var comments = this.organizeComments();
    return <div className="commented_inline">
      <div className="commented_inline_flag" onClick={this.onShow}>
        {comments.list.length || '&times;'}
      </div>
      {this.state.showing && ViewComments({
        comments: comments,
        db: this.props.db,
        auth: this.props.auth,
        target: this.props.target,
        startAdding: !comments.list.length
      })}
    </div>;
  }

});

module.exports = InlineComments;
