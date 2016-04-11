/**
 * @module "ui/run-view.reel"
 */
var Component = require("montage/ui/component").Component;

/**
 * @class RunView
 * @extends Component
 */
exports.RunView = Component.specialize(/** @lends RunView.prototype */{
    run: {
        value: null
    },

    shouldShowStats: {
        value: false
    },

    enterDocument: {
        value: function() {
            var self = this;
            this.run.waitForDataToBeLoaded().then(function() {
                self.shouldShowStats = true;
            });
        }
    }
});
