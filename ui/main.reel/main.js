/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component,
    Application = require("montage/core/application").Application;

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

    fileService: {
        value: null
    },

    runProvider: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
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
            this.runProvider.dataPrototypes.forEach(function(proto) {
                 self.runs.add(proto);
            });
        }
    },
    
    loadRunData: {
        value: function(run) {
            if (run.isDataLoaded) {
                return;
            }
            this.runProvider.loadRunData(run)
            .then(function() {
                Application.prototype.dispatchEventNamed("runDataLoaded", true, true, {
                    runId: run.id
                });
            });
        }
    }
});
