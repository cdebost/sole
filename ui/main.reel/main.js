/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

var jq = require("jquery");
require("core/iscroll_zoom");
require("core/tracker");
require("core/cubic");
require("core/animation");

var APP;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    templateDidLoad: {
        value: function() {

        }
    }
});

function loaded() {
    APP = new App();
    APP.build();
    //APP.readData("walk_run_sprint");
    APP.readData(APP.current_run);
}

function App() {
    this.frame = 0;
    this.paused = 0;
    this.foot = 0;
    this.animations = {}
    this.ground_pos = 0;
    this.ground_pos2 = 0;
    this.foot_pos = 0;
    this.gate_dist = 0;
    this.fudge_angle = 30;
    this.distance = 0;
    this.adjust_heel = 0;
    this.level = -28;
    this.smoothing = 1;
    this.ani = 0;

    this.runs = [];
    this.runs.push({id:"ballerina",title:"Ballerina - fore foot"});
    this.runs.push({id:"frog",title:"Frog bouncy pronation"});
    this.runs.push({id:"heel",title:"Extreme heel running"});
    this.runs.push({id:"marathon_pace_9.1",title:"Marathon pace at 9.1min/mile"});
    this.runs.push({id:"pronation",title:"Extreme Pronation"});
    this.runs.push({id:"walk_run_sprint",title:"Progressive Walk, Run, Sprint"});
    this.runs.push({id:"50msec",title:"50 Msec run"});
    this.runs.push({id:"10msec",title:"10 Msec run"});
    this.runs.push({id:"50msecheelandwalk",title:"50 Msec heel and walk"});
    this.runs.push({id:"2milerun",title:"2 Mile Run 50fps"});


    this.current_run = this.runs[3];
    this.current_center = -1;


    this.fps = 1000/20.0;




}


App.prototype.frame = function () {

    setTimeout(function() {
        APP.runtime += APP.fps;
        window.requestAnimationFrame(APP.frame);

        pos = ball.position().top;
        if (pos > xMax || pos < xMin) {
            dir *= -1;
        }

        pos += (dir * speed);
        ball.css('top', pos + 'px');


    }, APP.fps);
}

App.prototype.start = function () {
    var that = this;
    if (!this.start_time) {
        this.start_time = (new Date()).getTime();
    }
    AnimationFrame(function () {
        this.last_time = this.current_time;
        this.current_time = (new Date()).getTime();

        if (this.current_time - this.last_time >= this.fps) {
            that.frame(this.current_time - this.start_time);
        } else {
            setTimeout(function () {
                this.current_time = (new Date()).getTime();
                that.frame(this.current_time - this.start_time);
            }, (this.current_time - this.last_time) - this.fps);
        }


    });


}

App.prototype.pause = function () {


}


App.prototype.getCSS = function (val, key, value) {
    for (var s = 0; s < document.styleSheets.length; s++) {
        var sheet = document.styleSheets[s];
        for (var r = 0; sheet.rules && r < sheet.rules.length; r++) {
            if (sheet.rules[r].selectorText == val) {
                return sheet.rules[r].style;
            }
        }
    }
    alert("cant find " + val);
    return 0;
}

App.prototype.setCSS = function (val, key, value) {
    for (var s = 0; s < document.styleSheets.length; s++) {
        var sheet = document.styleSheets[s];
        for (var r = 0; sheet.rules && r < sheet.rules.length; r++) {
            if (sheet.rules[r].selectorText == val) {
                sheet.rules[r].style[key] = value;
                return 1;
            }
        }
    }
    return 0;
}


App.prototype.loadSVG = function (filen, parent, classname, callback) {
    var that = this;

    xhr = new XMLHttpRequest();
    xhr.open("GET",filen,true);
    xhr.overrideMimeType("image/svg+xml");

    xhr.onload = function (e) {
        var svg = xhr.responseXML.documentElement;
        if (classname) svg.className = classname;

        if (d = document.getElementById(parent)) {
            d.appendChild(svg);

        }
        if (callback) callback(svg);
    }
    xhr.send("");
}



var scrolling = 0;

function poster (id , dir) {
    if (dir) document.getElementById("poster").classList.add(id);
    else document.getElementById("poster").classList.remove(id);

}

