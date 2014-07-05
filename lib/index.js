
var cleanSlug = require('./clean-slug.js')
  , getDb = require('./db')

  // , InlineComments = require('./inline-comments.jsx')
  , MainComments = require('./main-comments.jsx')

module.exports = function (options) {
  options.slug = cleanSlug(options.slug)

  var db = window.db = getDb(options)
  if (!db) return console.error('Failed to initialize db')

  var nodes
  if (options.inline && false) {
    body = document.querySelector(options.inline)
    body.classList.add('commented_inline-body')
    nodes = around.querySelectorAll(options.inline + ' p')
    nodes.forEach(function (node) {
      React.renderComponent(InlineComments({
        auth: auth,
        db: db
      }), node);
    });
  }

  React.renderComponent(MainComments({
    auth: options.auth,
    db: db
  }), options.main);

  // create the main component, then create a sidebar component
}

