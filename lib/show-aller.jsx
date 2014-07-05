
var ShowAller = React.createClass({
  propTypes: {
    skipped: React.PropTypes.number
  },
  render: function () {
    var show = this.props.showAll
    return <div className="commented_show-aller">
      <button
          className="commented_show-aller_btn"
          onClick={this.props.onChange.bind(null, !show)}>
        {show ? 'Hide' : 'Show'} {this.props.count} side comments
      </button>
    </div>;
  }
});

module.exports = ShowAller

