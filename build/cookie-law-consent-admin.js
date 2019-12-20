/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./admin/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./admin/src/categories/categories.js":
/*!********************************************!*\
  !*** ./admin/src/categories/categories.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Categories; });\n/* harmony import */ var delegate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! delegate */ \"./node_modules/delegate/src/delegate.js\");\n/* harmony import */ var delegate__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(delegate__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _category_category__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../category/category */ \"./admin/src/category/category.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\n\nvar Categories =\n/*#__PURE__*/\nfunction () {\n  function Categories(element) {\n    var _this = this;\n\n    _classCallCheck(this, Categories);\n\n    this.el = element;\n    this.props = {\n      settingName: this.el.dataset.settingName\n    };\n    this.refs = {\n      tabList: this.el.querySelector('.categories__tab-list'),\n      btnAdd: this.el.querySelector('.categories__add'),\n      panelList: this.el.querySelector('.categories__panel-list'),\n      categories: Array.from(this.el.querySelectorAll('.category')).map(function (cat) {\n        return new _category_category__WEBPACK_IMPORTED_MODULE_1__[\"default\"](cat, _this.props.settingName);\n      })\n    };\n    this.state = {\n      activeId: 0\n    };\n    this.renderTabs();\n    this.onAddClick = this.onAddClick.bind(this);\n    this.onTabClick = this.onTabClick.bind(this);\n    this.onCategoryChange = this.onCategoryChange.bind(this);\n    this.bind();\n  }\n\n  _createClass(Categories, [{\n    key: \"bind\",\n    value: function bind() {\n      var _this2 = this;\n\n      delegate__WEBPACK_IMPORTED_MODULE_0___default()(this.refs.tabList, 'a', 'click', this.onTabClick);\n      this.refs.btnAdd.addEventListener('click', this.onAddClick);\n      this.refs.categories.forEach(function (cat) {\n        return cat.el.addEventListener('titleChange', _this2.onCategoryChange);\n      });\n    }\n  }, {\n    key: \"onTabClick\",\n    value: function onTabClick(event) {\n      event.preventDefault();\n      this.updateActive(Array.from(this.refs.tabList.children).indexOf(event.target));\n    }\n  }, {\n    key: \"onAddClick\",\n    value: function onAddClick(event) {\n      event.preventDefault();\n      var newCat = new _category_category__WEBPACK_IMPORTED_MODULE_1__[\"default\"](undefined, this.props.settingName, this.refs.categories.length);\n      newCat.el.addEventListener('titleChange', this.onCategoryChange);\n      this.refs.panelList.insertAdjacentElement('beforeend', newCat.el);\n      this.refs.categories.push(newCat);\n      this.renderTabs();\n      this.updateActive(this.refs.categories.length - 1);\n    }\n  }, {\n    key: \"onCategoryChange\",\n    value: function onCategoryChange(event) {\n      var catIdx = this.refs.categories.findIndex(function (cat) {\n        return cat.getId() === event.detail.id;\n      });\n      this.refs.tabList.children[catIdx].textContent = event.detail.title === '' ? \"Category \".concat(catIdx + 1) : event.detail.title;\n    }\n  }, {\n    key: \"updateActive\",\n    value: function updateActive() {\n      var nextActive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n      this.refs.tabList.children[this.state.activeId].classList.remove('is-active');\n      this.refs.categories[this.state.activeId].el.classList.remove('is-active');\n      this.refs.tabList.children[nextActive].classList.add('is-active');\n      this.refs.categories[nextActive].el.classList.add('is-active');\n      this.state.activeId = nextActive;\n    }\n  }, {\n    key: \"renderTabs\",\n    value: function renderTabs() {\n      var _this3 = this;\n\n      while (this.refs.tabList.lastChild) {\n        this.refs.tabList.removeChild(this.refs.tabList.lastChild);\n      }\n\n      this.refs.categories.forEach(function (cat, id) {\n        var title = cat.getTitle();\n\n        _this3.refs.tabList.insertAdjacentHTML('beforeend', \"<a href=\\\"#category_\".concat(cat.getId(), \"\\\" class=\\\"categories__tab\").concat(_this3.state.activeId === id ? ' is-active' : '', \"\\\">\").concat(title === '' ? \"Category \".concat(id + 1) : title, \"</a>\"));\n      });\n    }\n  }]);\n\n  return Categories;\n}();\n\n\n\n//# sourceURL=webpack:///./admin/src/categories/categories.js?");

/***/ }),

