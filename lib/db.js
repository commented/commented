
var DBFirebase = require('./db-firebase');
// var DBHoodie = require('./db-hoodie');

module.exports = function (options) {
  switch (options.type) {
    /* Not ready yet
    case "hoodie":
      return new DBHoodie(options);*/
    case "firebase":
      return new DBFirebase(options);
    default:
      console.error("Invalid backend specified", options.type, options);
  }
}