App.prototype.build = function (){
    var that = this;
    //LOAD THE TRASH
    this.loadSVG("/assets/sole.svg","sole",0, function (s) {
        that.sole = s;

        //setTimeout(function () {
//			that.loadSVG("shoe.svg","shoe",0, function (s) {
//				that.shoe = s;
        that.shoe = document.getElementById("shoe");//s;

        // setTimeout(function () {
        that.loadSVG("/assets/sole_front4.svg","sole_front",0, function (s) {
            that.sole_front = s;

            //setTimeout(function () {
            //try {
            //	that.loadSVG("sole_side.svg","sole_side",0, function (s) {
            //		that.sole_side = s;
            //	});
            //} catch (error) {
            //    console.log(error);
            //}
            //},100);


        });
        //},100);

//			});
        //},100);

    });
    this.sole_fslider = document.getElementById("sole_fslider");

    if (0) {
        this.sole_fslider.addEventListener("mousedown", function() {
            var listener = function() {
                window.requestAnimationFrame(function() {
                    that.seekmini(that.sole_fslider.value);
                });
            };
            listener();
            that.sole_fslider.addEventListener("mousemove", listener);
            var up = function () {
                that.sole_fslider.removeEventListener("mousemove",listener);
                that.sole_fslider.removeEventListener("mouseup", up);
            }
            that.sole_slider.addEventListener("mouseup", up);
        });
    }

    this.sole_slider = document.getElementById("sole_slider");

    if (0) {
        this.sole_slider.addEventListener("mousedown", function() {
            var listener = function() {
                window.requestAnimationFrame(function() {
                    that.seek(that.sole_slider.value);
                });
            };
            listener();
            that.sole_slider.addEventListener("mousemove", listener);
            var up = function () {
                that.sole_slider.removeEventListener("mousemove",listener);
                that.sole_slider.removeEventListener("mouseup", up);
            }
            that.sole_slider.addEventListener("mouseup", up);
        });
    }

    this.heelp = document.getElementById("v_heelp_in");
    this.time = document.getElementById("v_time_in");
    this.frona = document.getElementById("v_frona_in");
    this.forep = document.getElementById("v_forep_in");
    this.sidea = document.getElementById("v_sidea_in");
    this.upa = document.getElementById("accel");
    this.cade = document.getElementById("v_cade_in");
    this.stepsc = document.getElementById("v_steps_in");
    this.stepsmc = document.getElementById("v_stepsm_in");
    this.stepscad = document.getElementById("v_stepscad_in");
    this.ground = document.getElementById("ground");
    this.groundb = document.getElementById("groundb");
    //alert(window.innerWidth);
    this.groundb_position = window.innerWidth <= 375 ? -100 : 0;
    this.sole_dialg = document.getElementById("sole_dialg");
    this.left_timer = this.getCSS(".sole_slider_bottom::before");
    this.sole_dial = document.getElementById("sole_dial");
    this.right_timer = this.getCSS(".sole_slider_bottom::after");

    this.tryangle = document.getElementById("tryangle");
    // this.tryangle.value = this.fudge_angle;
    return;

    var wrapper = document.getElementById("app_wrapper");
    var scroller = document.getElementById("app_scroller");
    var iscroll = new IScroll(wrapper, {
        scrollX: false,
        scrollY: true,
        eventPassthrough:"horizontal",
        momentum: true,
        directionLockThreshold:1000,
        keyBindings: true,
        useTransition:false,
        mouseWheel:true,
        bounceTime: 500,
        fclick:function (e) {
            alert("MAIN " + e.id);
        },
    });
    iscroll.onStart = function (t) {scrolling = 0;}
    iscroll.onMove = function (t) {scrolling = 1;}
    iscroll.onEnd = function (t) {setTimeout(function () {scrolling = 0;},100);}

    setTimeout(function () {
        scroller.style.height = apps.length*120 + "px";
        iscroll.refresh();
    }, 1000);

}

App.prototype.start2 = function () {

    var that = this;
    curr = this.fore[this.frame];
    next = this.fore[that.frame+1];

    // console.log("FRAME " + this.frame + " " + (next[0] - curr[0])*1000);

    dist = (next[0] - curr[0])*1500;



    setTimeout(function () {
        //if (!that.clock) that.clock = document.getElementById("clock");
        that.time.innerHTML = curr[2];

        that.shoe.style.transform = "scale(.35) translateX(" + that.foot_pos*1.42 + ") translateY(" + (-200 + curr[6])+ "px) rotate(" + (-45 +(90*(curr[4]/255))) + "deg)";
        that.sole_front.style.transform = "rotate(" + (-45 +(90*(curr[5]/255))) + "deg)";
        if (that.frame >= that.fore.length-1) that.frame = 0;
        else that.frame++;
        that.start();
    },(next[0]-curr[0])*1500);


}
App.prototype.paintPressure = function (fore, heel, angle) {
    if (!this.rows) this.rows = {};
    this.heelp.innerHTML = Math.round(heel);
    this.forep.innerHTML = Math.round(fore);

    var base = angle - 130;
    // var ang = angle < base ? base-angle
    this.sidea.innerHTML = Math.floor(-(angle-128)*.3);
    var delta = Math.abs((base/130) / (10.0 + (1.0-(base/130.0))*10.0));

    var start = Math.floor(10.0 + (1.0-(Math.abs(base)/130.0))*10.0);
    var duration = Math.floor(10.0 + (1.0-(Math.abs(base)/130.0))*10.0);

    if (base < 0) start = 0;
    else start = 20 - duration;

    var take = fore;
    if (heel > take) take = heel;

    // console.log("DELTA base=" + base + " delta=" + delta);
    for (var a = 0; a < 46; a++) {
        var sd = 1.0;

        for (var b = 0; b < 20; b++) {

            if (!this.rows["c" + b + "_" + a + "_"]) this.rows["c" + b + "_" + a + "_"] = document.getElementById("c" + b + "_" + a + "_");

            var r  = Math.floor((fore/100)*255.0*((46-a)/46.0));
            if (r > 255) r = 255;
            if (r < 0) r = 0;

            var g  = Math.floor((heel/100)*255.0*((a)/46.0));
            if (g > 255) g = 255;
            if (g < 0) g = 0;

            //var max = 0;
            //if (r > max) max = r;
            // if (g > max) max = g;


            var index = b - start;
            if (index < 0) index = 0;
            if (base < 0) {
                r = Math.floor(r*(1.0-(delta*index)));
                g = Math.floor(g*(1.0-(delta*index)));
                //console.log(base + " index=" + index  + " perc=" + (1.0-(delta*index)));
            } else {
                r = Math.floor(r*((1.0-delta*(duration-index))));
                g = Math.floor(g*((1.0-delta*(duration-index))));
                //console.log(base + " index=" + index  + " delta=" + delta + " perc=" + (1.0-delta*(duration-index)));

            }

            if (r < 0) r = 0;
            if (g < 0) g = 0;
            if (r < g) r = g;
            var op = 1.0;//(max/255.0)*(1.0-(delta*b));
            //if (op < 0) op = 0;

            this.rows["c" + b + "_" + a + "_"].style.fill = "rgba(" + r + "," + g + ",0," + op + ")";
            //sd -= delta;
            //else console.log("no style " + a + " " + b);
        }
    }
    //  console.log("fore pressure = " + fore);

}