/***/ "./admin/src/category/category.js":
/*!****************************************!*\
  !*** ./admin/src/category/category.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Category; });\n/* harmony import */ var _utils_unique__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/unique */ \"./admin/src/utils/unique.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Category =\n/*#__PURE__*/\nfunction () {\n  function Category(element, settingName) {\n    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n\n    _classCallCheck(this, Category);\n\n    this.el = typeof element === 'undefined' ? this.create(settingName, idx) : element;\n    this.refs = {\n      title: this.el.querySelector('.category__title')\n    };\n    this.props = {\n      settingName: settingName,\n      id: this.el.getAttribute('id').match(/category_(.*)/)[1],\n      idx: parseInt(this.el.dataset.idx)\n    };\n    this.state = {\n      title: this.refs.title.value\n    };\n    this.onTitleChange = this.onTitleChange.bind(this);\n    this.bind();\n  }\n\n  _createClass(Category, [{\n    key: \"bind\",\n    value: function bind() {\n      this.refs.title.addEventListener('keyup', this.onTitleChange);\n    }\n  }, {\n    key: \"onTitleChange\",\n    value: function onTitleChange(event) {\n      this.state.title = event.target.value;\n      this.el.dispatchEvent(new CustomEvent('titleChange', {\n        detail: {\n          id: this.props.id,\n          title: this.state.title\n        }\n      }));\n    }\n  }, {\n    key: \"getId\",\n    value: function getId() {\n      return this.props.id;\n    }\n  }, {\n    key: \"getTitle\",\n    value: function getTitle() {\n      return this.state.title;\n    }\n  }, {\n    key: \"create\",\n    value: function create(settingName, idx) {\n      var id = Object(_utils_unique__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n      var el = document.createElement('div');\n      el.classList.add('category');\n      el.setAttribute('id', \"category_\".concat(id));\n      el.dataset.idx = idx;\n      el.insertAdjacentHTML('beforeend', '<table class=\"form-table\">' + '<tr class=\"row\">' + \"<th><label for=\\\"cat-mandatory_\".concat(id, \"\\\">Mandatory ?</label></th>\") + '<td>' + '<div class=\"switch\">' + \"<input id=\\\"cat-mandatory_\".concat(id, \"\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][mandatory]\\\" type=\\\"checkbox\\\" class=\\\"switch__chk\\\"/>\") + \"<label for=\\\"cat-mandatory_\".concat(id, \"\\\" class=\\\"switch__label\\\">mandatory ?</label>\") + '</div>' + '</td>' + '</tr>' + '<tr class=\"row\">' + \"<th><label for=\\\"cat-title_\".concat(id, \"\\\">Title</label></th>\") + '<td>' + \"<input id=\\\"cat-title_\".concat(id, \"\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][title]\\\" type=\\\"text\\\" class=\\\"category__title\\\"/>\") + '</td>' + '</tr>' + '<tr class=\"row\">' + \"<th><label for=\\\"cat-description_\".concat(id, \"\\\">Description</label></th>\") + '<td>' + \"<textarea id=\\\"cat-description_\".concat(id, \"\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][description]\\\" ></textarea>\") + '</td>' + '</tr>' + '<tr class=\"row\">' + '<th><h3>Custom Texts</h3></th>' + '</tr>' + '<tr>' + \"<th><label for=\\\"texts-enable_\".concat(id, \"\\\">Enable</label></th>\") + '<td>' + \"<input id=\\\"texts-enable_\".concat(id, \"\\\" type=\\\"text\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][texts][enable]\\\" placeholder=\\\"Enable cookies\\\" />\") + '</td>' + \"<th><label for=\\\"texts-enabled_\".concat(id, \"\\\">Enabled</label></th>\") + '<td>' + \"<input id=\\\"texts-enabled_\".concat(id, \"\\\" type=\\\"text\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][texts][enabled]\\\" placeholder=\\\"Enabled\\\" />\") + '</td>' + '</tr>' + '<tr>' + \"<th><label for=\\\"texts-disable_\".concat(id, \"\\\">Disable</label></th>\") + '<td>' + \"<input id=\\\"texts-disable_\".concat(id, \"\\\" type=\\\"text\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][texts][disable]\\\" placeholder=\\\"Disable cookies\\\" />\") + '</td>' + \"<th><label for=\\\"texts-disabled_\".concat(id, \"\\\">Disabled</label></th>\") + '<td>' + \"<input id=\\\"texts-disabled_\".concat(id, \"\\\" type=\\\"text\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][texts][disabled]\\\" placeholder=\\\"Disabled\\\" />\") + '</td>' + '</tr>' + '<tr>' + \"<th><label for=\\\"texts-alwaysEnabled_\".concat(id, \"\\\">Always Enabled <br><small><em>Mandatory category</em></small></label></th>\") + '<td>' + \"<input id=\\\"texts-alwaysEnabled_\".concat(id, \"\\\" type=\\\"text\\\" name=\\\"\").concat(settingName, \"[categories][\").concat(idx, \"][texts][alwaysEnabled]\\\" placeholder=\\\"Always enabled\\\" />\") + '</td>' + '</tr>' + '</table>');\n      return el;\n    }\n  }, {\n    key: \"insert\",\n    value: function insert(container) {}\n  }]);\n\n  return Category;\n}();\n\n\n\n//# sourceURL=webpack:///./admin/src/category/category.js?");

/***/ }),

/***/ "./admin/src/index.js":
/*!****************************!*\
  !*** ./admin/src/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ \"./admin/src/styles.scss\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _categories_categories__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./categories/categories */ \"./admin/src/categories/categories.js\");\n\n\nvar categoriesEl = document.querySelector('.categories');\nif (categoriesEl) new _categories_categories__WEBPACK_IMPORTED_MODULE_1__[\"default\"](categoriesEl);\n\n//# sourceURL=webpack:///./admin/src/index.js?");

