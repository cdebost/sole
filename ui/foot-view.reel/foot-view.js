/**
 * @module "ui/foot-view.reel"
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    FileService = require("services/file-service").FileService;

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
            var fileService = new FileService();
            Promise.all([
                fileService.loadSVG("/assets/sole.svg", this.sole, 0),
                fileService.loadSVG("/assets/sole_front4.svg", this.soleFront, 0)
            ])
            .spread(function(sole, soleFront) {
                self.sole = sole;
                self.sole_front = soleFront;
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
                run = event.detail.run;
            this._paintPressure(stats.fore, stats.heel, stats.side - run.level_side);
        }
    },

    _paintPressure: {
        value: function(fore, heel, angle) {
            if (!this.rows) this.rows = {};

            var base = angle - 130;
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
