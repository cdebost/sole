
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
		niceDate:      "ddd mmm, dd yyyy h:MM TT",
		niceDate2:      "ddd mmm, dd - h:MM TT",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	cleanTime:     "yyyymmddhhMMss",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

//Image.prototype.loaded = function () {
//	alert(this.id);
//};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};



Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
}


Date.prototype.toISO8601String = function (format, offset) {
    /* accepted values for the format [1-6]:
     1 Year:
       YYYY (eg 1997)
     2 Year and month:
       YYYY-MM (eg 1997-07)
     3 Complete date:
       YYYY-MM-DD (eg 1997-07-16)
     4 Complete date plus hours and minutes:
       YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)
     5 Complete date plus hours, minutes and seconds:
       YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
     6 Complete date plus hours, minutes, seconds and a decimal
       fraction of a second
       YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
    */
    if (!format) { var format = 6; }
    if (!offset) {
        var offset = 'Z';
        var date = this;
    } else {
        var d = offset.match(/([-+])([0-9]{2}):([0-9]{2})/);
        var offsetnum = (Number(d[2]) * 60) + Number(d[3]);
        offsetnum *= ((d[1] == '-') ? -1 : 1);
        var date = new Date(Number(Number(this) + (offsetnum * 60000)));
    }

    var zeropad = function (num) { return ((num < 10) ? '0' : '') + num; }

    var str = "";
    str += date.getUTCFullYear();
    if (format > 1) { str += "-" + zeropad(date.getUTCMonth() + 1); }
    if (format > 2) { str += "-" + zeropad(date.getUTCDate()); }
    if (format > 3) {
        str += "T" + zeropad(date.getUTCHours()) +
               ":" + zeropad(date.getUTCMinutes());
    }
    if (format > 5) {
        var secs = Number(date.getUTCSeconds() + "." +
                   ((date.getUTCMilliseconds() < 100) ? '0' : '') +
                   zeropad(date.getUTCMilliseconds()));
        str += ":" + zeropad(secs);
    } else if (format > 4) { str += ":" + zeropad(date.getUTCSeconds()); }

    if (format > 3) { str += offset; }
    return str;
}



AnimationFrame = (function() {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
		window.setTimeout(callback, 30);
	};
})();


// TODO: Un-global
AnimationEasing = {
		Linear: {
			None: function ( k ) {
				return k;
			}
		},
		Quadratic: {
			In: function ( k ) {
				return k * k;
			},
			Out: function ( k ) {
				return k * ( 2 - k );
			},
			InOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
				return - 0.5 * ( --k * ( k - 2 ) - 1 );
			}
		},
		Cubic: {
			In: function ( k ) {
				return k * k * k;
			},
			Out: function ( k ) {
				return --k * k * k + 1;
			},
			InOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k + 2 );
			}
		},
		Quartic: {
			In: function ( k ) {
				return k * k * k * k;
			},
			Out: function ( k ) {
				return 1 - ( --k * k * k * k );
			},
			InOut: function ( k ) {
				if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
				return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
			}
		},
		Quintic: {
			In: function ( k ) {
				return k * k * k * k * k;
			},
			Out: function ( k ) {
				return --k * k * k * k * k + 1;
			},
			InOut: function ( k ) {
				if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
				return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
			}
		},
		Sinusoidal: {
			In: function ( k ) {
				return 1 - Math.cos( k * Math.PI / 2 );
			},
			Out: function ( k ) {
				return Math.sin( k * Math.PI / 2 );
			},
			InOut: function ( k ) {
				return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
			}
		},
		Exponential: {
			In: function ( k ) {
				return k === 0 ? 0 : Math.pow( 1024, k - 1 );
			},
			Out: function ( k ) {
				return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
			},
			InOut: function ( k ) {
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
				return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
			}
		},
		Circular: {
			In: function ( k ) {
				return 1 - Math.sqrt( 1 - k * k );
			},
			Out: function ( k ) {
				return Math.sqrt( 1 - ( --k * k ) );
			},
			InOut: function ( k ) {
				if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
				return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
			}
		},
		Elastic: {
			In: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			},
			Out: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
			},
			InOut: function ( k ) {
				var s, a = 0.1, p = 0.4;
				if ( k === 0 ) return 0;
				if ( k === 1 ) return 1;
				if ( !a || a < 1 ) { a = 1; s = p / 4; }
				else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
				if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
				return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
			}
		},
		Back: {
			In: function ( k ) {
				var s = 1.70158;
				return k * k * ( ( s + 1 ) * k - s );
			},
			Out: function ( k ) {
				var s = 1.70158;
				return --k * k * ( ( s + 1 ) * k + s ) + 1;
			},
			InOut: function ( k ) {
				var s = 1.70158 * 1.525;
				if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
				return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
			}
		},
		Bounce: {
			In: function ( k ) {
				return 1 - AnimationEasing.Bounce.Out( 1 - k );
			},
			Out: function ( k ) {
				if ( k < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			},
			InOut: function ( k ) {
				if ( k < 0.5 ) return AnimationEasing.Bounce.In( k * 2 ) * 0.5;
				return AnimationEasing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;
			}
		}
	}