App.prototype.interpolate = function (time, run, list, stats, v) {

    var first = -1;
    var second = 0;
    for (var a = 0; a < list.length; a++) {
        if (list[a][0] <= time) first = a;
        else {

            if (first >= 0) { //FOUND BEFORE AND AFTER

                var perc = (time - list[first][0])/(list[a][0] - list[first][0]);

                if (v) {
                    stats.heel = (list[first][3] + (list[a][3] - list[first][3])*perc);
                } else {
                    stats.front = (list[first][4] + (list[a][4] - list[first][4])*perc);
                    stats.fore = (list[first][3] + (list[a][3] - list[first][3])*perc);
                    stats.side = (list[first][5] + (list[a][5] - list[first][5])*perc);
                    stats.up = (list[first][6] + (list[a][6] - list[first][6])*perc);
                    stats.time = list[first][2];

                    stats.gpos2 = (list[first][13] + (list[a][13] - list[first][13])*perc);
                    stats.footx2 = (list[first][14] + (list[a][14] - list[first][14])*perc);
                    stats.footp = (list[first][15] + (list[a][15] - list[first][15])*perc);
                    stats.front2 = (list[first][16] + (list[a][16] - list[first][16])*perc);
                    stats.top2 = (list[first][17] + (list[a][17] - list[first][17])*perc);
                    stats.gpos = (list[first][12] + (list[a][12] - list[first][12])*perc);

                    stats.top = (run.tops[first] + (run.tops[a] - run.tops[first])*perc);
                    stats.steps = run.steps[a];//(run.steps[first] + (run.steps[a] - run.steps[first])*perc);
                    stats.stepsm = (run.stepsm[first] + (run.stepsm[a] - run.stepsm[first])*perc);
                    stats.footx = (run.footx[first] + (run.footx[a] - run.footx[first])*perc);
                    stats.otops = run.tops[a];
                    console.log( a + " STEPS = " + stats.steps + " otops=" + stats.otops + " top2=" + stats.top2 + " run.tops[" + first + "] = " + run.tops[first] + " run.tops[" + a + "] = " + run.tops[a] + " == stat.top = " + stats.top);


                }
                return;


            } else { //FOUND JUST ONE
                alert("REALLY HOW?");
            }
            return;
        }

    }

}

App.prototype.interpolateAll = function (run, stats) {

    var time = stats.timestamp/1000.0;
    this.interpolate(time,run, run.fore,stats,0);
    this.interpolate(time,run, run.heel,stats,1);


}

