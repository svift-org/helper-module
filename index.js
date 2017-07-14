SVIFT.helper = {};

/*
 * Debouncer function, in order to not mess with the browser performance through repetitive calls (e.g. window resize)
 * 
 * @param {Function} `func` Function to be called
 * @param {Integer} `timeout` Timeout between calls (optional)
 *
 */
SVIFT.helper.debouncer = function ( func , timeout ) {
  var timeoutID , timeout = timeout || 200;
  return function () {
    var scope = this , args = arguments;
    clearTimeout( timeoutID );
    timeoutID = setTimeout( function () {
      func.apply( scope , Array.prototype.slice.call( args ) );
    } , timeout );
  };
};