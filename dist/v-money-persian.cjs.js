'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var defaults = {
  prefix: '',
  suffix: '',
  thousands: ',',
  decimal: '.',
  precision: 2
};

function format(input) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaults;

  if (typeof input === 'number') {
    input = input.toFixed(fixed(opt.precision));
  } else {
    input = peraianToEnglish(input);
  }

  var negative = input.indexOf('-') >= 0 ? '-' : '';
  var numbers = onlyNumbers(input);
  var currency = numbersToCurrency(numbers, opt.precision);
  var parts = toStr(currency).split('.');
  var integer = parts[0];
  var decimal = parts[1];
  integer = addThousandSeparator(integer, opt.thousands);
  return opt.prefix + negative + joinIntegerAndDecimal(integer, decimal, opt.decimal) + opt.suffix;
}

function unformat(input, precision) {
  input = peraianToEnglish(input);
  var negative = input.indexOf('-') >= 0 ? -1 : 1;
  var numbers = onlyNumbers(input);
  var currency = numbersToCurrency(numbers, precision);
  return parseFloat(currency) * negative;
}

function onlyNumbers(input) {
  input = peraianToEnglish(input);
  return toStr(input).replace(/\D+/g, '') || '0';
} // Uncaught RangeError: toFixed() digits argument must be between 0 and 20 at Number.toFixed


function fixed(precision) {
  return between(0, precision, 20);
}

function between(min, n, max) {
  return Math.max(min, Math.min(n, max));
}

function numbersToCurrency(numbers, precision) {
  var exp = Math.pow(10, precision);
  var float = parseFloat(numbers) / exp;
  return float.toFixed(fixed(precision));
}

function addThousandSeparator(integer, separator) {
  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, "$1".concat(separator));
}

function joinIntegerAndDecimal(integer, decimal, separator) {
  return decimal ? integer + separator + decimal : integer;
}

function toStr(value) {
  return value ? value.toString() : '';
}

function setCursor(el, position) {
  var setSelectionRange = function setSelectionRange() {
    el.setSelectionRange(position, position);
  };

  if (el === document.activeElement) {
    setSelectionRange();
    setTimeout(setSelectionRange, 1); // Android Fix
  }
} // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way


function event(name) {
  var evt = document.createEvent('Event');
  evt.initEvent(name, true, true);
  return evt;
}

function assign (defaults, extras) {
  defaults = defaults || {};
  extras = extras || {};
  return Object.keys(defaults).concat(Object.keys(extras)).reduce(function (acc, val) {
    acc[val] = extras[val] === undefined ? defaults[val] : extras[val];
    return acc;
  }, {});
}

function money (el, binding) {
  if (!binding.value) return;
  var opt = assign(defaults, binding.value); // v-money used on a component that's not a input

  if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
    var els = el.getElementsByTagName('input');

    if (els.length !== 1) {// throw new Error("v-money requires 1 input, found " + els.length)
    } else {
      el = els[0];
    }
  }

  el.oninput = function () {
    var positionFromEnd = el.value.length - el.selectionEnd;
    el.value = format(el.value, opt);
    positionFromEnd = Math.max(positionFromEnd, opt.suffix.length); // right

    positionFromEnd = el.value.length - positionFromEnd;
    positionFromEnd = Math.max(positionFromEnd, opt.prefix.length + 1); // left

    setCursor(el, positionFromEnd);
    el.dispatchEvent(event('change')); // v-model.lazy
  };

  el.onfocus = function () {
    setCursor(el, el.value.length - opt.suffix.length);
  };

  el.oninput();
  el.dispatchEvent(event('input')); // force format after initialization
}

var Money = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('input', {
      directives: [{
        name: "money",
        rawName: "v-money",
        value: {
          precision: _vm.precision,
          decimal: _vm.decimal,
          thousands: _vm.thousands,
          prefix: _vm.prefix,
          suffix: _vm.suffix
        },
        expression: "{precision, decimal, thousands, prefix, suffix}"
      }],
      staticClass: "v-money",
      attrs: {
        "type": "tel"
      },
      domProps: {
        "value": _vm.formattedValue
      },
      on: {
        "change": _vm.change
      }
    });
  },
  staticRenderFns: [],
  name: 'Money',
  props: {
    value: {
      required: true,
      type: [Number, String],
      default: 0
    },
    masked: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      default: function _default() {
        return defaults.precision;
      }
    },
    decimal: {
      type: String,
      default: function _default() {
        return defaults.decimal;
      }
    },
    thousands: {
      type: String,
      default: function _default() {
        return defaults.thousands;
      }
    },
    prefix: {
      type: String,
      default: function _default() {
        return defaults.prefix;
      }
    },
    suffix: {
      type: String,
      default: function _default() {
        return defaults.suffix;
      }
    }
  },
  directives: {
    money: money
  },
  data: function data() {
    return {
      formattedValue: ''
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler(newValue, oldValue) {
        var formatted = format(newValue, this.$props);

        if (formatted !== this.formattedValue) {
          this.formattedValue = formatted;
        }
      }
    }
  },
  methods: {
    change: function change(evt) {
      this.$emit('input', this.masked ? evt.target.value : unformat(evt.target.value, this.precision));
    }
  }
};

var VERSION = proccess.env.VERSION;

function install(Vue, globalOptions) {
  if (globalOptions) {
    Object.keys(globalOptions).map(function (key) {
      defaults[key] = globalOptions[key];
    });
  }

  Vue.directive('money', money);
  Vue.component('money', Money);
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

exports.Money = Money;
exports.VMoney = money;
exports.options = defaults;
exports.VERSION = VERSION;
exports.default = install;