App.prototype._start = function (t) {
    var that = this;
    var run = this.current_run;
    if (!this.left_timer) this.left_timer = this.getCSS(".sole_slider_bottom::before");

    //TAKE THE GREATER OF THE START TIMES AND THE LESSER OF THE END TIMES
    var start = ((run.fore[0][0] > run.heel[0][0]) ? run.fore[0][0] : run.heel[0][0]) ;
    var end = ((run.fore[run.fore.length-2][0] < run.heel[run.heel.length-2][0]) ? run.fore[run.fore.length-2][0] : run.heel[run.heel.length-2][0]) ;
    run.start = start*1000;
    run.samples = (run.fore.length-2);
    run.duration = (end - start)*1000;
    //alert(run.duration/(1000*60));
    var last_time = (new Date()).getTime();
    var last_dist = 0;
    var dist = 0;

    var stats = {timestamp:0,heel:0,fore:0,side:0,front:0,up:0};
    this.ani = new Animation(0, 0, 0, 1, run.duration, function (perc) {

        stats.timestamp = run.start + run.duration*perc;

        that.interpolateAll(run,stats);
        var tp = stats.top2;
        var s = Math.floor(stats.steps);
        if (s < 0) {
            that.stepsc.innerHTML = Math.abs(s);
            that.stepsc.classList.add("down");
            stats.front2 = that.level;
            tp = 168;//stats.top;
        } else {
            that.stepsc.innerHTML = s;
            that.stepsc.classList.remove("down");
            stats.front2 = (stats.front2-128)*.7;

        }
        //console.log(stats.steps + " tp=" + tp + " otop=" + stats.otop + " top2=" + stats.top2 + " heel=" + stats.heel + " top=" + stats.top + "");
        if (stats.heel > 20) {
            stats.front2 = that.level;
            tp = 168;//stats.top;
        }
        if (tp < -100) tp = stats.top;

        that.stepsmc.innerHTML = Math.round(stats.stepsm);
        that.stepscad.innerHTML = Math.round(stats.front);


        var d = (new Date()).getTime();

        var spm = stats.stepsm/1.5;//HERE

        var gpos = stats.gpos;
        var gpos2 = stats.gpos2;
        while (gpos > 400) gpos = gpos - 400;
        while (gpos2 > 1600) gpos2 = gpos2 - 1600;
        that.groundb.style["backgroundPosition"] = gpos2*.25 + "px " + that.groundb_position + "px";
        that.ground.style["backgroundPosition"] = gpos + "px 0px";

        that.upa.style.transform = "translateY(" + (-stats.up*.5) + "px)";

        //stats.top2 = stats.otops;

        that.shoe.style.transform = "scale(.25) translateX(" + Math.floor(stats.footp*3) + "px) translateY(" + Math.floor(tp) + "px) rotate(" + Math.floor(that.fudge_angle + ((stats.front2))) + "deg)";
        //console.log("scale(.25) translateX(" + Math.floor(stats.footp*2) + "px) translateY(" + Math.floor(stats.top) + "px) rotate(" + Math.floor(that.fudge_angle + ((stats.front))) + "deg)");

        that.sole_front.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255)))) + "deg)";

        that.sole_dial.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255))))*3 + "deg)";
        if (that.do_dial) {
            that.sole_dialg.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255))))*3 + "deg)";
            that.do_dial = 0;
        }

        if (stats.fore > 80) that.shoe.style.backgroundPosition = "0px -1182px";
        else if (stats.fore > 60) that.shoe.style.backgroundPosition = "0px -788px";
        else if (stats.fore > 40) that.shoe.style.backgroundPosition = "0px -394px";
        else that.shoe.style.backgroundPosition = "0px 0px";


        that.paintPressure(stats.fore, stats.heel, stats.side);

        var min = (run.duration/(1000*60))*perc;
        var sec = (min - Math.floor(min))*60;
        var sec2 = Math.floor(sec);
        var hun = (sec - Math.floor(sec))*100;
        var hun2 = Math.floor(hun);
        that.left_timer["content"] = "\"" + Math.floor(min) + ":" + (sec2 < 10 ? "0" + sec2 : sec2) + ":" + (hun2 < 10 ? "0" + hun2 : hun2) + "\"";

        that.time.innerHTML = stats.time.substring(0,stats.time.indexOf("."));

        that.sole_slider.value = perc*1000;


        return 1;
    }, function (callback) {
        callback(0);
    }, 0, "Linear.None", 60, 0, 0);




}

App.prototype.start = function (t) {
    var that = this;
    if (!this.ani) {
        this._start();
        setTimeout(function () {that.start(t)},100);
        return;
    }





    //alert(t.classList.contains("go"));
    if (t.classList.contains("go")) {
        t.setAttribute("data-status","playing");
        document.getElementById("sole_slider").setAttribute("data-status","playing");
        document.getElementById("sole_fslider").setAttribute("data-status","playing");
        t.classList.remove("go");
        t.classList.add("pause");
        this.ani.pauser = 1;
        this.ani.pause();
        this.current_center = -1;

        that.frame = that.paused;
        //this.next_frame(1);
    } else {
        t.setAttribute("data-status","paused");
        document.getElementById("sole_slider").setAttribute("data-status","paused");
        document.getElementById("sole_fslider").setAttribute("data-status","paused");
        t.classList.remove("pause");
        t.classList.add("go");
        this.current_center = -1;

        this.ani.pause();
        //that.paused = that.frame;
        this.sole_fslider.value = 0;
        that.frame = -1;

    }

}

App.prototype.seekmini = function (t) {
    var run = this.current_run;

    if (this.current_center == -1) {
        console.log("SEEK MINI " + this.ani.value);
        console.log("LOOKING FOR start=" + run.start + " dur=" + run.duration + " == " + (run.start + run.duration*this.ani.value));
        var search = (run.start + run.duration*this.ani.value)/1000;

        var first = -1;
        var second = 0;
        for (var a = 0; a < run.fore.length; a++) {
            if (run.fore[a][0] <= search) {
                console.log(run.fore[a][0] + " <= " +  search);
                first = a;
            } else {

                if (first >= 0) { //FOUND BEFORE AND AFTER
                    console.log("FOUND CENTER " + a);
                    this.current_center = a;
                    break;


                } else { //FOUND JUST ONE
                    alert("REALLY HOW?");
                }
                console.log("RETURN???");
                return;
            }

        }
        console.log("DONE SEEKING " + this.current_center);

    }
    var index = this.current_center + t*1.0;
    if (index < 0) index = 0;
    else if (index > run.fore.length-2) index = run.fore.length-2;

    var timestamp = run.fore[index][0]*1000;

    perc = (timestamp - run.start) / run.duration;
    console.log("SET SEEK TO " + perc);
    this.ani.seek(perc);
}

