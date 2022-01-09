// ==UserScript==
// @name         coubdownload-bridge-userscript
// @namespace    https://github.com/Venipa/coubdl-bridge
// @version      0.2.3-t3t7w
// @description  Bridge between the desktop and webbrowser to download and merge video & audio from coub
// @author       Venipa
// @match        https://*.coub.com/*
// @match        https://coub.com/*
// @grant        none
// @license      MIT
// ==/UserScript==
// ==OpenUserJS==
// @author Venipa
// ==/OpenUserJS==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/CoubButtons */ "./src/lib/CoubButtons.ts");
/* harmony import */ var _lib_DownloadHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/DownloadHandler */ "./src/lib/DownloadHandler.ts");
/* harmony import */ var _lib_Logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/Logger */ "./src/lib/Logger.ts");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};




/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(_a) {
  var _b = _a.env,
      __DEV__ = _b.dev,
      AppName = _b.name,
      AppVersion = _b.version,
      env = __rest(_b, ["dev", "name", "version"]); // 'use strict';


  var log = new _lib_Logger__WEBPACK_IMPORTED_MODULE_2__["default"]("[".concat(AppName, ", v").concat(AppVersion, "]").concat(__DEV__ ? "(dev)" : ""));
  log.debug("boot", {"name":"coubdownload-bridge-userscript","description":"Bridge between the desktop and webbrowser to download and merge video & audio from coub","repository":"https://github.com/Venipa/coubdl-bridge","production":false,"version":"0.2.3"});
  var buttonId = "coubdl-download";
  /**
   *
   * @param {HTMLElement[]} parentNodes
   */

  var checkCoubs = function checkCoubs(parentNodes) {
    parentNodes.filter(function (x) {
      return x.querySelectorAll && x.querySelector(".description__controls");
    }).forEach(function (x) {
      var _a;

      var _coubControls = x.querySelector(".description__controls");

      var controls = x;
      if (controls = controls.querySelector("div#coub_dl_controls")) return;else {
        var coubId = (_a = _coubControls.findAncestor(".coub")) === null || _a === void 0 ? void 0 : _a.dataset.permalink;
        var cdlChildrens = [_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createButtonGroup.apply(void 0, _toConsumableArray(function () {
          var downloadBtn = (0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createButton)("Download");
          downloadBtn.href = "coubdl-bridge://" + coubId;
          var downloadBtnFull = (0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createButton)("Looped");
          downloadBtnFull.href = "coubdl-bridge://" + coubId + "/full";
          return [downloadBtn, downloadBtnFull];
        }()).concat([(0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createSeperator)(), function () {
          var downloadBtn = (0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createButton)("GIF");
          downloadBtn.href = "coubdl-bridge://" + coubId + "/gif";
          return downloadBtn;
        }(), function () {
          var downloadBtn = (0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createButton)("Audio");
          downloadBtn.href = "coubdl-bridge://" + coubId + "/audio";
          return downloadBtn;
        }()]))];
        controls = (0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          id: "coub_dl_controls",
          children: cdlChildrens
        }, {
          height: "48px",
          display: "flex",
          flex: "1 1 auto",
          justifyContent: "flex-end"
        });
        x.querySelector(".coub__description").prepend(controls);
      }
    });
  };
  /**
   *
   * @param {HTMLElement[]} parentNodes
   */


  var checkRelated = function checkRelated(parentNodes) {
    parentNodes.filter(function (x) {
      return x.querySelectorAll;
    }).map(function (x) {
      return Array.from(x.querySelectorAll(".suggest__item"));
    }).filter(function (x) {
      return x.length > 0;
    }).reduce(function (l, r) {
      return [].concat(_toConsumableArray(l), _toConsumableArray(r));
    }, []).forEach(function (x) {
      if (x && x.querySelectorAll && x.querySelectorAll("#" + buttonId).length === 0) {
        var coubId = x.getAttribute("data-permalink");
        var downloadBtn = (0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.createButton)("Download", {
          padding: "4px 6px",
          position: "absolute",
          top: "0",
          right: "0",
          marginTop: "8px",
          marginRight: "8px",
          zIndex: "9999"
        });
        downloadBtn.id = buttonId;
        downloadBtn.href = "coubdl-bridge://" + coubId;
        x.prepend(downloadBtn);
      }
    });
  };

  var mut = new MutationObserver(function (mutations) {
    /**
     * @type {HTMLElement[]}
     */
    var addednodes;

    if ((addednodes = mutations.filter(function (x) {
      return x.addedNodes && x.addedNodes.length > 0;
    }).map(function (x) {
      return x.addedNodes;
    }).reduce(function (l, r) {
      return [].concat(_toConsumableArray(l), _toConsumableArray(r));
    }, [])).length > 0 && addednodes) {
      console.log(addednodes);
      var validNodes = addednodes.filter(function (x) {
        return ["coub", "coub-page", "viewer__video", "page", "coub--normal-card"].filter(function (y) {
          var _a;

          return (_a = x.classList) === null || _a === void 0 ? void 0 : _a.contains(y);
        });
      });

      if (validNodes.length > 0) {
        checkCoubs(validNodes);
        checkRelated(coubBox);
      }
    }
  }); // document
  //   .querySelectorAll('#coubchat, .coubs-list, .coub-page .coub-block-col')
  //   .forEach(x => {
  //   });

  var bodyObserver = new MutationObserver(function (m) {
    mut.disconnect();
    var coubBox = Array.from(document.querySelectorAll(".coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page, .cobb-page .suggests--page"));
    checkCoubs(coubBox);
    checkRelated(coubBox);
    m.filter(function (x) {
      var _a;

      return (_a = x.addedNodes) === null || _a === void 0 ? void 0 : _a.length;
    }).map(function (x) {
      return Array.from(x.addedNodes);
    }).reduce(function (l, r) {
      return [].concat(_toConsumableArray(l), _toConsumableArray(r));
    }, []).forEach(function (el) {
      mut.observe(el, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
      });
    });
  });
  bodyObserver.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  });
  var coubBox = Array.from(document.querySelectorAll(".coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page"));
  checkCoubs(coubBox);
  checkRelated(coubBox);
  window.addEventListener("keydown", function (ev) {
    var _a;
    /**
     * @type {HTMLElement} el
     */


    var el;

    if (ev.ctrlKey && ev.key.toLowerCase() === "s" && ((_a = getSelection()) === null || _a === void 0 ? void 0 : _a.anchorNode) && (el = document.querySelector(".coubs-list .coub.active[data-id][data-permalink]")) && el.dataset.permalink) {
      ev.preventDefault();
      var coubId = el.dataset.permalink;
      (0,_lib_DownloadHandler__WEBPACK_IMPORTED_MODULE_1__.openByUrl)("coubdl-bridge://" + coubId + "/video");
    }
  });

  (function (fn) {
    log.debug("ready", document.readyState);
    if (document.readyState !== "loading") fn();else window.addEventListener("DOMContentLoaded", fn);
  })(function () {
    log.debug("style add", env.style);
    (0,_lib_CoubButtons__WEBPACK_IMPORTED_MODULE_0__.injectStyle)(env.style);
  });
}

