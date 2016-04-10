var Montage = require("montage/core/core").Montage,
    Animation = require("core/animation").Animation,
    Target = require("montage/core/target").Target;

var SimulationStats = Montage.specialize({
    timestamp: {
        value: 0
    },

    heel: {
        value: 0
    },

    fore: {
        value: 0
    },

    side: {
        value: 0
    },

    front: {
        value: 0
    },

    up: {
        value: 0
    },

    steps: {
        value: null
    },

    init: {
        value: function(run) {
            var self = this;
            return run.waitForDataToBeLoaded()
            .then(function() {
                var start = Math.max(run.fore[0][0], run.heel[0][0]);
                var end = Math.min(run.fore[run.fore.length-2][0], run.heel[run.heel.length-2][0]);
                run.start = start * 1000;
                run.samples = run.fore.length-2;
                run.duration = (end - start) * 1000;
                return self;
            });
        }
    }
});

exports.SimulationController = Target.specialize({
    stats: {
        value: null
    },

    _run: {
        value: null
    },

    run: {
        get: function() {
            return this._run;
        },
        set: function(run) {
            var self = this;
            this._run = run;
            if (run) {
                new SimulationStats().init(run)
                .then(function(stats) {
                    self.stats = stats;
                    self._initAnimation();
                });
            }
        }
    },

    animation: {
        value: null
    },

    _initAnimation: {
        value: function() {
            var self = this,
                run = this.run,
                stats = this.stats;
            this.animation = new Animation(0, 0, 0, 1, run.duration, function (perc) {
                stats.timestamp = run.start + run.duration*perc;

                self._interpolateAll();
                var s = Math.floor(stats.steps);
                if (s < 0) {
                    stats.front2 = self.level;
                } else {
                    stats.front2 = (stats.front2-128)*.7;

                }
                //console.log(stats.steps + " tp=" + tp + " otop=" + stats.otop + " top2=" + stats.top2 + " heel=" + stats.heel + " top=" + stats.top + "");
                if (stats.heel > 20) {
                    stats.front2 = self.level;
                }

                self.dispatchEventNamed("frameUpdate", true, true, {
                    stats: stats,
                    run: run,
                    perc: perc
                });

                return 1;
            }, function (callback) {
                callback(0);
            }, 0, "Linear.None", 60, 0, 0);
        }
    },

    _interpolateAll: {
        value: function() {
            var time = this.stats.timestamp/1000.0;
            this._interpolate(time, this.run.fore, 0);
            this._interpolate(time, this.run.heel, 1);
        }
    },

    _interpolate: {
        value: function(time, list, v) {
            var first = -1,
                run = this.run,
                stats = this.stats;
            for (var a = 0; a < list.length; a++) {
                if (list[a][0] <= time) {
                    first = a;
                }
                else if (first >= 0) { //FOUND BEFORE AND AFTER
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

                    break;
                } else { //FOUND JUST ONE
                    alert("REALLY HOW?");
                    break;
                }
            }
        }
    },

    toggle: {
        value: function() {
            this.animation.pauser = 1;
            this.animation.pause();
        }
    }
});