App.prototype.readCSV = function (src, callback) {
    var that = this;
    var xquery = "file.php";
    //var src = src;
    if (!src) {
        console.log("ATTEMPT TO LOAD BAD SRC " + src);
        if (callback) callback(0);
        return;

    }

    console.log("LOADING JSON " + src);
    AUTH2 = $.post(xquery, {type: "load", name:src}, function (ret) {
        if (!ret || ret == "") {
            console.log("LOADED??? JSON " + src);
            if (callback) callback(0);
            return;
        }
        var loader = ret;
        console.log("LOADED JSON " + src);

        if (callback) callback(loader);


    }).fail(function (ret) {
        console.log("READJSON FAIL " + ret);
        if (callback) callback(0);
    });
}



App.prototype.calcSteps = function (run) {

    var instep = 0;
    var steps_count = 0;
    var onheel = 0;

    run.steps = [];
    run.stepsm = [];
    run.tops = [];
    run.footx = [];
    run.strikes = [];
    run.prones = [];

    var last_step_time = 0;
    var steps_per_minute = 0;
    var current_time = 0;
    var t_instep = 0;
    var t_distance = 0;
    var t_foot_pos = 0;
    var t_footx = 0;
    var t_ground_pos = 0;
    var t_ground_pos2 = 0;
    var last_time = run.fore[0][0]*1000;

    for (var a = 0; a < run.fore.length; a++) {
        var heel = 0;
        if (a < run.heel.length) {
            heel = run.heel[a][3];

        }

        var fa = (run.fore[a][4]);
        //ADJUST ANY ANGLE NOT INLINE
        if (this.smoothing) {
            var fa1 = (a < run.fore.length-1) ? run.fore[a+1][4] : 0;
            var fa2 = (a < run.fore.length-2) ? run.fore[a+2][4] : 0;
            if (fa1 > fa) {
                if (!(fa1 > fa && fa1 < fa2)) {
                    run.fore[a+1][4] = fa + (fa2 - fa)*.5;
                }
            } else if (fa1 < fa) {
                if (!(fa1 < fa && fa1 > fa2)) {
                    run.fore[a+1][4] = fa + (fa2 - fa)*.5;
                }
            }
        }

        var fore = run.fore[a][3];
        var fore1 = (a < run.fore.length-1) ? run.fore[a+1][3] : 0;
        var fore2 = (a < run.fore.length-2) ? run.fore[a+2][3] : 0;
        var fore3 = (a < run.fore.length-3) ? run.fore[a+3][3] : 0;

        // var fa2 = (fa-128)*.7;

        if (heel > 20) fa = (this.level/.7)+128;


        if (onheel && instep && heel == 0 && fore == 0) {
            if (fore1 > 30 || fore2 > 30 || fore3 > 30) fore = 30;
        }
        if (!instep && (heel > 30 || fore > 30)) {
            instep = 1;
            current_time = run.fore[a][0]*1000;
            if (last_step_time) {
                steps_per_minute = (1000*60)/(current_time - last_step_time)*2;
            }
            run.strikes[a] = isNaN(run.fore[a][4]) ? "none" : ((run.fore[a][4])-128)*.7;
            run.prones[a] = (run.fore[a][5]);
            last_step_time = current_time;
            steps_count++;

            if (heel > 30) onheel = 1;
            else onheel = 0;
        } else if (instep && heel == 0 && fore == 0) {
            instep = 0;
            onheel = 0;
            run.strikes[a] = "none";
            run.prones[a] = "none";

        } else if (heel > 30) {
            onheel = 1;
            run.strikes[a] = "none";
            run.prones[a] = "none";
        } else {
            run.strikes[a] = "none";
            run.prones[a] = "none";
        }


        if (fa < 260) {

            var p = [50,60,70,80,100,110,130,145,160,170,175,155,125,105,85,70,60,50,40,35,35,40,45,55,55,55];
            var p1 = Math.floor(fa/10.0);
            var p2 = Math.ceil(fa/10.0);
            var diff = fa/10.0 - p1;
            var t = p[p1] + (p[p2] - p[p1])*diff;
            //console.log("INDEX=" + a + " FRONT ANGLE = " + fa + " TOP= " + t);
            run.tops[a] = t;

        }
        else {
            //console.log("ZEROOOOOOOOOOOOO");
            run.tops[a] = 0;
        }


        run.steps[a] = (instep ? -steps_count : steps_count);
        t_footx = run.footx[a] = (instep ? -1 : 1);

        run.stepsm[a] = steps_per_minute;

    }


    run.stats = {};
    var dist = Math.floor(run.fore.length/4.0);
    run.stats.ste = [];
    run.stats.ste[0] = Math.round(Math.abs(run.steps[run.fore.length-2]))*2 ;
    run.stats.ste[1] = Math.round((Math.abs(run.steps[(dist*(1))-1]) - Math.abs(run.steps[(dist*(0))])) )*2;
    run.stats.ste[2] = Math.round((Math.abs(run.steps[(dist*(2))-1]) - Math.abs(run.steps[(dist*(1))])) )*2;
    run.stats.ste[3] = Math.round((Math.abs(run.steps[(dist*(3))-1]) - Math.abs(run.steps[(dist*(2))])) )*2;
    run.stats.ste[4] = Math.round((Math.abs(run.steps[(dist*(4))-2]) - Math.abs(run.steps[(dist*(3))])) )*2;

    run.stats.spm = [];
    run.stats.spm[0] = Math.round(Math.abs(run.steps[run.fore.length-2]) / (run.fore[run.fore.length-2][0] - run.fore[0][0])*60)*2;
    run.stats.spm[1] = Math.round((Math.abs(run.steps[(dist*(1))-1]) - Math.abs(run.steps[(dist*(0))])) / (run.fore[(dist*(1))-1][0] - run.fore[(dist*(0))][0])*60)*2;
    run.stats.spm[2] = Math.round((Math.abs(run.steps[(dist*(2))-1]) - Math.abs(run.steps[(dist*(1))])) / (run.fore[(dist*(2))-1][0] - run.fore[(dist*(1))][0])*60)*2;
    run.stats.spm[3] = Math.round((Math.abs(run.steps[(dist*(3))-1]) - Math.abs(run.steps[(dist*(2))])) / (run.fore[(dist*(3))-1][0] - run.fore[(dist*(2))][0])*60)*2;
    run.stats.spm[4] = Math.round((Math.abs(run.steps[(dist*(4))-2]) - Math.abs(run.steps[(dist*(3))])) / (run.fore[(dist*(4))-2][0] - run.fore[(dist*(3))][0])*60)*2;

    function print_time(dur) {
        var min = dur;
        var sec = Math.floor((min - Math.floor(min))*60);

        return Math.floor(min) + ":" + (sec < 10 ? "0" + sec : sec);
    }
    run.stats.dur = [];
    run.stats.dur[0] = print_time((run.fore[run.fore.length-2][0] - run.fore[0][0])/(60));
    run.stats.dur[1] = print_time((run.fore[(dist*(1))-1][0] - run.fore[(dist*(0))][0])/(60));
    run.stats.dur[2] = print_time((run.fore[(dist*(2))-1][0] - run.fore[(dist*(1))][0])/(60));
    run.stats.dur[3] = print_time((run.fore[(dist*(3))-1][0] - run.fore[(dist*(2))][0])/(60));
    run.stats.dur[4] = print_time((run.fore[(dist*(4))-2][0] - run.fore[(dist*(3))][0])/(60));

    this.setCSS(".sole_slider_bottom::after","content",'"' + run.stats.dur[0] + ':00"' );
    if (!this.left_timer) this.left_timer = this.getCSS(".sole_slider_bottom::before");

    this.start_timer = run.fore[0][0];


    var strikes = [0,0,0,0,0];
    var strikes_cnt = [0,0,0,0,0];
    var prones = [0,0,0,0,0];
    var prones_cnt = [0,0,0,0,0];

    for (var a = 0; a < 4; a++) {
        for (var f = dist*a; f < dist*a + dist; f++) {
            var st = run.strikes[f];
            var pr = run.prones[f];
            // console.log("strike " + f + " " + st);
            if (st != "none" && st != undefined) {
                strikes[0] = strikes[0] +  st*1;
                strikes_cnt[0] = strikes_cnt[0]+1;
                strikes[a+1] = strikes[a+1] + st;
                strikes_cnt[a+1] = strikes_cnt[a+1]+1;

            }
            if (pr != "none" && pr != undefined) {
                prones[0] = prones[0] +  pr*1;
                prones_cnt[0] = prones_cnt[0]+1;
                prones[a+1] = prones[a+1] + pr;
                prones_cnt[a+1] = prones_cnt[a+1]+1;

            }
        }
    }
    run.stats.str = [];
    run.stats.str[0] = Math.round(strikes[0]/strikes_cnt[0]);
    run.stats.str[1] = Math.round(strikes[1]/strikes_cnt[1]);
    run.stats.str[2] = Math.round(strikes[2]/strikes_cnt[2]);
    run.stats.str[3] = Math.round(strikes[3]/strikes_cnt[3]);
    run.stats.str[4] = Math.round(strikes[4]/strikes_cnt[4]);

    run.stats.pro = [];
    run.stats.pro[0] = Math.floor(-(Math.round(prones[0]/prones_cnt[0])-128)*.3);
    run.stats.pro[1] = Math.floor(-(Math.round(prones[1]/prones_cnt[1])-128)*.3);
    run.stats.pro[2] = Math.floor(-(Math.round(prones[2]/prones_cnt[2])-128)*.3);
    run.stats.pro[3] = Math.floor(-(Math.round(prones[3]/prones_cnt[3])-128)*.3);
    run.stats.pro[4] = Math.floor(-(Math.round(prones[4]/prones_cnt[4])-128)*.3);


    //PAD THE PRESSURE SENSITIVITY BY EXTENDING FOOT DOWN BY ONE FRAME
    var cnt = 0;
    var up = 0;
    while (cnt < run.footx.length) {
        if (cnt && (run.footx[cnt] == -1) && (run.footx[cnt-1] == 1)) run.footx[cnt-1] = -1;
        if (0 && (cnt < run.footx.length-1) && (run.footx[cnt] == -1) && (run.footx[cnt+1] == 1)){
            //      run.footx[cnt+1] = -1;
            //      cnt += 2;
        } else cnt++;
    }

    //CALC THE RETURN FOOT DISTANCE PERCENTAGES
    var down = 0;
    var cnt = 0;
    var up = 0;


    while (cnt < run.footx.length) {
        if (run.footx[cnt] < 0) {
            down++;
            cnt++;
            up = 0;
        } else {
            while(run.footx[cnt + up] > 0) {
                up++;
            }
            var sum = 0;
            while(run.footx[cnt] > 0) {
                //run.footx[cnt] = down*1.0/up;
                sum = sum + 1/up;
                run.footx[cnt] = sum;
                cnt++;
            }
            down = 0;
        }
    }

    var t_percs = [];
    // console.log("TRACKER = " + this.footx);

    for (var a = 0; a < run.fore.length; a++) {
        var foot_a1 = run.footx[a];
        var foot_a2 = a < run.fore.length-1 ? run.footx[a+1] : run.footx[a];
        var fa = (run.fore[a][4]);

        var d = run.fore[a][0]*1000;
        var spm =  run.stepsm[a]/1.5;//HERE

        var delta = Math.floor((d - last_time)*(spm/220*1.5));// * (spm > 150 ? (spm/150.0)*2 : 1.0);
        t_ground_pos +=  delta;
        t_ground_pos2 +=  delta;

        var top = run.tops[a];
        var f1 = fa;
        var p2 = heel;

        if (foot_a1 == -1) {
            if (!t_instep) {
                t_distance = 0;
                t_dist = 0;
                t_foot_pos = 0;
                t_instep = 1;
            }
            t_foot_pos += delta;
            //	console.log(a + " --> " + t_foot_pos + " top = " + top);



        } else {
            var cnt = 0;
            while (run.footx[a+cnt] >= 0) cnt++;
            if (t_instep) {
                t_distance = t_foot_pos;
                t_dist = t_foot_pos;
                t_perc = 1/(cnt+1);
                var tot = 0;
                for (var p = 1; p < cnt+1; p++) {
                    t_percs.push(AnimationEasing.Quartic.InOut(p*t_perc));
                }
                console.log(t_percs);
                t_instep = 0;
            }

            var retperc = foot_a1;//(foot_a1 + (foot_a2 - foot_a1)*(perc));
            if (retperc < 0) retperc = 0;
            else if (retperc > 1) retperc = 1.0;

            top = run.tops[a] -  CUB.calcIntersectionAt(retperc)*(200*spm/220)*2;
            t_foot_pos = Math.floor((t_percs[t_percs.length-1]*t_distance));//(foot_a2 >= 0) ? t_distance - (foot_a1*t_distance) : t_foot_pos;
            t_dist = t_distance-(t_percs[t_percs.length-1]*t_distance);//t_perc;
            if (t_percs.length) t_percs.pop();

            //	console.log(a + " <--- " + t_foot_pos + " top = " + top);

        }

        if (t_foot_pos < 0) t_foot_pos = 0;
        if (t_foot_pos > 500) t_foot_pos = 500;
        t_footx = t_foot_pos;

        run.fore[a][12] = t_ground_pos;
        run.fore[a][13] = t_ground_pos2;
        run.fore[a][14] = t_footx;
        run.fore[a][15] = t_foot_pos;
        run.fore[a][16] = f1;
        run.fore[a][17] = top;
        run.fore[a][18] = t_distance;

        last_time = d;



    }


}

