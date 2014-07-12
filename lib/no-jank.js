
module.exports = {
  componentDidMount: function () {
    var node = this.getDOMNode()
    this._height = node.getBoundingClientRect().height
  },
  componentDidUpdate: function () {
    var lastHeight = this._height
      , node = this.getDOMNode()
      , dur = this.slide.duration + ''
    node.style.WebkitTransition = ''
    node.style.height = 'auto'
    var newHeight = this._height = node.getBoundingClientRect().height
    node.style.height = lastHeight + 'px';
    setTimeout(function () {
      node.style.WebkitTransition = 'height ' + dur + 's ease';
      node.style.height = newHeight
    }, 0);
  },
}

