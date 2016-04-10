/**
 * @module "ui/foot-view.reel"
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class FootView
 * @extends Component
 */
exports.FootView = Component.specialize(/** @lends FootView.prototype */{
    controller: {
        value: null
    },

    soleDial: {
        value: null
    },

    soleDialg: {
        value: null
    },

    sole: {
        value: null
    },

    soleFront: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            Promise.all([
                this._loadSVG("/assets/sole.svg", this.sole, 0),
                this._loadSVG("/assets/sole_front4.svg", this.soleFront, 0)
            ])
            .spread(function(sole, soleFront) {
                self.sole = sole;
                self.sole_front = soleFront;
            });
        }
    },

    _loadSVG: {
        value: function (filen, parent, classname) {
            return new Promise(function(resolve) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", filen, true);
                xhr.overrideMimeType("image/svg+xml");

                xhr.onload = function () {
                    var svg = xhr.responseXML.documentElement;
                    if (classname) {
                        svg.className = classname;
                    }
                    if (parent) {
                        parent.appendChild(svg);
                    }
                    resolve(svg);
                };
                xhr.send("");
            });
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.controller.addEventListener("frameUpdate", this);
            }
        }
    },

    handleFrameUpdate: {
        value: function (event) {
            var stats = event.detail.stats,
                run = event.detail.run,
                perc = event.detail.perc;

            this.soleDial.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255))))*3 + "deg)";
            if (this.do_dial) { // TODO ??
                this.soleDialg.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255))))*3 + "deg)";
                this.do_dial = 0;
            }

            this.sole_front.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255)))) + "deg)";

            this._paintPressure(stats.fore, stats.heel, stats.side);

            var min = (run.duration/(1000*60))*perc;
            var sec = (min - Math.floor(min))*60;
            var sec2 = Math.floor(sec);
            var hun = (sec - Math.floor(sec))*100;
            var hun2 = Math.floor(hun);
            // this.left_timer["content"] = "\"" + Math.floor(min) + ":" + (sec2 < 10 ? "0" + sec2 : sec2) + ":" + (hun2 < 10 ? "0" + hun2 : hun2) + "\"";

            // this.sole_slider.value = perc*1000;
        }
    },

    _paintPressure: {
        value: function(fore, heel, angle) {
            if (!this.rows) this.rows = {};

            var base = angle - 130;
            // this.sidea.innerHTML = Math.floor(-(angle-128)*.3);
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

                    var index = b - start;
                    if (index < 0) index = 0;
                    if (base < 0) {
                        r = Math.floor(r*(1.0-(delta*index)));
                        g = Math.floor(g*(1.0-(delta*index)));
                    } else {
                        r = Math.floor(r*((1.0-delta*(duration-index))));
                        g = Math.floor(g*((1.0-delta*(duration-index))));
                    }

                    if (r < 0) r = 0;
                    if (g < 0) g = 0;
                    if (r < g) r = g;
                    var op = 1.0;

                    this.rows["c" + b + "_" + a + "_"].style.fill = "rgba(" + r + "," + g + ",0," + op + ")";
                }
            }
        }
    }
});