function Animation(host, id, start, end, duration, fr, done, timer, e)
{
    var that = this;
    this.id = id;
   // if (host.animations[id]) host.animations[id].interrupt = 1;
    host.animations[id] = this;
    this.current = 0;
    this.start_time = (new Date()).getTime();
    this.start_val = start;
    this.pause = 0;
    this.paused = 0;
    this.total_paused = 0;
    this.end_val = end;
    this.framer = fr;
    this.cancel = 0;
    this.duration = duration;
    this.done = done;
   // this.interrupt = 0;

    var ease = function ease(t)
	{
	    var k1 = .1;
	    var k2 = .1;
		var t1;
		var t2;
		var f;
		var s;

		f = k1*2/Math.PI + k2 -k1 + (1.0-k2)*2/Math.PI;

		if (t < k1) {
			s = k1*(2/Math.PI)*(Math.sin((t/k1)*Math.PI/2.0 - Math.PI/2.0)+1);
		} else if (t < k2) {
			s = (2*k1/Math.PI + t-k1);
		} else {
			s = 2*k1/Math.PI + k2-k1 + ((1-k2)*(2.0/Math.PI))*Math.sin(((t-k2)/(1.0-k2))*Math.PI/2.0);
		}

		return (s/f);
	}

	if (e) {
	    var e = e.split(".");
	    if (AnimationEasing[e[0]]) {
	        ease =  AnimationEasing[e[0]][e[1]];
	    }
    }

    this.callback = function () {
      //  if (that.interrupt) return;
        d = (new Date()).getTime();
        if (that.pause) {
            if (!that.paused) that.paused = d;
            return;
        } else if (that.paused && !that.pause) {
            that.total_paused += (d - that.paused);
        }
        var p = ((d - that.total_paused) - that.start_time)/that.duration;

        var val = that.start_val + ((that.end_val - that.start_val)*p);

        if ((that.end_val > that.start_val) && (val > that.end_val)) val = that.end_val;
        else if ((that.end_val < that.start_val) && (val < that.end_val)) val = that.end_val;

        if (host.animations[that.id]) {
            var f = that.framer(ease(val));
            if (f) {
				if (((that.end_val > that.start_val) && (val < that.end_val)) || ((that.end_val < that.start_val) && (val > that.end_val)) && host.animations[that.id]) {
				    if (timer) setTimeout(that.callback,10);
				    else AnimationFrame(that.callback);
				} else if (that.done && (typeof that.done == "function")) {
				    that.done();
				    delete host.animations[that.id];
				} else delete host.animations[that.id];
            } else {
                delete host.animations[that.id];
            }
        }
    };
    if (timer) setTimeout(that.callback,10);
    else AnimationFrame(that.callback);

}

function NSWorkspace(options) {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var sc = 1.0;

	sc = h/832;
	this.pattern = new Image();
	this.pattern.src = "images/50percent.png";
	this.height = 832;
	this.width = w*(1/sc);
	this.scale = sc;

    for (var a in options) {
        this[a] = options[a];
    }

    this.apps = {};

    //this.dock = new NSDock("main", this.height);
    this.windows = [];


    this.unique_id = 0;
    this.zindex = 1000;
    this.size_cellh = 20;
    this.size_titleh = 23;
    this.size_orig_menu_x = 10;
    this.size_orig_menu_y = 60;
    this.stylesheet = 0;
    this.current_window = 0

    this.animations = {}

}


function ClassQuery(selector, action) {
    Array.prototype.forEach.call(document.querySelectorAll(selector),function(element) {
                  action(element);
                });
}


function Tracker(opts) {
    this.hori_start=0;
    this.hori_move=0;
    this.hori_end = 0;

    this.vert_start=0;
    this.vert_move=0;
    this.vert_end= 0;

    this.move = 0;
    this.up = 0;

    this.click = 0;
    this.iscroll = 0;

    this.direction = 0;
    this.angle = 0;
    this.dx = 0;
    this.dy = 0;
    this.center = {x:0,y:0}
    this.startx = 0;
    this.starty = 0;
    this.dragging = 0;
    this.target = 0;

    this.offset = {left:0,top:0};
    this.scale = 1.0;

    for (var a in opts) {
        this[a] = opts[a];
    }


}

