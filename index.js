
var Commented = require('./lib')

function defaultSlug() {
    return (window.location.host + window.location.pathname);
}

document.addEventListener('DOMContentLoaded', function () {
  var node = document.getElementById('commented-main');
  if (!node) {
    console.error('#commented-main node not found');
    return;
  }
  var options = {
    firebase: node.getAttribute('data-firebase'),
    type: 'firebase',
    auth: node.getAttribute('data-auth').split(' '),
    slug: node.getAttribute('data-slug') || defaultSlug(),
    inline: node.getAttribute('data-inline'),
    main: node
  }

  // firebase is currently the only supported host
  if (!options.firebase) {
    console.error('Invalid configuration! data-firebase must be specified')
    return;
  }
  Commented(options);
});