/***/ }),

/***/ "./src/lib/CoubButtons.ts":
/*!********************************!*\
  !*** ./src/lib/CoubButtons.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "injectStyle": () => (/* binding */ injectStyle),
/* harmony export */   "createElement": () => (/* binding */ createElement),
/* harmony export */   "createButton": () => (/* binding */ createButton),
/* harmony export */   "createSeperator": () => (/* binding */ createSeperator),
/* harmony export */   "createButtonGroup": () => (/* binding */ createButtonGroup)
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/flatten.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


function injectStyle(style) {
  var _style = createElement("style");

  _style.innerText = style;
  _style.dataset.type = "coubdl_bridge.custom_style";
  return document.head.appendChild(_style);
}
function createElement(tagName, options, style) {
  var _a;

  var el = document.createElement(tagName);
  Object.assign(el.style, style);

  if (options === null || options === void 0 ? void 0 : options["class"]) {
    var _el$classList;

    (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray((0,lodash_es__WEBPACK_IMPORTED_MODULE_0__["default"])([options["class"]])));
  }

  el.id = options === null || options === void 0 ? void 0 : options.id;
  if ((_a = options === null || options === void 0 ? void 0 : options.children) === null || _a === void 0 ? void 0 : _a.length) options.children.every(function (x) {
    return el.appendChild(x);
  });
  return el;
}
function createButton(text, style) {
  var btn = document.createElement("a");
  if (text) btn.innerText = text;
  btn.classList.add("coubdl-button");
  Object.assign(btn.style, style);
  return btn;
}
function createSeperator() {
  var seperator = document.createElement("div");
  seperator.classList.add("coubdl-seperator");
  return seperator;
}
function createButtonGroup() {
  var btnGroup = document.createElement("div");
  btnGroup.classList.add("coubdl-button-group");

  for (var _len = arguments.length, innerButtons = new Array(_len), _key = 0; _key < _len; _key++) {
    innerButtons[_key] = arguments[_key];
  }

  if (innerButtons.length > 0) {
    innerButtons.forEach(function (x, i) {
      if (!x.classList.contains("coubdl-seperator")) x.classList.add("coubdl-button-group-item");
      btnGroup.appendChild(x);
    });
  }

  return btnGroup;
}

