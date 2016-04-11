/**
 * @module "ui/run-stats.reel"
 */
var Component = require("montage/ui/component").Component,
    Application = require("montage/core/application").Application;

/**
 * @class RunStats
 * @extends Component
 */
exports.RunStats = Component.specialize(/** @lends RunStats.prototype */{
    stats: {
        value: null
    },

    runId: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                var i = 0;
                while (true) {
                    if ("stats"+i in window) {
                        i++;
                        continue;
                    }
                    window["stats"+i] = this;
                    break;
                }

                // TODO: I don't know why this is necessary, but without it the numbers on the stats view won't show
                // beyond the first draw.
                this._hackToDisplayStats();
            }
        }
    },

    _hackToDisplayStats: {
        value: function() {
            var self = this;
            Application.prototype.addEventListener("runDataLoaded", function(event) {
                if (event.detail.runId === self.runId) {
                    var content;
                    content = self.templateObjects.statsDur.content;
                    self.templateObjects.statsDur.content = void 0;
                    self.templateObjects.statsDur.content = content;
                    self.templateObjects.statsDurAverage.value = self.stats.dur.avg;

                    content = self.templateObjects.statsSte.content;
                    self.templateObjects.statsSte.content = void 0;
                    self.templateObjects.statsSte.content = content;
                    self.templateObjects.statsSteAverage.value = self.stats.ste.avg;

                    content = self.templateObjects.statsSpm.content;
                    self.templateObjects.statsSpm.content = void 0;
                    self.templateObjects.statsSpm.content = content;
                    self.templateObjects.statsSpmAverage.value = self.stats.spm.avg;

                    content = self.templateObjects.statsStr.content;
                    self.templateObjects.statsStr.content = void 0;
                    self.templateObjects.statsStr.content = content;
                    self.templateObjects.statsStrAverage.value = self.stats.str.avg;

                    content = self.templateObjects.statsPro.content;
                    self.templateObjects.statsPro.content = void 0;
                    self.templateObjects.statsPro.content = content;
                    self.templateObjects.statsProAverage.value = self.stats.pro.avg;
                }
            });
        }
    }
});
