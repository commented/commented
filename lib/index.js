
var cleanSlug = require('./clean-slug.js')
  , getDb = require('./db')

  , InlineComments = require('./inline-comments.jsx')
  , MainComments = require('./main-comments.jsx')

module.exports = function (options) {
  options.slug = cleanSlug(options.slug)

  var db = window.db = getDb(options)
  if (!db) return console.error('Failed to initialize db')

  if (options.inline && false) {
    var body = document.querySelector(options.inline)
    body.classList.add('commented_inline-body')
    var nodes = body.querySelectorAll(options.inline + ' > p')
    nodes.forEach(function (node, i) {
      var id = node.getAttribute('data-section-id') || i
      var inline = document.createElement('div')
      inline.className = 'commented_inline-wrapper'
      node.appendChild(inline)
      React.renderComponent(InlineComments({
        target: 'inline:' + id,
        body: body,
        auth: auth,
        db: db
      }), inline);
    });
  }

  React.renderComponent(MainComments({
    auth: options.auth,
    db: db,
  }), options.main);
}

