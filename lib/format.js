
if (window.marked) {
  module.exports = function (text, cls) {
    return React.DOM.div({
      className: cls,
      dangerouslySetInnerHTML: {
        __html: marked(text)
      }
    });
  }
} else {
  module.exports = function (x, cls) {
    return React.DOM.div({className: cls}, x)
  }
}

