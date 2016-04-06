// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

/**
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.requestInterval = function(fn, delay) {
	if( !window.requestAnimationFrame       &&
		!window.webkitRequestAnimationFrame &&
		!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
		!window.oRequestAnimationFrame      &&
		!window.msRequestAnimationFrame)
			return window.setInterval(fn, delay);

	var start = new Date().getTime(),
		handle = new Object();

	function loop() {
		handle.value = requestAnimFrame(loop);
		var current = new Date().getTime(),
			delta = current - start;

		if(delta >= delay) {
			fn.call();
			start = new Date().getTime();
		}

	};

	handle.value = requestAnimFrame(loop);
	return handle;
}

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
    window.clearRequestInterval = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearInterval(handle);
};

/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

window.requestTimeout = function(fn, delay) {
	if( !window.requestAnimationFrame      	&&
		!window.webkitRequestAnimationFrame &&
		!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
		!window.oRequestAnimationFrame      &&
		!window.msRequestAnimationFrame)
			return window.setTimeout(fn, delay);

	var start = new Date().getTime(),
		handle = new Object();



	function loop(){
		var current = new Date().getTime(),
			delta = current - start;

		delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
	};

	handle.value = requestAnimFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearTimeout(handle);
};

var AnimationEasing = {
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

function Animation(host, id, start, end, duration, frame_function, done_function, use_timer, easing, fps, auto_play, next)
{
    var that = this;
    this.id = id;
   // if (host.animations[id]) host.animations[id].interrupt = 1;

    if (host && host.animations) host.animations[id] = this;
    this.current = 0;
    this.start_time = (new Date()).getTime();
    this.start_val = start;
    this.pauser = 0;
    this.paused = 0;
    this.total_paused = 0;
    this.end_val = end;
    this.framer = frame_function;
    this.cancel = 0;
    this.duration = duration;
    this.done = done_function;
    this.fps = fps;
    this.next_ani = next;
    this.use_timer = use_timer;
    this.position = 0;
    this.value = 0;
    this.seeking = 0;
    this.direction = 1;
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

	if (easing) {
	    var e = easing.split(".");
	    if (AnimationEasing[e[0]]) {
	        ease =  AnimationEasing[e[0]][e[1]];
	    }
    }

    this.callback = function () {
      //  if (that.interrupt) return;
        if (that.cancel) return;
        d = (new Date()).getTime();
        if (that.pauser) {
            if (!that.paused) that.paused = d;
            return;
        } else if (that.paused && !that.pauser) {
            //that.total_paused += (d - that.paused);
            //alert(((d - that.total_paused) - that.start_time)/that.duration);
        }
        //var p = ((d - that.total_paused) - that.start_time)/that.duration;
        var p = ((d) - that.start_time)/that.duration;
        that.position = p;

        var val;


        if (that.direction == -1) {
            val = that.start_val + ((that.end_val - that.start_val)*(1.0-p));
			if ((that.end_val > that.start_val) && (val < that.start_val)) val = that.start_val;
			else if ((that.end_val < that.start_val) && (val > that.start_val)) val = that.start_val;

        } else {
            val = that.start_val + ((that.end_val - that.start_val)*p);
			if ((that.end_val > that.start_val) && (val > that.end_val)) val = that.end_val;
			else if ((that.end_val < that.start_val) && (val < that.end_val)) val = that.end_val;

        }
        that.value = val;
        if (!host || (host && host.animations[that.id])) {
            var f = that.framer(ease(val));
            if (f && !that.seeking) {
				if (
				    ( that.direction == -1 && (((that.end_val > that.start_val) && (val > that.start_val)) || ((that.end_val < that.start_val) && (val < that.start_val)))) ||
				    ( that.direction == 1 && (((that.end_val > that.start_val) && (val < that.end_val)) || ((that.end_val < that.start_val) && (val > that.end_val))))
				    && (!host || host && host.animations[that.id])) {
				    that.frame();
				} else if (that.done || that.next_ani) {
				    if (that.done && (typeof that.done == "function")) {
				        that.done(function (doit) {
				            if (doit) {
				                that.next();
				            } else {
				                if (host && host.animations) delete host.animations[that.id];
				            }
				        });
				    } else if (that.next_ani) {
				        that.next();
				    } else {
				        if (host && host.animations) delete host.animations[that.id];
				    }
				} else if (host && host.animations) delete host.animations[that.id];
            } else {
                if (host && host.animations) delete host.animations[that.id];
            }
        }
    };
    if (auto_play) {
        this.frame();
    }
}
Animation.prototype.next = function () {
    if (this.cancel) return;
    if (this.next_ani == 1) {
        this.start_time = (new Date()).getTime();
        this.paused = 0;
        this.pauser = 0;
    } else {
        //alert("reverse");
        //this.start_time = (new Date()).getTime();
        var tmp = this.start_val;
        if (this.direction == 1) this.start_time = (new Date()).getTime() - this.duration*(0);
        else this.start_time = (new Date()).getTime();
        //this.start_val = this.end_val;
        //this.end_val = this.start_val;
        this.direction = (this.direction == 1) ? -1 : 1;
       // alert(this.direction);
        this.paused = 0;
        this.pauser = 0;

    }
    this.frame();
}
Animation.prototype.frame = function () {

    if (this.cancel) return;
    var that = this;
	if (this.use_timer) setTimeout(that.callback,1000 / that.fps);
	else {

		if (that.fps) {
			setTimeout(function () {
			   //console.log("FPS " + that.fps);
			   AnimationFrame(that.callback);
			}, 1000/that.fps);
		} else AnimationFrame(that.callback);

	}
}


Animation.prototype.pause  = function () {
    if (this.cancel) return;
    //alert("pause " + this.pauser);
    if (!this.pauser) {
        this.pauser = 1;
    } else {
        this.pauser = 0;
        this.seeking = 0;
		this.pauser = 0;
		this.paused = 0;
		this.total_paused = 0;

        this.start_time = (new Date()).getTime() - this.duration*(this.position);
       // alert("start");
        this.frame();
    }

}

Animation.prototype.seek  = function (perc) {
    if (this.cancel) return;

    this.start_time = (new Date()).getTime() - this.duration*(this.direction == 1 ? perc : 1.0-perc);
    if (this.paused || this.seeking) {
        this.seeking = 1;
        var was_paused = this.pauser;
		this.pauser = 0;
		this.paused = 0;
		this.total_paused = 0;
        this.callback();
        this.pauser = was_paused;
       // this.seeking = 0;
    }



}
