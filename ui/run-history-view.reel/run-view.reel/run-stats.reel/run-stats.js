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

                    content = self.templateObjects.statsSte.content;
                    self.templateObjects.statsSte.content = void 0;
                    self.templateObjects.statsSte.content = content;

                    content = self.templateObjects.statsSpm.content;
                    self.templateObjects.statsSpm.content = void 0;
                    self.templateObjects.statsSpm.content = content;

                    content = self.templateObjects.statsStr.content;
                    self.templateObjects.statsStr.content = void 0;
                    self.templateObjects.statsStr.content = content;

                    content = self.templateObjects.statsPro.content;
                    self.templateObjects.statsPro.content = void 0;
                    self.templateObjects.statsPro.content = content;
                }
            });
        }
    }
});
