var Montage = require("montage/core/core").Montage,
    Promise = require("montage/core/promise").Promise;

exports.Run = Montage.specialize({
    id: {
        value: null
    },

    title: {
        value: null
    },

    fore: {
        value: null
    },

    heel: {
        value: null
    },

    date: {
        value: null
    },

    stats: {
        value: null
    },

    _isDataLoadedDeferred: {
        value: null
    },

    isDataLoaded: {
        get: function() {
            return this._isDataLoadedDeferred.promise.isFulfilled();
        },
        set: function(loaded) {
            if (loaded) {
                this._isDataLoadedDeferred.resolve();
            }
        }
    },

    init: {
        value: function(id, title) {
            this.id = id;
            this.title = title;
            this.fore = [];
            this.heel = [];
            this.stats = {};
            this._isDataLoadedDeferred = Promise.defer();
            return this;
        }
    },

    /**
     * Determines the run's date from its data. Can only be called once the data has been loaded.
     */
    calcDate: {
        value: function() {
            if (!this.isDataLoaded) {
                throw new Error("Cannot calculate a run's date until its data has been populated.");
            }
            this.date = new Date();
            var d1 = this.fore[0][1].split(".");
            var d2 = this.fore[0][2].split(":");
            this.date.setMonth(d1[1]-1);
            this.date.setDate(d1[0]);
            this.date.setFullYear("20" + d1[2]);
            this.date.setHours(d2[0]);
            this.date.setMinutes(d2[1]);
            this.date.setSeconds(d2[2]);
        }
    },

    waitForDataToBeLoaded: {
        value: function() {
            return this._isDataLoadedDeferred.promise;
        }
    }
});