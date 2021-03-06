SVIFT.helper = {};

/*
 * Debouncer function, in order to not mess with the browser performance through repetitive calls (e.g. window resize)
 * 
 * @param {Function} `func` Function to be called
 * @param {Integer} `timeout` Timeout between calls (optional)
 *
 */
SVIFT.helper.debouncer = function ( func , _timeout ) {
  var timeoutID , timeout = _timeout || 200;
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

  var ip = {}, i;

  ip.def = a;
  ip.interpolate = [];
  ip.duration = 0;

  for(i = 1; i<ip.def.length; i++){
    if(!('ease' in ip.def[i])){ip.def[i].ease = false;}
    ip.interpolate.push(d3.interpolate(ip.def[i-1].value, ip.def[i].value));
    ip.duration += ip.def[i].duration;
  }

  var t_duration = 0;
  for(i = 1; i<ip.def.length; i++){
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

/*-------------- Some Data Helper Function, this should either be replaced by a library or moved to the data handling part of this framework --------------*/

SVIFT.helper.switchCol = function (data, col1, col2) {
  data.forEach(function(d){
    var t = d[col1];
    d[col1] = d[col2];
    d[col2] = t;
  });
  return data;
};

SVIFT.helper.transpose = function (data) {
  //extract keys
  var tData = {};
  data.forEach(function(d){
    for(var key in d){
      if(!(key in tData)){
        tData[key] = [];
      }
    }
  });
  
  data.forEach(function(d){
    for(var key in tData){
      if(!(key in d)){
        tData[key].push(null);
      }else{
        tData[key].push(d[key]);
      }
    }
  });

  return tData;
};

/*
 * D3 standard axis elements are not really great for being exported to adobe illustrator and sketch app, this modifiers optimise the axis
 * 
 * @param {d3-selection} `axis` A d3 axis selection object
 *
 */

SVIFT.helper.cleanAxis = function ( axis ) {
  var axis_groups;
  if(axis.attr('text-anchor')){
    axis_groups = axis;
  }else{
    axis_groups = axis.select('g[text-anchor="*"]');
  }

  var anchor = axis_groups.attr('text-anchor');
    axis_groups.selectAll('text').attr('text-anchor',anchor);

  var size = axis_groups.attr('font-size');

  axis_groups.selectAll('text').each(function(d){
    var obj = d3.select(this);
    ['y','x'].forEach(function(attr){
      var val = obj.attr('d'+attr);
      if(val){
        if(val.indexOf('em')>=0){
          val = parseFloat(val.substr(0,val.length-2))*size;
        }
        obj.attr('d'+attr, 0);
        var tval = obj.attr(attr);
        if(tval){
          val += parseFloat(tval);
        }
        obj.attr(attr, val);
      }
    })
  });
};