
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

  organizeComments: function () {
    var ids = Object.keys(this.state.comments)
      , comments = this.state.comments
      , showAll = this.state.showAll
      , isMain = this.props.target === 'main'
      , numInlines = 0
      , replies = []
      , map = {}
      , list = []

    if (!ids.length) return null

    ids.forEach((id) => {
      if (!comments[id]) return
      var item = {
        comment: comments[id],
        replies: []
      }
      var target = comments[id].target
      map[id] = item
      if (target === this.props.target) {
        list.push(item)
      } else if (isMain && target.indexOf('inline:') === 0) {
        numInlines += 1
        if (showAll) {
            list.push(item)
        }
      } else if (target.indexOf('reply:') === 0) {
        replies.push(comments[id])
      }
    })

    replies.forEach(function (comment) {
      var parent = comment.target.slice('reply:'.length)
      if (!map[parent]) {
        if (isMain) {
            // this is in reply to a comment that was deleted...
            list.push({
                comment: comment,
                parentDeleted: true,
                replies: []
            })
        }
        return
      }
      map[parent].replies.push(comment)
    });

    return {
      list: list,
      numInlines: numInlines
    }
  },

  // firebase callbacks
  _onAdded: function (comment) {
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
