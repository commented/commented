
var cleanSlug = require('./clean-slug.js')
  , getDb = require('./db')

  , InlineComments = require('./inline-comments.jsx')
  , MainComments = require('./main-comments.jsx')

/** TODO when I do selection, this might be the way to do it:
 * var range = window.getSelection().getRangeAt(0);
 * var newNode = document.createElement('span');
 * newNode.appendChild(range.extractContents());
 * range.insertNode(newNode)
 *
 * Also theses guys for range serialization:
 * https://github.com/tildeio/range-serializer
 * */

module.exports = function (options) {
  options.slug = cleanSlug(options.slug)

  var db = window.db = getDb(options)
  if (!db) return console.error('Failed to initialize db')

  if (options.inline ) {
    var body = document.querySelector(options.inline)
    body.classList.add('commented_inline-body')
    var nodes = body.querySelectorAll(options.inline + ' > *')
    ;[].forEach.call(nodes, (node, i) => {
      var id = node.getAttribute('data-section-id') || i
      var inline = document.createElement('div')
      inline.className = 'commented_inline-wrapper'
      node.classList.add('commented_section')
      node.appendChild(inline)
      React.renderComponent(InlineComments({
        target: 'inline:' + id,
        body: body,
        auth: options.auth,
        db: db
      }), inline);
    });
  }

  React.renderComponent(MainComments({
    auth: options.auth,
    db: db,
  }), options.main);
}

