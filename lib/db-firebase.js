
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

  // normal edits

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

  editComment: function (id, text) {
    if (!this.user) {
      return console.error("Not logged in");
    }
    this.db.child(id).update({text: text})
  },

  removeComment: function (id) {
    if (!this.user) {
      return console.error("Not logged in");
    }
    this.db.child(id).remove()
  },

  // voting!!

  flag: function (id, uid, flag) {
    if (flag) {
      this.db.child(id).child('flags').child(uid).set(flag)
    } else {
      this.db.child(id).child('flags').child(uid).remove()
    }
  },

  heart: function (id, uid) {
    this.db.child(id).child('votes').child(uid).set(true)
  },

  unHeart: function (id, uid) {
    this.db.child(id).child('votes').child(uid).remove()
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
    user.picture = (user.thirdPartyUserData.profile_image_url || // twitter
                    user.thirdPartyUserData.picture ||  // google
                    user.thirdPartyUserData.avatar_url) // github
    // facebook
    if (user.picture && user.picture.data) {
      user.picture = user.picture.data.url
    }
    this.user = user
    this.fireLoggedin(user)
  },

  fireLoggedin: function (user) {
    this.liHanders.forEach(function (fn) {
      fn(user)
    })
  },

  logout: function () {
    this._auth.logout()
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
