
var Login = React.createClass({
  propTypes: {
    db: React.PropTypes.object.isRequired,
    auth: React.PropTypes.array.isRequired,
    onLogin: React.PropTypes.func.isRequired
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
      return <span>Connecting to {this.state.loading}</span>
    }

    return <div className="commented_login">
      {this.props.auth.map(function (type) {
        return <button key={type} onClick={this.onClick.bind(this, type)}>
          {type}
        </button>;
      }.bind(this))}
    </div>;
  }
});

module.exports = Login
