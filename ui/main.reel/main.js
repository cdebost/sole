/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component,
    RunProvider = require("core/run-provider").RunProvider,
    FileService = require("services/file-service").FileService,
    Application = require("montage/core/application").Application;

var $ = require("jquery");
require("core/iscroll_zoom");
require("core/tracker");
require("core/cubic");
require("core/animation");

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    runs: {
        value: null
    },

    _runProvider: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                this._runProvider = new RunProvider().init(new FileService());
                this.addPathChangeListener("selectedRun", this.handleSelectedRunChanged.bind(this));
                this._loadRunPrototypes();
                this.runs.select(this.runs.content[3]);
            }
        }
    },

    handleSelectedRunChanged: {
        value: function(selectedRun) {
            if (selectedRun) {
                this.loadRunData(selectedRun);
            }
        }
    },

    _loadRunPrototypes: {
        value: function() {
            var self = this;
            RunProvider.dataPrototypes.forEach(function(proto) {
                 self.runs.add(proto);
            });
        }
    },
    
    loadRunData: {
        value: function(run) {
            if (run.isDataLoaded) {
                return;
            }
            this._runProvider.loadRunData(run)
            .then(function() {
                Application.prototype.dispatchEventNamed("runDataLoaded", true, true, {
                    runId: run.id
                });
            });
        }
    }
});

function loaded() {
    APP = new App();
    APP.build();
    // APP.readData(APP.current_run);
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


    // this.current_run = this.runs[3];
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

// App.prototype.pause = function () {
//
//
// }


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

// App.prototype.interpolate = function (time, run, list, stats, v) {
//
//     var first = -1;
//     var second = 0;
//     for (var a = 0; a < list.length; a++) {
//         if (list[a][0] <= time) first = a;
//         else {
//
//             if (first >= 0) { //FOUND BEFORE AND AFTER
//
//                 var perc = (time - list[first][0])/(list[a][0] - list[first][0]);
//
//                 if (v) {
//                     stats.heel = (list[first][3] + (list[a][3] - list[first][3])*perc);
//                 } else {
//                     stats.front = (list[first][4] + (list[a][4] - list[first][4])*perc);
//                     stats.fore = (list[first][3] + (list[a][3] - list[first][3])*perc);
//                     stats.side = (list[first][5] + (list[a][5] - list[first][5])*perc);
//                     stats.up = (list[first][6] + (list[a][6] - list[first][6])*perc);
//                     stats.time = list[first][2];
//
//                     stats.gpos2 = (list[first][13] + (list[a][13] - list[first][13])*perc);
//                     stats.footx2 = (list[first][14] + (list[a][14] - list[first][14])*perc);
//                     stats.footp = (list[first][15] + (list[a][15] - list[first][15])*perc);
//                     stats.front2 = (list[first][16] + (list[a][16] - list[first][16])*perc);
//                     stats.top2 = (list[first][17] + (list[a][17] - list[first][17])*perc);
//                     stats.gpos = (list[first][12] + (list[a][12] - list[first][12])*perc);
//
//                     stats.top = (run.tops[first] + (run.tops[a] - run.tops[first])*perc);
//                     stats.steps = run.steps[a];//(run.steps[first] + (run.steps[a] - run.steps[first])*perc);
//                     stats.stepsm = (run.stepsm[first] + (run.stepsm[a] - run.stepsm[first])*perc);
//                     stats.footx = (run.footx[first] + (run.footx[a] - run.footx[first])*perc);
//                     stats.otops = run.tops[a];
//                     console.log( a + " STEPS = " + stats.steps + " otops=" + stats.otops + " top2=" + stats.top2 + " run.tops[" + first + "] = " + run.tops[first] + " run.tops[" + a + "] = " + run.tops[a] + " == stat.top = " + stats.top);
//
//
//                 }
//                 return;
//
//
//             } else { //FOUND JUST ONE
//                 alert("REALLY HOW?");
//             }
//             return;
//         }
//
//     }
//
// }

// App.prototype.interpolateAll = function (run, stats) {
//
//     var time = stats.timestamp/1000.0;
//     this.interpolate(time,run, run.fore,stats,0);
//     this.interpolate(time,run, run.heel,stats,1);
//
//
// }

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

// App.prototype.buildRuns = function () {
//
//     var ss = "";
//     //alert("build runs");
//     function expand(ar) {
//         return  "<span class=expand>------<br>" + ar[1] + "<br>" + ar[2] + "<br>" + ar[3] + "<br>" + ar[4] + "<br>------</span>" + ar[0];
//     }
//     for (var a = 0; a < this.runs.length; a++) {
//         ss += "<div id=run_" + a + " class='run_item " + (this.current_run == this.runs[a] ? "selected" : "") + "' onClick='APP.loadRun(" + a + ")' >";
//         ss += "<div class=run_item_top>";
//         ss += "<div class=run_item_title>" + this.runs[a].title + "</div>";
//         ss += "<div class=run_item_date>" + ((this.runs[a].date != undefined) ? this.runs[a].date.format("niceDate2") : "<a href='javascript:APP.loadRun(" + a + ");'>LOAD RUN") + "</a></div>";
//         ss += "</div>"
//         ss += "<div id='stats_" + a + "' class=run_item_stats>";
//         if (this.runs[a].stats) {
//             var stats = this.runs[a].stats;
//
//
//             ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>TIME</div>" + expand(stats.dur) + "</div>";
//
//             ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>STEPS</div>" + expand(stats.ste) + "</div>";
//             ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>CADE</div>" + expand(stats.spm) + "</div>";
//             ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>STRIKE</div>" + expand(stats.str) + "</div>";
//             ss += "<div class='run_item_stat " + (this.current_run == this.runs[a] ? "expanded" : "") + "'><div>PRON</div>" + expand(stats.pro) + "</div>";
//
//
//         }
//         ss += "</div>"
//
//         ss += "</div>";
//
//     }
//     if (!this.run_list) this.run_list = document.getElementById("run_list");
//
//     this.run_list.innerHTML = ss;
//
//
// }
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
