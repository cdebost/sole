/**
 * @module "ui/side-view.reel"
 */
var Component = require("montage/ui/component").Component;

/**
 * @class SideView
 * @extends Component
 */
exports.SideView = Component.specialize(/** @lends SideView.prototype */{
    controller: {
        value: null
    },

    fileService: {
        value: null
    },

    sideCont: {
        value: null
    },

    shoe: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            var self = this;
            this.fileService.loadSVG("/assets/shoe_side.svg", this.sideCont)
            .then(function(svg) {
                self.shoe = svg;
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
            this.shoe.style.transform = "rotate(" + (((stats.front-128)*.7)-run.level_front) + "deg)";
            if (!this.sole_x5F_linear_1) {
                this.sole_x5F_linear_1 = document.getElementById("sole_x5F_linear_1_");
            }
            if (!this.c19_1b) {
                this.c19_1b = document.getElementById("c19_1b");
            }

            var r1 = Math.floor(stats.fore/100 * 255);
            var r2 = 50;
            if (r1 > 155) r2 = 50-(r1 - 155)/100*50;
            var g1 = Math.floor(stats.heel/100 * 255);
            var g2 = 50;
            if (g1 > 155) g2 = 50-(g1 - 155)/100*50;

            this.sole_x5F_linear_1.children[0].style.stopColor = "rgba(" + r1 + "," + r2 + "," + r2 + ",1.0)";
            this.sole_x5F_linear_1.children[1].style.stopColor = "rgba(" + g1 + "," + g1 + "," + g2 + ",1.0)";

            if (g2 > r1) r1 = g2;
            if (g1 < 50) g1 = 50;
            if (r1 < g1) r1 = g1;
            this.c19_1b.children[0].style.stopColor = "rgba(" + r1 + "," + g1 + "," + g2 + ",1.0)";
            this.c19_1b.children[1].style.stopColor = "rgba(" + r1 + "," + g1 + "," + g2 + ",1.0)";
        }
    }
});
