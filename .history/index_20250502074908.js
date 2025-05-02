if (!Object.values) Object.values = function (o) {
  return Object.keys(o).map(function (k) {
    return o[k];
  });
};


var floor = function floor(num) {
  // a function to calculate the floor function
  return num << 0;
};

var str2num = function str2num(str) {
  // used to convert a string to a numerical value
  return parseInt(str.slice(0, -2));
};

var vw = window.innerWidth || 2000;  // the view width of the window
var vh = window.innerHeight || 2000;  // the view height of the window
var len = 3 * (vh + vw);  // the length of the line, supposed to be infinite
var dots = {};  // the dots on the line, stored as an object with x,y coordinates as keys
var dkwtd = 10

var getpos = function getpos(elm) {
  var rect = elm.getBoundingClientRect();
  var x = str2num(elm.style.left) + floor(len / 2);
  var y = str2num(elm.style.top);
  return {
    x: x,
    y: y
  };
};

var setpos = function setpos(elm, x, y) {
  elm.style.left = "".concat(x - floor(len / 2), "px");
  elm.style.top = "".concat(y, "px");
};

var universe = document.querySelector('#main');
var line = document.querySelector('.line');
line.style['width'] = "".concat(len, "px");
line.style['left'] = '200px';
line.style['top'] = '0px';
getpos(line);
setpos(line, floor(universe.offsetWidth / 2), floor(universe.offsetHeight * .95)); //setpos(line,0,0);

getpos(line);
var start = null;
var canRotate = false;
var slope = 180;
var shouldUseislope = false;
var nextDot;
var nextDotDeg = 365;
var digs = [];
var curDot;
var tic = 0;

function turnOnOff(){
  canRotate = !canRotate;
  const button = document.getElementById('launcher');
  if (canRotate) {
    button.innerHTML = "Stop";
  } else {
    button.innerHTML = "Start";
  }

}

function doStuff() {

  var islope = slope + 180;

  if (islope < 0) {
    islope = 360 + islope;
  } else if (islope > 360) {
    islope = islope - 360;
  }

  var tryslope = shouldUseislope ? islope : slope;
  var linebuffer = tryslope - .6;

  if (tryslope >= nextDotDeg && linebuffer < nextDotDeg) {
    
    setpos(line, nextDot.x, nextDot.y);
    nextDot.ref.className = "hit";

    if (navigator.vibrate) {
      navigator.vibrate([100]);
    }

    var p1 = getpos(line);
    digs = [];
    Object.values(dots).forEach(function (p2) {
      if (p1.x == p2.x && p1.y == p2.y) { } else {
        var pointDegs = Math.atan2(p2.y * -1 - p1.y * -1, p2.x - p1.x) * 180 / Math.PI;

        if (pointDegs < 0) {
          pointDegs = 360 + pointDegs;
        }

        digs.push({
          d: pointDegs,
          p: p2
        });
      }
    });

    digs.sort(function (a, b) {
      return a.d - b.d;
    });
    
    var potentialdig = 'false';
    var potentialdot = 'false';
    var pdig;
    var pdot;

    for (var _i = 0, _digs = digs; _i < _digs.length; _i++) {
      var dig = _digs[_i];

      if (slope < dig.d) {
        potentialdig = dig.d;
        potentialdot = dig.p;
        break;
      }
    }

    if (potentialdig === 'false' && digs[0]) {
      pdig = digs[0].d;
      pdot = digs[0].p;
    } else {
      pdig = potentialdig;
      pdot = potentialdot;
    }

    var _islope = slope + 180;

    if (_islope < 0) {
      _islope = 360 + _islope;
    } else if (_islope > 360) {
      _islope = _islope - 360;
    }

    var ipotentialdig = 'false';
    var ipotentialdot = 'false';
    var ipdig;
    var ipdot;

    for (var _i2 = 0, _digs2 = digs; _i2 < _digs2.length; _i2++) {
      var _dig = _digs2[_i2];

      if (_islope < _dig.d) {
        ipotentialdig = _dig.d;
        ipotentialdot = _dig.p;
        break;
      }
    }

    if (ipotentialdig === 'false' && digs[0]) {
      ipdig = digs[0].d;
      ipdot = digs[0].p;
    } else {
      ipdig = ipotentialdig;
      ipdot = ipotentialdot;
    }

    var sdif = pdig - slope < 0 ? pdig + (360 - slope) : pdig - slope;
    var isdif = ipdig - _islope < 0 ? ipdig + (360 - _islope) : ipdig - _islope;

    if (sdif > isdif) {
      nextDotDeg = ipdig;
      nextDot = ipdot;
      shouldUseislope = true;
    } else {
      nextDotDeg = pdig;
      nextDot = pdot;
      shouldUseislope = false;
    }

    
  }

  if(canRotate){
    line.style.transform = "rotate(".concat(360 - slope, "deg)");
    slope = slope + .5;
  }

  if (slope === 360) {
    slope = 0;
  }
}

