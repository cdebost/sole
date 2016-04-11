/**
 * @module "ui/controls.reel"
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Controls
 * @extends Component
 */
exports.Controls = Component.specialize(/** @lends Controls.prototype */{
    controller: {
        value: null
    },

    _time: {
        value: "00:00.00"
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
            var time = event.detail.time;
            this._time = (time.minutes < 10 ? "0" : "") + time.minutes + ":" + (time.seconds < 10 ? "0" : "") + time.seconds + ":" + (time.hundredths < 10 ? "0" : "") + time.hundredths;
        }
    },

    handleToggleButtonAction: {
        value: function () {
            if (this.controller.isPlaying) {
                this.controller.stop();
            } else {
                this.controller.start();
            }
        }
    },

    handlePauseButtonAction: {
        value: function () {
            if (this.controller.isPaused) {
                this.controller.resume();
            } else {
                this.controller.pause();
            }
        }
    }
});
