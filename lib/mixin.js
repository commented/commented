
var up = React.addons.update

module.exports = {
  propTypes: {
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      comments: {},
      user: null
    }
  },

  componentDidMount: function () {
    this.props.db.onAdd(this._onAdded);
    this.props.db.onRemove(this._onRemoved);
    this.props.db.onChange(this._onChanged);
    this.setState({user: this.props.db.user});
  },

  // firebase callbacks
  _onAdded: function (comment) {
    if (this.props.target && comment.target !== this.props.target) {
      return
    }
    var update = {}
    update[comment._id] = {$set: comment}
    this.setState({
        comments: up(this.state.comments, update)
    })
  },

  _onChanged: function (comment) {
    var update = {}
    update[comment._id] = {$set: comment}
    this.setState({
        comments: up(this.state.comments, update)
    })
  },

  _onRemoved: function (id) {
    var update = {}
    update[id] = {$set: null}
    this.setState({
        comments: up(this.state.comments, update)
    })
  },
}