function step(timestamp) {
  doStuff();
  setTimeout(step, dkwtd);
}

window.requestAnimationFrame(step);

var makeDot = function makeDot(parent, x, y) {
  var fieldWidth = universe.offsetWidth; // the width of the field
  var fieldHeight = universe.offsetHeight; // the height of the field

  if (!(0<x && x<fieldWidth && 0<y && y<fieldHeight)) {
    return;
  }
  var newDot = document.createElement("div");
  newDot.style.left = "".concat(x, "px");
  newDot.style.top = "".concat(y, "px");
  newDot.className = "dot";
  parent.appendChild(newDot);
  dots["".concat(x, ",").concat(y)] = {
    x: x,
    y: y,
    ref: newDot
  };
  console.log({
    dots: dots
  });
  var p1 = getpos(line);
  var pdiff = 0;
  digs = [];
  Object.values(dots).forEach(function (p2) {
    if (p1.x == p2.x && p1.y == p2.y) { } else {
      var pointDegs = Math.atan2(p2.y * -1 - p1.y * -1, p2.x - p1.x) * 180 / Math.PI;

      if (pointDegs < 0) {
        pointDegs = 360 + pointDegs;
      }

      digs.push({
        d: pointDegs,
        p: p2
      });
    }
  });
  digs.sort(function (a, b) {
    return a.d - b.d;
  });
  var potentialdig = 'false';
  var potentialdot = 'false';
  var pdig;
  var pdot;

  for (var _i3 = 0, _digs3 = digs; _i3 < _digs3.length; _i3++) {
    var dig = _digs3[_i3];

    if (slope < dig.d) {
      potentialdig = dig.d;
      potentialdot = dig.p;
      break;
    }
  }

  if (potentialdig === 'false' && digs[0]) {
    pdig = digs[0].d;
    pdot = digs[0].p;
  } else {
    pdig = potentialdig;
    pdot = potentialdot;
  }

  var islope = slope + 180;

  if (islope < 0) {
    islope = 360 + islope;
  } else if (islope > 360) {
    islope = islope - 360;
  }

  var ipotentialdig = 'false';
  var ipotentialdot = 'false';
  var ipdig;
  var ipdot;

  for (var _i4 = 0, _digs4 = digs; _i4 < _digs4.length; _i4++) {
    var _dig2 = _digs4[_i4];

    if (islope < _dig2.d) {
      ipotentialdig = _dig2.d;
      ipotentialdot = _dig2.p;
      break;
    }
  }

  if (ipotentialdig === 'false' && digs[0]) {
    ipdig = digs[0].d;
    ipdot = digs[0].p;
  } else {
    ipdig = ipotentialdig;
    ipdot = ipotentialdot;
  }

  var sdif = pdig - slope < 0 ? pdig + (360 - slope) : pdig - slope;
  var isdif = ipdig - islope < 0 ? ipdig + (360 - islope) : ipdig - islope;

  if (sdif > isdif) {
    nextDotDeg = ipdig;
    nextDot = ipdot;
    shouldUseislope = true;
  } else {
    nextDotDeg = pdig;
    nextDot = pdot;
    shouldUseislope = false;
  }

  console.log({
    nextDotDeg: nextDotDeg,
    nextDot: nextDot,
    shouldUseislope: shouldUseislope,
    slope: slope,
    islope: islope
  });
  console.log({dots})
};

var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

var clickOrTap = function clickOrTap(event) {
  makeDot(universe, event.clientX || event.pageX, event.clientY || event.pageY);
};

var clickortouch = iOS && 'ontouchstart' in window ? 'touchstart' : 'click';
document.addEventListener(clickortouch, clickOrTap);
document.addEventListener('keydown', function (event) {
  // Check if the pressed key is the spacebar (key code 32 or 'Space')
  if (event.code === 'Space' || event.key === ' ' || event.keyCode === 32) {
    event.preventDefault(); // Prevent default behavior (e.g., scrolling down)
    turnOnOff(); // Call your function
  }
});