/***/ }),

/***/ "./src/lib/DownloadHandler.ts":
/*!************************************!*\
  !*** ./src/lib/DownloadHandler.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "downloadByUrl": () => (/* binding */ downloadByUrl),
/* harmony export */   "openByUrl": () => (/* binding */ openByUrl)
/* harmony export */ });
var downloadByUrl = function downloadByUrl(url, filename) {
  var dl = document.createElement("a");
  dl.href = url;
  dl.download = filename;
  dl.style.height = "0";
  dl.style.width = "0";
  dl.style.position = "fixed";
  dl.click();
  dl.remove();
};
var openByUrl = function openByUrl(url) {
  var dl = document.createElement("a");
  dl.href = url;
  dl.style.height = "0";
  dl.style.width = "0";
  dl.style.position = "fixed";
  dl.click();
  dl.remove();
};

/***/ }),

/***/ "./src/lib/Logger.ts":
/*!***************************!*\
  !*** ./src/lib/Logger.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Logger)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var __DEV__ = !{"name":"coubdownload-bridge-userscript","description":"Bridge between the desktop and webbrowser to download and merge video & audio from coub","repository":"https://github.com/Venipa/coubdl-bridge","production":false,"version":"0.2.3"}.production;

var Logger = /*#__PURE__*/function () {
  function Logger(name) {
    _classCallCheck(this, Logger);

    this.name = name;
  }

  _createClass(Logger, [{
    key: "debug",
    value: function debug(msg) {
      var _console;

      if (!__DEV__) {
        return;
      }

      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      (_console = console).log.apply(_console, ["".concat(this.name), msg].concat(params));
    }
  }, {
    key: "info",
    value: function info(msg) {
      var _console2;

      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      (_console2 = console).log.apply(_console2, ["".concat(this.name), msg].concat(params));
    }
  }, {
    key: "warn",
    value: function warn(msg) {
      var _console3;

      for (var _len3 = arguments.length, params = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        params[_key3 - 1] = arguments[_key3];
      }

      (_console3 = console).warn.apply(_console3, ["".concat(this.name), msg].concat(params));
    }
  }, {
    key: "error",
    value: function error(msg) {
      var _console4;

      for (var _len4 = arguments.length, params = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        params[_key4 - 1] = arguments[_key4];
      }

      (_console4 = console).error.apply(_console4, ["".concat(this.name), msg].concat(params));
    }
  }, {
    key: "tag",
    value: function tag(_tag, msg) {
      var _console5;

      for (var _len5 = arguments.length, params = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        params[_key5 - 2] = arguments[_key5];
      }

      (_console5 = console).log.apply(_console5, ["[".concat(_tag, "] ").concat(this.name), msg].concat(params));
    }
  }]);

  return Logger;
}();



