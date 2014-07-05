/** jshint Hoodie: true */

module.exports = DBHoodie

function DBHoodie(options) {
  this.db = new Hoodie(options.hoodie)
  this.options = options
}

