var Converter = require("montage/core/converter/converter").Converter;

exports.TimeNoHundredthsConverter = Converter.specialize({
    convert: {
        value: function (fullTimeStr) {
            if (!fullTimeStr) {
                return fullTimeStr;
            }
            return fullTimeStr.substring(0, fullTimeStr.indexOf("."));
        }
    }
});