/***/ }),

/***/ "./admin/src/styles.scss":
/*!*******************************!*\
  !*** ./admin/src/styles.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./admin/src/styles.scss?");

/***/ }),

/***/ "./admin/src/utils/unique.js":
/*!***********************************!*\
  !*** ./admin/src/utils/unique.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return unique; });\n// Generate unique IDs for use as pseudo-private/protected names.\n// Similar in concept to\n// <http://wiki.ecmascript.org/doku.php?id=strawman:names>.\n//\n// The goals of this function are twofold:\n//\n// * Provide a way to generate a string guaranteed to be unique when compared\n//   to other strings generated by this function.\n// * Make the string complex enough that it is highly unlikely to be\n//   accidentally duplicated by hand (this is key if you're using `ID`\n//   as a private/protected name on an object).\n//\n// Use:\n//\n//     var privateName = ID();\n//     var o = { 'public': 'foo' };\n//     o[privateName] = 'bar';\n//\n// @source https://gist.github.com/gordonbrander/2230317\nfunction unique() {\n  // Math.random should be unique because of its seeding algorithm.\n  // Convert it to base 36 (numbers + letters), and grab the first 9 characters\n  // after the decimal.\n  return Math.random().toString(36).substr(2, 9);\n}\n;\n\n//# sourceURL=webpack:///./admin/src/utils/unique.js?");

/***/ }),

/***/ "./node_modules/delegate/src/closest.js":
/*!**********************************************!*\
  !*** ./node_modules/delegate/src/closest.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var DOCUMENT_NODE_TYPE = 9;\n\n/**\n * A polyfill for Element.matches()\n */\nif (typeof Element !== 'undefined' && !Element.prototype.matches) {\n    var proto = Element.prototype;\n\n    proto.matches = proto.matchesSelector ||\n                    proto.mozMatchesSelector ||\n                    proto.msMatchesSelector ||\n                    proto.oMatchesSelector ||\n                    proto.webkitMatchesSelector;\n}\n\n/**\n * Finds the closest parent that matches a selector.\n *\n * @param {Element} element\n * @param {String} selector\n * @return {Function}\n */\nfunction closest (element, selector) {\n    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {\n        if (typeof element.matches === 'function' &&\n            element.matches(selector)) {\n          return element;\n        }\n        element = element.parentNode;\n    }\n}\n\nmodule.exports = closest;\n\n\n//# sourceURL=webpack:///./node_modules/delegate/src/closest.js?");

/***/ }),

/***/ "./node_modules/delegate/src/delegate.js":
/*!***********************************************!*\
  !*** ./node_modules/delegate/src/delegate.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var closest = __webpack_require__(/*! ./closest */ \"./node_modules/delegate/src/closest.js\");\n\n/**\n * Delegates event to a selector.\n *\n * @param {Element} element\n * @param {String} selector\n * @param {String} type\n * @param {Function} callback\n * @param {Boolean} useCapture\n * @return {Object}\n */\nfunction _delegate(element, selector, type, callback, useCapture) {\n    var listenerFn = listener.apply(this, arguments);\n\n    element.addEventListener(type, listenerFn, useCapture);\n\n    return {\n        destroy: function() {\n            element.removeEventListener(type, listenerFn, useCapture);\n        }\n    }\n}\n\n/**\n * Delegates event to a selector.\n *\n * @param {Element|String|Array} [elements]\n * @param {String} selector\n * @param {String} type\n * @param {Function} callback\n * @param {Boolean} useCapture\n * @return {Object}\n */\nfunction delegate(elements, selector, type, callback, useCapture) {\n    // Handle the regular Element usage\n    if (typeof elements.addEventListener === 'function') {\n        return _delegate.apply(null, arguments);\n    }\n\n    // Handle Element-less usage, it defaults to global delegation\n    if (typeof type === 'function') {\n        // Use `document` as the first parameter, then apply arguments\n        // This is a short way to .unshift `arguments` without running into deoptimizations\n        return _delegate.bind(null, document).apply(null, arguments);\n    }\n\n    // Handle Selector-based usage\n    if (typeof elements === 'string') {\n        elements = document.querySelectorAll(elements);\n    }\n\n    // Handle Array-like based usage\n    return Array.prototype.map.call(elements, function (element) {\n        return _delegate(element, selector, type, callback, useCapture);\n    });\n}\n\n/**\n * Finds closest match and invokes callback.\n *\n * @param {Element} element\n * @param {String} selector\n * @param {String} type\n * @param {Function} callback\n * @return {Function}\n */\nfunction listener(element, selector, type, callback) {\n    return function(e) {\n        e.delegateTarget = closest(e.target, selector);\n\n        if (e.delegateTarget) {\n            callback.call(element, e);\n        }\n    }\n}\n\nmodule.exports = delegate;\n\n\n//# sourceURL=webpack:///./node_modules/delegate/src/delegate.js?");

/***/ })

/******/ });