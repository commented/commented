
module.exports = {
  componentDidMount: function () {
    var node = this.getDOMNode()
      , style = window.getComputedStyle(node)
      , height = parseFloat(style.height)
      , paddingBottom = style.paddingBottom

    this.slide = this.getSlide()

    // zero things out
    node.style.height = this.slide.closeHeight || 0;
    node.style.opacity = 0;
    node.style.overflow = 'hidden';
    node.style.paddingBottom = 0;

    // cement them
    var style = window.getComputedStyle(node);
    var dur = this.slide.duration;

    setTimeout(function () {
      node.style.transition = 'height ' + dur + 's ease, opacity ' + dur + 's ease, padding-bottom ' + dur + 's ease';
      node.style.height = height + 'px';
      node.style.paddingBottom = paddingBottom;
      node.style.opacity = 1;
    }, 0);

    // reset height when the animation is done
    function fin() {
      node.removeEventListener('transitionend', fin);
      node.style.height = 'auto';
    }
    node.addEventListener('transitionend', fin);
  },

  slideAway: function (done) {
    var node = this.getDOMNode()
    var style = window.getComputedStyle(node);
    node.style.height = style.height
    var box = node.getBoundingClientRect()
    node.style.height = (this.slide.closeHeight || 0) + 'px';
    node.style.opacity = 0;
    node.style.paddingBottom = 0;
    function fin() {
      node.removeEventListener('transitionend', fin);
      done && done();
    }
    node.addEventListener('transitionend', fin);
    // setTimeout(done, this.slide.duration * 1000);
  },
}

