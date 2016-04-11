/**
 * @module "ui/ground-view.reel"
 */
var Component = require("montage/ui/component").Component;

/**
 * @class GroundView
 * @extends Component
 */
exports.GroundView = Component.specialize(/** @lends GroundView.prototype */{
    FUDGE_ANGLE: {
        value: 30
    },

    controller: {
        value: null
    },

    ground: {
        value: null
    },

    shoe: {
        value: null
    },

    acceleration: {
        value: null
    },

    strike: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                this.controller.addEventListener("frameUpdate", this);
            }
        }
    },

    handleFrameUpdate: {
        value: function(event) {
            var stats = event.detail.stats;

            var gpos = stats.gpos % 400;
            var gpos2 = stats.gpos2 % 1600;
            this.element.style["backgroundPosition"] = gpos2*.25 + "px " + (window.innerWidth <= 375 ? -100 : 0) + "px";
            this.ground.style["backgroundPosition"] = gpos + "px 0px";

            this.acceleration.style.transform = "translateY(" + (-stats.up*.5) + "px)";

            var top2 = stats.top2;
            if (Math.floor(stats.steps) < 0 || stats.heel > 20) {
                top2 = 168;
            }
            if (top2 < -100) {
                top2 = stats.top;
            }

            this.strike.value = Math.round(stats.front);

            this.shoe.style.transform = "scale(.25) translateX(" + Math.floor(stats.footp*3) + "px) translateY(" + Math.floor(top2) + "px) rotate(" + Math.floor(this.FUDGE_ANGLE + ((stats.front2))) + "deg)";

            if (stats.fore > 80) {
                this.shoe.style.backgroundPosition = "0px -1182px";
            } else if (stats.fore > 60) {
                this.shoe.style.backgroundPosition = "0px -788px";
            } else if (stats.fore > 40) {
                this.shoe.style.backgroundPosition = "0px -394px";
            } else {
                this.shoe.style.backgroundPosition = "0px 0px";
            }
        }
    }
});