App.prototype.readData = function (run) {
    var that = this;

    console.log("====readCSV(runs/"+run.id+"/fore.csv)");
    this.readCSV("runs/" + run.id + "/fore.csv",function (ret) {
        console.log("======ret:", ret);
        if (!ret) {
            alert("problem loading " + run.id + "/fore.csv");
            return;
        }
        run.fore = [];
        var data = ret.split("\n");
        console.log("======data:", data);
        for (var a = 1; a < data.length; a++) {
            var fields = data[a].split(",");
            for (var b = 0; b < fields.length;b++) {
                if (b == 1 || b == 2) continue;
                else fields[b] = fields[b]*1.0;
            }
            console.log("run.fore.push(", fields, ")");
            run.fore.push(fields);
            console.log("FORE + " + run.fore[run.fore.length-1]);
        }
        that.readCSV("runs/" + run.id + "/heel.csv",function (ret) {
            if (!ret) {
                alert("problem loading " + run.id  + "/heel.csv");
                return;
            }
            run.heel = [];
            document.getElementById("run_title").innerHTML = run.title;
            run.date = new Date();
            var d1 = run.fore[0][1];
            var d2 = run.fore[0][2];
            d1 = d1.split(".");
            d2 = d2.split(":");
            run.date.setMonth(d1[1]-1);
            run.date.setDate(d1[0]);
            run.date.setFullYear("20" + d1[2]);
            run.date.setHours(d2[0]);
            run.date.setMinutes(d2[1]);
            run.date.setSeconds(d2[2]);
            document.getElementById("run_date").innerHTML = run.date.format("fullDate");


            var data = ret.split("\n");
            for (var a = 1; a < data.length; a++) {
                var fields = data[a].split(",");
                for (var b = 0; b < fields.length;b++) {
                    if (b == 1 || b == 2) continue;
                    else fields[b] = fields[b]*1.0;
                }
                run.heel.push(fields);
            }

            APP.calcSteps(run);
            APP.buildRuns();

        });


    });


}

