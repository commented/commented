
module.exports = DBFirebase

function DBFirebase(options) {
  this.db = new Firebase('https://' + options.firebase + '.firebaseio.com/comments/' + options.slug);
  var onValue
  this.db.on('value', onValue = function () {
    this.db.off('value', onValue)
    this.loaded = true
  }.bind(this));
  this.user = null
  this.options = options

  this._auth = new FirebaseSimpleLogin(this.db, this._onLogin.bind(this));
  this.liHanders = []
}

DBFirebase.prototype = {

  addComment: function (text, target, quote) {
    if (!this.user) {
      return console.error("Not logged in");
    }
    this.db.push({
      created: Date.now(),
      displayName: this.user.displayName,
      picture: this.user.picture,
      userid: this.user.uid,
      text: text,
      target: target,
      quote: quote
    })
  },

  login: function (type) {
    this._auth.login(type, {
      rememberMe: true
    })
  },

  _onLogin: function (err, user) {
    if (err || !user) {
      return this.fireLoggedin(null)
    }
    user.picture = user.profile_image_url
    this.user = user
    this.fireLoggedin(user)
  },

  fireLoggedin: function (user) {
    this.liHanders.forEach(function (fn) {
      fn(user)
    })
  },

  onLogin: function (cb) {
    this.liHanders.push(cb)
  },

  offLogin: function (cb) {
    var i = this.liHanders.indexOf(cb)
    if (i === -1) return
    this.liHanders.splice(i, 1)
  },

  onceLoaded: function (done) {
    var onValue
    this.db.on('value', onValue = function () {
      done()
      this.db.off('value', onValue)
    }.bind(this))
  },

  // register event listeners
  onAdd: function (cb) {
    this.db.on('child_added', function (snapshot) {
      var val = snapshot.val()
      val._id = snapshot.name()
      cb(val);
    });
  },
  onChange: function (cb) {
    this.db.on('child_changed', function (snapshot) {
      var val = snapshot.val()
      val._id = snapshot.name()
      cb(val)
    });
  },
  onRemove: function (cb) {
    this.db.on('child_removed', function (snapshot) {
      cb(snapshot.name());
    });
  },
}
