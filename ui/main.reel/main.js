/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component,
    RunProvider = require("core/run-provider").RunProvider,
    FileService = require("services/file-service").FileService,
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