App.prototype.seek = function (t) {
    //console.log(t);
    if (APP.ani) APP.ani.seek(t/1000.0);
    this.current_center = -1;
    return;




}


//double CubicInterpolate(
//   double y0,double y1,
//   double y2,double y3,
//   double mu)
//{
//   double a0,a1,a2,a3,mu2;
//
//   mu2 = mu*mu;
//   a0 = y3 - y2 - y0 + y1;
//   a1 = y0 - y1 - a0;
//   a2 = y2 - y0;
//   a3 = y1;
//
//   return(a0*mu*mu2+a1*mu2+a2*mu+a3);
//}



App.prototype.tryAngle = function (t) {

    this.fudge_angle = t.value*1.0;

}

App.prototype.parse = function (filename,str) {
    //Date,Time,ForefeetPressure,FrontAngle,SideAngle,UpAngle,Cadence,Speed,Lat,Lon,Date,Time,HeelPressure,FrontAngle,SideAngle,UpAngle,Device

    if (!this.files) this.files = {};
    if (!this.files[filename]) this.files[filename] = {};
    if (!this.files[filename].values) this.files[filename].values = [];
    var a = str.split(",");
    var t = a[11];
    t = t.substring(t.indexOf(":")+1, t.length);
    a[11] = t;
    for (var b = 0;b < a.length; b++) a[b] = a[b]*1.0;
    this.files[filename].values.push(a);
    this.current = this.files[filename].values;


}

