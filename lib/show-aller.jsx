
var ShowAller = React.createClass({
  propTypes: {
  },
  render: function () {
    var show = this.props.showAll
    return <div className="commented_show-aller">
      <button
          className="commented_show-aller_btn"
          onClick={this.props.onChange.bind(null, !show)}>
        {show ? 'Hide' : 'Show'} {skipped} side comments
      </button>
    </div>;
  }
});

module.exports = ShowAller