Tracker.prototype.getAngle = function (x, y) {
	var dy = y - 0;
	var dx = x - 0;
	return Math.atan2(dy, dx)*(180/Math.PI);
}



Tracker.prototype._down = function (e) {
    var that = this;
	var x  = (((e.touches ? e.touches[0].pageX : e.pageX) - this.offset.left)*this.scale);
	var y  = (((e.touches ? e.touches[0].pageY : e.pageY) - this.offset.top)*this.scale);

	var x1 = this.center.x;
	var y1 = this.center.y;
	var x2 = x;
	var y2 = y;
	this.angle =  this.getAngle(x2-x1,y2-y1)-90;
	this.distance = 0;

	this.target = e.target;
	if (!(this.target && this.target.id && (this.target.id != ""))) {
	    var p = this.target.parentNode;
	    while(p && !p.id) p = p.parentNode;
	    if (p && p.id) this.target_id = p.id;
	}
	this.startx = x;
	this.starty = y;
    this.dragging = 0;
    this.event = e;

    if (this.down) this.down(that);
		//
		//
    if (!this.hori_start && !this.vert_start && this.iscroll) {
		e.cancelBubble = true;
		e.stopPropagation();
		e.preventDefault();

        this.iscroll._start(e);
    } else {
		//e.cancelBubble = true;
		//e.stopPropagation();

	}

	if (!document.onmousemove) document.onmousemove = document.ontouchmove = function (e) {
		var x  = (((e.touches ? e.touches[0].pageX : e.pageX) - that.offset.left)*that.scale);
		var y  = (((e.touches ? e.touches[0].pageY : e.pageY) - that.offset.top)*that.scale);
      //  console.log("loop move " + x + " " + y + " " + that.dragging);
		var x2 = x;
		var y2 = y;
		that.event = e;
		that.distance = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
		that.angle =  that.getAngle(x2-x1,y2-y1)-90;

		that.dx = (that.startx - x);
		that.dy = (that.starty - y);

		if (!that.dragging) {
			if (Math.abs(that.dx) > 6 || Math.abs(that.dy) > 6) {
				that.dragging = (Math.abs(that.dx) > Math.abs(that.dy)) ? "horizontal" : "vertical";
				if (that.dragging == "vertical") {
				    if (that.vert_start) that.vert_start(that);
				} else if (that.dragging == "horizontal") {
				    if (that.hori_start) return that.hori_start(that);
				    //START THE KINETIC SCROLLING HERE
					//if (editor && editor.kinetic) {
					//		that.kinetic.resetSpeed();
					//		that.kinetic.setPosition(starting_option_angle);
					//}
				}


			}

		}
		if (that.dragging == "horizontal") {
		     if (that.hori_move) return that.hori_move(that);
		} else if (that.dragging == "vertical") {
		    if (that.vert_move) return that.vert_move(that);
		}
		if (that.move) that.move(that);
		if (that.dragging && !that.hori_start && !that.vert_start && that.iscroll) {
		  // console.log("Sending... ") ;
			e.cancelBubble = true;
			e.stopPropagation();
			e.preventDefault();
		   that.iscroll._move(e);
		}

		return false;
	}
	if (!document.onmouseup) document.onmouseup = document.ontouchend = function (e) {
	   // SR.idle(0,0,"rater-up");
	   // POPBROWSER.up();
	 //  console.log("up " + x + " " + y + " " + that.dragging);

	//e.cancelBubble = true;
	//e.stopPropagation();
		//e.preventDefault();
		that.event = e;

        if (that.dragging == "horizontal") {
            if (that.hori_end) that.hori_end(that);

            //if (PIX.editor.kinetic_acceleration) {
			//    that.kinetic.release(function (moved) {
			//	    });
		    //}
        } else if (that.dragging == "vertical") {
             if (that.vert_end) that.vert_end(that);
        }
        if (that.up) that.up(that);
        if (!that.dragging) {
             //console.log("CLICKING!!! " + that.click);
             if (that.click) that.click(that);
		}
        that.dragging = 0;
		if (!that.hori_start && !that.vert_start && that.iscroll) {
			//e.cancelBubble = true;
			//e.stopPropagation();
			//e.preventDefault();
		   that.iscroll._end(e);
		}


		document.onmousemove = 0;
		document.onmouseup = 0;
		document.ontouchmove = 0;
		document.ontouchend = 0;

		return false;
	}
	return false;



}