/***/ }),

/***/ "./src/window-extend.ts":
/*!******************************!*\
  !*** ./src/window-extend.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  Node.prototype.findAncestor = function (sel) {
    var el = this;

    while ((el = el.parentElement) && !el.matches.call(el, sel)) {
      ;
    }

    return el;
  };
}

/***/ }),

/***/ "./node_modules/lodash-es/_Symbol.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_Symbol.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Symbol);


/***/ }),

/***/ "./node_modules/lodash-es/_arrayPush.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arrayPush.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayPush);


/***/ }),

/***/ "./node_modules/lodash-es/_baseFlatten.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseFlatten.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayPush.js */ "./node_modules/lodash-es/_arrayPush.js");
/* harmony import */ var _isFlattenable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isFlattenable.js */ "./node_modules/lodash-es/_isFlattenable.js");



/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseFlatten);


/***/ }),

/***/ "./node_modules/lodash-es/_baseGetTag.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseGetTag.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ "./node_modules/lodash-es/_getRawTag.js");
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ "./node_modules/lodash-es/_objectToString.js");




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)
    : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetTag);


/***/ }),

/***/ "./node_modules/lodash-es/_baseIsArguments.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsArguments.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == argsTag;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsArguments);


/***/ }),

/***/ "./node_modules/lodash-es/_freeGlobal.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_freeGlobal.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);


/***/ }),

/***/ "./node_modules/lodash-es/_getRawTag.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getRawTag.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRawTag);


/***/ }),

/***/ "./node_modules/lodash-es/_isFlattenable.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_isFlattenable.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArguments.js */ "./node_modules/lodash-es/isArguments.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "./node_modules/lodash-es/isArray.js");




/** Built-in value references. */
var spreadableSymbol = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFlattenable);


/***/ }),

/***/ "./node_modules/lodash-es/_objectToString.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_objectToString.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (objectToString);


/***/ }),

/***/ "./node_modules/lodash-es/_root.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_root.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "./node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (root);


/***/ }),

/***/ "./node_modules/lodash-es/flatten.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/flatten.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseFlatten_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseFlatten.js */ "./node_modules/lodash-es/_baseFlatten.js");


/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? (0,_baseFlatten_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, 1) : [];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (flatten);


/***/ }),

/***/ "./node_modules/lodash-es/isArguments.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/isArguments.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseIsArguments.js */ "./node_modules/lodash-es/_baseIsArguments.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = (0,_baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function() { return arguments; }()) ? _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArguments);


/***/ }),

/***/ "./node_modules/lodash-es/isArray.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/isArray.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArray);


/***/ }),

/***/ "./node_modules/lodash-es/isObjectLike.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isObjectLike.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObjectLike);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/app.dev.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _window_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./window-extend */ "./src/window-extend.ts");


(0,_window_extend__WEBPACK_IMPORTED_MODULE_1__["default"])();
(0,_app__WEBPACK_IMPORTED_MODULE_0__["default"])({
  env: Object.assign({
    dev: !{"name":"coubdownload-bridge-userscript","description":"Bridge between the desktop and webbrowser to download and merge video & audio from coub","repository":"https://github.com/Venipa/coubdl-bridge","production":false,"version":"0.2.3"}.production
  }, {"name":"coubdownload-bridge-userscript","description":"Bridge between the desktop and webbrowser to download and merge video & audio from coub","repository":"https://github.com/Venipa/coubdl-bridge","production":false,"version":"0.2.3"})
});
})();

/******/ })()
;