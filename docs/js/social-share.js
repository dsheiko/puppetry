
// Tiny object for getting counts
var socialGetter = (function() {
  /* just a utility to do the script injection */
  function injectScript(url) {
    var script = document.createElement('script');
    script.async = true;
    script.src = url;
    document.body.appendChild(script);
  }

  return {
    getFacebookCount: function(url, callbackName) {
      injectScript('https://graph.facebook.com/?id=' + encodeURIComponent( url ) + '&callback=' + callbackName);
    }
  };
})();

// Callbacks to do something with the result
function facebookCallback(result) {
  console.log('The count is: ', result.share.share_count);
}

socialGetter.getFacebookCount('https://davidwalsh.name/twitter-facebook-jsonp', 'facebookCallback');
