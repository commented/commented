
if (window.marked) {
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true,
  })
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

