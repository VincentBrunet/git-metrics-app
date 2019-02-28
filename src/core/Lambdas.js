var _ = require("lodash");

var $this = {};

var cached = {};

$this.compile = function (format) {
    if (cached[format]) {
        return cached[format];
    }
    var varNames = [];
    var varStartPos = format.indexOf("{{");
    while (varStartPos != -1) {
        var varEndPos = format.indexOf("}}", varStartPos);
        if (varEndPos != -1) {
            var varName = format.substring(varStartPos + 2, varEndPos);
            varNames.push(varName);
        }
        varStartPos = format.indexOf("{{", varStartPos + 2);
    }
    cached[format] = {
        format: format,
        varNames: varNames,
    };
    return cached[format];
};

$this.execute = function (compiled, data) {
    var final = compiled.format;
    _.each(compiled.varNames, function (varName) {
        final = final.replace("{{" + varName + "}}", data[varName]);
    });
    return final;
};

$this.resolve = function (format, data) {
    var compiled = $this.compile(format);
    return $this.execute(compiled, data);
};

module.exports = $this;
