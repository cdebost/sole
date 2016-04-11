/**
 * @module "ui/heel-view.reel"
 */
var Component = require("montage/ui/component").Component,
    FileService = require("services/file-service").FileService;

/**
 * @class HeelView
 * @extends Component
 */
exports.HeelView = Component.specialize(/** @lends HeelView.prototype */{
    controller: {
        value: null
    },

    sideValue: {
        value: 0
    },

    soleDial: {
        value: null
    },

    soleDialg: {
        value: null
    },

    soleFront: {
        value: null
    },

    sidea: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this,
                fileService = new FileService();
            fileService.loadSVG("/assets/sole_front4b.svg", this.soleFront)
            .then(function(svg) {
                 self.sole_front = svg;
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
            this.soleDial.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255))))*3 + "deg)";
            if (this.do_dial) { // TODO ??
                this.soleDialg.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255))))*3 + "deg)";
                this.do_dial = 0;
            }
            this.soleFront.style.transform = "rotate(" + (-20 +(40-(40*(stats.side/255)))) + "deg)";
            this.sideValue = Math.floor(-((stats.side-run.level_side)-128)*.3);
        }
    }
});
