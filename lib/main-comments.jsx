
var ViewComments = require('./view-comments.jsx')
  , mixing = require('./mixin')

var MainComments = React.createClass({
  mixins: [mixing],
  propTypes: {
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired
  },

  getDefaultProps: function () {
    return {
      target: 'main'
    }
  },

  render: function () {
    return ViewComments({
      comments: this.organizeComments(),
      loading: this.state.loading,
      user: this.state.user,
      db: this.props.db,
      auth: this.props.auth,
      target: 'main'
    });
  },
});

module.exports = MainComments;
