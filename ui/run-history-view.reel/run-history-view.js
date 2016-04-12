/**
 * @module "ui/run-history-view.reel"
 */
var Component = require("montage/ui/component").Component;

/**
 * @class RunHistoryView
 * @extends Component
 */
exports.RunHistoryView = Component.specialize(/** @lends RunHistoryView.prototype */{

    _isMenuOpen: {
        value: true
    },

    handleToggleMenuButtonAction: {
        value: function() {
            this._isMenuOpen = !this._isMenuOpen;
        }
    },
    
    handleNewRunButtonAction: {
        value: function() {
            // TODO
        }
    }
});
