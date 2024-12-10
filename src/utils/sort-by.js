// https://github.com/kvnneff/sort-by

import objectPath from "object-path";

var sortBy;
var sort;
var type;

type = function (type) {
  return function (arg) {
    return typeof arg === type;
  };
};

sort = function sort(property, map) {
  var sortOrder = 1;
  var apply =
    map ||
    function (_, value) {
      return value;
    };

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function fn(a, b) {
    var result;
    var am = apply(property, objectPath.get(a, property));
    var bm = apply(property, objectPath.get(b, property));
    if (am < bm) result = -1;
    if (am > bm) result = 1;
    if (am === bm) result = 0;
    return result * sortOrder;
  };
};

sortBy = function sortBy() {
  var args = Array.prototype.slice.call(arguments);
  var properties = args.filter(type("string"));
  var map = args.filter(type("function"))[0];

  return function fn(obj1, obj2) {
    var numberOfProperties = properties.length,
      result = 0,
      i = 0;

    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = sort(properties[i], map)(obj1, obj2);
      i++;
    }
    return result;
  };
};

export default sortBy;