App.prototype.buildRuns = function () {

    var ss = "";
    //alert("build runs");
    function expand(ar) {
        return  "<span class=expand>------<br>" + ar[1] + "<br>" + ar[2] + "<br>" + ar[3] + "<br>" + ar[4] + "<br>------</span>" + ar[0];
    }
    for (var a = 0; a < this.runs.length; a++) {
        ss += "<div id=run_" + a + " class='run_item " + (this.current_run == this.runs[a] ? "selected" : "") + "' onClick='APP.loadRun(" + a + ")' >";
        ss += "<div class=run_item_top>";
        ss += "<div class=run_item_title>" + this.runs[a].title + "</div>";
        ss += "<div class=run_item_date>" + ((this.runs[a].date != undefined) ? this.runs[a].date.format("niceDate2") : "<a href='javascript:APP.loadRun(" + a + ");'>LOAD RUN") + "</a></div>";
        ss += "</div>"
        ss += "<div id='stats_" + a + "' class=run_item_stats>";
        if (this.runs[a].stats) {
            var stats = this.runs[a].stats;


            ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>TIME</div>" + expand(stats.dur) + "</div>";

            ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>STEPS</div>" + expand(stats.ste) + "</div>";
            ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>CADE</div>" + expand(stats.spm) + "</div>";
            ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>STRIKE</div>" + expand(stats.str) + "</div>";
            ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>PRON</div>" + expand(stats.pro) + "</div>";


        }
        ss += "</div>"

        ss += "</div>";

    }
    if (!this.run_list) this.run_list = document.getElementById("run_list");

    this.run_list.innerHTML = ss;


}
App.prototype.expandAll = function (t) {
    //if (t.classList && t.classList.contains("expand")) t.classList.add("selected");

    for (var a = 0; t.childNodes && a < t.childNodes.length; a++) {
        t.childNodes[a].classList.add("expanded");
        //alert(t.childNodes[a].classList);
        //this.expandAll(t.childNodes[a]);
    }
}
App.prototype.loadRun = function (index, p) {

    //ClassQuery(".run_item_stat",function (v) {
    //     if (v.classList) v.classList.remove("selected");
//
    // });
    var t = document.getElementById("stats_" + index);
    if (t) this.expandAll(t);
    this.ani.cancel = 1;
    this.ani = 0;

    this.current_run = this.runs[index];
    if (this.current_run.date) {
        APP.calcSteps(this.current_run);
        APP.buildRuns();
    } else {
        this.readData(APP.current_run);
    }
    this.toggleMenu();

}
