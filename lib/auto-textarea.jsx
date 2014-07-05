
var AutoTextarea = React.createClass({
  componentDidMount: function () {
    var node = this.getDOMNode()
    node.style.height = 'auto'
    node.style.height = node.scrollHeight + 'px'
    node.style.scrollTop = node.scrollHeight
    node.focus()
    node.selectionStart = node.selectionEnd = node.value.length
  },

  render: function () {
    var style
      , node

    if (this.isMounted()) {
      node = this.getDOMNode()
      node.style.height = 'auto'
      node.style.height = node.scrollHeight + 'px'
      style = {
        height: node.scrollHeight + 'px',
        scrollTop: node.scrollHeight
      }
    }
    return this.transferPropsTo(
      <textarea style={style} className='auto-textarea'/>
    )
  }
});

module.exports = AutoTextarea
