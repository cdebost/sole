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

    pronation: {
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
            var stats = event.detail.stats,
                run = event.detail.run;

            var gpos = stats.gpos % 400;
            var gpos2 = stats.gpos2 % 1600;
            this.element.style["backgroundPosition"] = gpos2*.25 + "px " + (window.innerWidth <= 375 ? -100 : 0) + "px";
            this.ground.style["backgroundPosition"] = gpos + "px 0px";

            this.acceleration.style.transform = "translateY(" + (-stats.up*.5) + "px)";

            var top2 = stats.top2;
            if (Math.floor(stats.steps) < 0) {
                stats.front2 = -28;
                top2 = 168;
            } else {
                stats.front2 = (stats.front2-128)*.7;
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

            var v = Math.abs(-20 + (40-(40*((stats.prone-run.level_side)/255))));
            console.log(stats.prone, run.level_side);
            var color = "";
            if (v < 5) color = "0,255,0,1.0";
            else if (v < 10) color = "188,255,0,1.0";
            else if (v < 15) color = "255,255,0,1.0";
            else if (v < 20) color = "255,203,0,1.0";
            else if (v < 25) color = "255,125,0,1.0";
            else if (v < 30) color = "255,87,0,1.0";
            else color = "255,0,0,1.0";

            this.pronation.style["backgroundImage"] = "-webkit-linear-gradient(" + (90-((-20 + (40-(40*((stats.prone-run.level_side)/255)))))) + "deg, rgba(" + color + ") 0%, rgba(" + color + ") 50%, rgba(100,100,100,1.0) 50%, rgba(100,100,100,1.0) 100%)";
        }
    }
});
