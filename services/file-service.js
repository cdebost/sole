var Montage = require("montage/core/core").Montage,
    Promise = require("montage/core/promise").Promise,
    $ = require("jquery");

var PHP_PATH = "services/file.php";

exports.FileService = Montage.specialize({
    /**
     * Returns a promise that will resolve to the contents of the requested CSV file.
     * @return Promise
     */
    readCSV: {
        value: function(name) {
            if (!name) {
                return Promise.reject(new Error("Attempted to load bad CSV file: " + name));
            }
            return this._makePhpRequest(name);
        }
    },

    _makePhpRequest: {
        value: function(name) {
            return new Promise(function(resolve, reject) {
                $.post(PHP_PATH, {type: "load", name: name}, function(ret) {
                    if (!ret || ret == "") {
                        reject(new Error("Got empty response while loading CSV: " + name));
                    }
                    resolve(ret);
                }).fail(function(err) {
                    reject(new Error("Error loading CSV: " + name + ". " + err));
                });
            });
        }
    },

    loadSVG: {
        value: function (fileName, parentElement, className) {
            return new Promise(function(resolve) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", fileName, true);
                xhr.overrideMimeType("image/svg+xml");

                xhr.onload = function () {
                    var svg = xhr.responseXML.documentElement;
                    if (className) {
                        svg.className = className;
                    }
                    if (parentElement) {
                        parentElement.appendChild(svg);
                    }
                    resolve(svg);
                };
                xhr.send("");
            });
        }
    }
});
