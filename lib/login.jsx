
var ICONS = {
  facebook: 'facebook',
  twitter: 'twitter',
  google: 'google',
  github: 'github'
}

var Login = React.createClass({
  propTypes: {
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired,
    onLogin: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      loading: false
    }
  },

  componentDidMount: function () {
    this.props.db.onLogin(this._onLogin)
  },
  componentWillUnmount: function () {
    this.props.db.offLogin(this._onLogin)
  },

  _onLogin: function () {
    this.setState({loading: false})
  },

  onClick: function (type) {
    this.setState({loading: type})
    this.props.db.login(type)
  },

  render: function () {
    if (this.state.loading) {
      return <div className="commented_login--loading commented_login">
        Connecting to {this.state.loading}
        <i className="fa fa-spin fa-spinner"/>
      </div>
    }

    return <div className="commented_login">
      {this.props.auth.map(function (type) {
        var icon = ICONS[type]
          , cls = "commented_login-type"
        cls += ' commented_login-type--' + type
        return <button key={type} className={cls} onClick={this.onClick.bind(this, type)}>
          <span className="commented_pic fa-stack fa-lg">
            <i className="fa fa-circle fa-stack-2x"></i>
            <i className={"fa fa-" + icon + " fa-stack-1x fa-inverse"}></i>
          </span>
        </button>;
      }.bind(this))}
      <button className="commented_login-type commente_login-type--cancel"
        onClick={this.props.onCancel}>&times;
      </button>
    </div>;
  }
});

module.exports = Login
