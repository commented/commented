
module.exports = {
  propTypes: {
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      comments: [],
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
    var comments = this.state.comments.slice()
    comments.push(comment)
    this.setState({comments: comments})
  },

  _onChanged: function (comment) {
    var comments = this.state.comments.slice()
    for (var i=0; i<comments.length; i++) {
      if (comments[i]._id === comment._id) {
        comments[i] = comment
        this.setState({comments: comments})
        return
      }
    }
  },

  _onRemoved: function (id) {
    var comments = this.state.comments.slice()
    for (var i=0; i<comments.length; i++) {
      if (comments[i]._id === id) {
        comments.splice(i, 1);
        this.setState({comments: comments})
        return
      }
    }
  },
}
