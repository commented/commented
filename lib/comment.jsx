
var format = require('./format')

var Comment = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    canEdit: React.PropTypes.bool.isRequired,
    db: React.PropTypes.object,
  },
  render: function () {
    var comment = this.props.data
    // TODO: add editing if canEdit
    return <div className="commented_comment">
      <img className="commented_pic" src={comment.picture}/>
      <div className="right">
        <strong className="display-name">{comment.displayName}</strong>
        {format(comment.text, "text")}
      </div>
    </div>;
  }
});

module.exports = Comment;
