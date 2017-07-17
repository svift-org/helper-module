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

/*
 * D3 standard interpolate can only handle two values, this interpolate function creates a series of interpolations betweens elements
 * 
 * @param {array} `a` [{value:0}, {value:50, duration:10, ease:d3.cubicInOut}, {value:100, duration:5, ease:d3.cubicInOut}]
 *
 */

SVIFT.helper.interpolate = function ( a ) {

  var ip = {};

  ip.def = a;
  ip.interpolate = [];
  ip.duration = 0;

  for(var i = 1; i<ip.def.length; i++){
    if(!('ease' in ip.def[i])){ip.def[i].ease = false;}
    ip.interpolate.push(d3.interpolate(ip.def[i-1].value, ip.def[i].value));
    ip.duration += ip.def[i].duration;
  }

  var t_duration = 0;
  for(var i = 1; i<ip.def.length; i++){
    ip.def[i].duration = ip.def[i].duration / ip.duration;
    ip.def[i].start = t_duration;
    t_duration += ip.def[i].duration;
  }

  ip.i = function (t) {
    for(var i = 1; i<ip.def.length; i++){
      if(t>=ip.def[i].start && t<=(ip.def[i].start+ip.def[i].duration)){
        if(ip.def[i].ease){
          return ip.interpolate[i-1](ip.def[i].ease((t-ip.def[i].start)/ip.def[i].duration));
        }else{
          return ip.interpolate[i-1]((t-ip.def[i].start)/ip.def[i].duration);
        }
      }
    }
  };

  return ip.i;
};