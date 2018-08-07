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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/components/Component.js":
/*!****************************************!*\
  !*** ./src/js/components/Component.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Alter = __webpack_require__(/*! ../core/Alter */ \"./src/js/core/Alter.js\");\n\nvar _Alter2 = _interopRequireDefault(_Alter);\n\nvar _Utils = __webpack_require__(/*! ../core/Utils */ \"./src/js/core/Utils.js\");\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar notifier = document.createElement('div'),\n    title = _Utils2.default.createElement('div', { className: 'fh-notify__title' }),\n    body = _Utils2.default.createElement('div', { className: 'fh-notify__body' }),\n    close = _Utils2.default.createElement('button', { className: 'fh-notify__close', innerHTML: 'OK' }),\n    display = void 0,\n    awaitAnimation = void 0;\n\nnotifier.appendChild(body);\n\nclose.addEventListener('click', function () {\n  _Utils2.default.addClass(notifier, 'fh-notify--close');\n  _Utils2.default.removeClass(notifier, 'fh-notify--pop');\n\n  clearTimeout(awaitAnimation);\n  clearTimeout(awaitAnimation);\n  awaitAnimation = setTimeout(function () {\n    return _Alter2.default.unmount(notifier);\n  }, 400);\n  clearTimeout(display);\n});\n\nvar Component = function () {\n  function Component(settings) {\n    _classCallCheck(this, Component);\n\n    this._settings = settings;\n  }\n\n  _createClass(Component, [{\n    key: 'get',\n    value: function get() {\n      return this._component;\n    }\n  }, {\n    key: 'configure',\n    value: function configure(fn) {\n      fn(this._settings);\n    }\n  }, {\n    key: '_insert',\n    value: function _insert() {\n      if (this._settings.reference) {\n        switch (this._settings.reference.add) {\n          case 'before':\n            _Alter2.default.before(this._component, this._settings.reference.element);\n            break;\n          case 'after':\n            _Alter2.default.after(this._component, this._settings.reference.element);\n            break;\n        }\n      } else if (this._settings.context) {\n        switch (this._settings.context.method) {\n          case 'prepend':\n            _Alter2.default.prepend(this._component, this._settings.context.element);\n            break;\n          case 'append':\n            this._settings.context.element.appendChild(this._component);\n            break;\n        }\n      }\n    }\n  }, {\n    key: '_init',\n    value: function _init() {}\n  }, {\n    key: 'dispose',\n    value: function dispose() {\n      this._settings = null;\n    }\n  }], [{\n    key: 'notify',\n    value: function notify(type, message) {\n      function hide(timeout) {\n        display = setTimeout(function () {\n          _Utils2.default.removeClass(notifier, 'fh-notify--pop');\n          _Utils2.default.addClass(notifier, 'fh-notify--close');\n          clearTimeout(awaitAnimation);\n          awaitAnimation = setTimeout(function () {\n            return _Alter2.default.unmount(notifier);\n          }, 400);\n        }, timeout);\n      }\n\n      if (type === 'clear') {\n        hide(0);\n        return;\n      }\n\n      notifier.className = 'fh-notify fh-notify--pop';\n      _Alter2.default.before(title, body);\n      notifier.appendChild(close);\n\n      switch (type) {\n        case 'error':\n          notifier.className += ' fh-notify--error';\n          title.innerHTML = 'Oops!';\n          break;\n        case 'success':\n          notifier.className += ' fh-notify--success';\n          title.innerHTML = 'Yaay!';\n          break;\n        case 'warning':\n          notifier.className += ' fh-notify--warning';\n          title.innerHTML = 'Hmm...';\n          break;\n        case 'working':\n          notifier.className += ' fh-notify--working';\n          _Alter2.default.unmount(title);\n          _Alter2.default.unmount(close);\n          message = 'Working on it...';\n          break;\n      }\n\n      body.innerHTML = message;\n      _Alter2.default.prepend(notifier, document.body);\n      clearTimeout(display);\n\n      if (type === 'working') return;\n\n      hide(10000);\n    }\n  }]);\n\n  return Component;\n}();\n\nexports.default = Component;\n\n//# sourceURL=webpack:///./src/js/components/Component.js?");

/***/ }),

/***/ "./src/js/core/Alter.js":
/*!******************************!*\
  !*** ./src/js/core/Alter.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Alter = function () {\n  function Alter() {\n    _classCallCheck(this, Alter);\n  }\n\n  _createClass(Alter, null, [{\n    key: \"prepend\",\n    value: function prepend(newChild, refChild) {\n      refChild.insertBefore(newChild, refChild.firstChild);\n    }\n  }, {\n    key: \"before\",\n    value: function before(newChild, refChild) {\n      refChild.parentNode.insertBefore(newChild, refChild);\n    }\n  }, {\n    key: \"after\",\n    value: function after(newChild, refChild) {\n      refChild.parentNode.insertBefore(newChild, refChild.nextSibling);\n    }\n  }, {\n    key: \"unmount\",\n    value: function unmount(element) {\n      element.parentNode.removeChild(element);\n    }\n  }, {\n    key: \"replace\",\n    value: function replace(newChild, oldChild) {\n      oldChild.parentNode.replaceChild(newChild, oldChild);\n    }\n  }]);\n\n  return Alter;\n}();\n\nexports.default = Alter;\n\n//# sourceURL=webpack:///./src/js/core/Alter.js?");

/***/ }),

/***/ "./src/js/core/Async.js":
/*!******************************!*\
  !*** ./src/js/core/Async.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Component = __webpack_require__(/*! ../components/Component */ \"./src/js/components/Component.js\");\n\nvar _Component2 = _interopRequireDefault(_Component);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar notifier = _Component2.default.notify;\n\nvar Async = function () {\n  function Async() {\n    _classCallCheck(this, Async);\n  }\n\n  _createClass(Async, null, [{\n    key: 'post',\n    value: function post(options) {\n      notifier('working');\n      $.ajax({\n        url: options.url,\n        method: 'POST',\n        data: options.data,\n        processData: false,\n        contentType: false,\n        mimeType: 'multipart/form-data'\n      }).done(function (data) {\n        notifier('success', options.successMessage);\n        options.onDone && options.onDone(data);\n      }).fail(function () {\n        notifier('error', 'Something went terribly wrong. Sorry...');\n      });\n    }\n  }]);\n\n  return Async;\n}();\n\nexports.default = Async;\n\n//# sourceURL=webpack:///./src/js/core/Async.js?");

/***/ }),

/***/ "./src/js/core/Utils.js":
/*!******************************!*\
  !*** ./src/js/core/Utils.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Utils = function () {\n  function Utils() {\n    _classCallCheck(this, Utils);\n  }\n\n  _createClass(Utils, null, [{\n    key: 'hasClass',\n    value: function hasClass(element, className) {\n      return new RegExp('\\\\b' + className + '\\\\b').test(element.className);\n    }\n  }, {\n    key: 'addClass',\n    value: function addClass(element, className) {\n      if (!this.hasClass(element, className)) element.className += ' ' + className;\n    }\n  }, {\n    key: 'removeClass',\n    value: function removeClass(element, className) {\n      if (this.hasClass(element, className)) element.className = element.className.replace(new RegExp('\\\\b' + className + '\\\\b', 'g'), '').trim();\n    }\n  }, {\n    key: 'define',\n    value: function define(obj, key, val) {\n      if (!(key in obj)) {\n        try {\n          if (val !== undefined) Object.defineProperty(obj, key, { value: val });\n        } catch (e) {}\n      }\n    }\n  }, {\n    key: 'createElement',\n    value: function createElement(tagName, htmlProperties, cssProperties) {\n      var element = document.createElement(tagName);\n\n      for (var property in htmlProperties) {\n        element[property] = htmlProperties[property];\n      }for (var _property in cssProperties) {\n        element.style[_property] = cssProperties[_property];\n      }return element;\n    }\n  }, {\n    key: 'URLToImage',\n    value: function URLToImage(input, display) {\n      if (input.files && input.files[0]) {\n        if (new RegExp(/^image\\/(jpeg|png|tiff)$/).test(input.files[0].type)) {\n          var reader = new FileReader();\n\n          reader.onload = function (e) {\n            return display.src = e.target.result;\n          };\n\n          reader.readAsDataURL(input.files[0]);\n\n          return true;\n        }\n\n        return false;\n      }\n    }\n  }, {\n    key: 'isFunction',\n    value: function isFunction(f) {\n      return f && {}.toString.call(f) === '[object Function]';\n    }\n  }, {\n    key: 'uniqueEmails',\n    value: function uniqueEmails(source) {\n      var emails = [];\n\n      [].forEach.call(source, function (element) {\n        emails.push(element.querySelector('.user-email').innerHTML);\n      });\n\n      return emails.filter(function (email, index, self) {\n        return self.indexOf(email) === index;\n      });\n    }\n  }]);\n\n  return Utils;\n}();\n\nexports.default = Utils;\n\n//# sourceURL=webpack:///./src/js/core/Utils.js?");

/***/ }),

/***/ "./src/js/helpers/common.js":
/*!**********************************!*\
  !*** ./src/js/helpers/common.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar SELECT = exports.SELECT = {\n  CONTAINER: 'fh-select',\n  RESULT: 'fh-select__result',\n  RESULT_ITEM: 'fh-select__result__item',\n  RESULT_SELECTED_ITEM: 'fh-select__result__item--selected',\n  RESULT_ACTIVE_CHILD: 'data-active-child',\n  RESULT_ITEM_NO_RESULT: 'fh-autocomplete__result__item--no-result'\n};\n\nvar AUTOCOMPLETE = exports.AUTOCOMPLETE = {\n  CONTAINER: 'fh-autocomplete'\n};\n\nvar SEQUENTIAL_ADD = exports.SEQUENTIAL_ADD = {\n  CONTAINER: 'fh-sequential-add',\n  TRIGGER: 'fh-sequential-add__trigger',\n  ELEMENTS: 'fh-sequntial-add__elements',\n  ITEM_ADD_NEW: 'fh-sequential-add__element-add-new',\n  ITEM_ADDED: 'fh-sequential-add__element-added',\n  ITEM_REMOVE: 'fh-sequential-add__element-added__remove'\n};\n\nvar MODAL = exports.MODAL = {\n  CONTAINER: 'fh-modal',\n  CONTENT_CONTAINER: 'fh-modal__container',\n  CONTENT_PLACEHOLDER: 'fh-modal__placeholder',\n  CLOSE: 'fh-modal__close',\n  CONTENT: 'fh-modal__content',\n  BODY: 'fh-modal__content__body',\n  HEADER: 'fh-modal__content__header',\n  FOOTER: 'fh-modal__content__footer'\n};\n\nvar MULTI_STEP_MODAL = exports.MULTI_STEP_MODAL = {\n  PROGRESS: 'fh-multistep__progress',\n  STEPS: 'fh-multistep__steps',\n  STEP: 'fh-multistep__steps__step',\n  STEP_TITLE: 'fh-multistep__step-title',\n  PROGRESS_LINE: 'fh-multistep__progress__line',\n  PROGRESS_POINT: 'fh-multistep__progress__point',\n  PROGRESS_POINT_CURRENT: 'fh-multistep__progress__point--current'\n};\n\n//# sourceURL=webpack:///./src/js/helpers/common.js?");

/***/ }),

/***/ "./src/js/manage.js":
/*!**************************!*\
  !*** ./src/js/manage.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _Utils = __webpack_require__(/*! ./core/Utils */ \"./src/js/core/Utils.js\");\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nvar _Alter = __webpack_require__(/*! ./core/Alter */ \"./src/js/core/Alter.js\");\n\nvar _Alter2 = _interopRequireDefault(_Alter);\n\nvar _Async = __webpack_require__(/*! ./core/Async */ \"./src/js/core/Async.js\");\n\nvar _Async2 = _interopRequireDefault(_Async);\n\nvar _Component = __webpack_require__(/*! ./components/Component */ \"./src/js/components/Component.js\");\n\nvar _Component2 = _interopRequireDefault(_Component);\n\nvar _common = __webpack_require__(/*! ./helpers/common */ \"./src/js/helpers/common.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction ajaxHandler(selected) {\n  main.notify('working');\n  loaded && _Alter2.default.unmount(script);\n  script = _Utils2.default.createElement('script', {\n    type: 'text/javascript',\n    src: '/dist/js/team-settings.js'\n  });\n  loaded = false;\n\n  $.ajax({\n    url: '../Team/Manage',\n    data: \"tab=\" + selected,\n    dataType: 'html'\n  }).done(function (data) {\n    main.notify('clear');\n    body.innerHTML = data;\n\n    if (selected !== 'settings') return;\n\n    document.body.appendChild(script);\n    loaded = true;\n  });\n}\n\nvar body = document.querySelector('.team__body'),\n    nav = document.querySelector('.team__header__nav'),\n    placeholder = _Utils2.default.createElement('div', {}, {\n  height: nav.offsetHeight + 'px'\n}),\n    items = nav.querySelectorAll('a'),\n    mounted = false,\n    active = items[0],\n    triggeredOn = void 0,\n    main = _Component2.default,\n    header = document.querySelector('.team__header__info'),\n    hImage = header.querySelector('img'),\n    hName = header.querySelector('h3'),\n    hInfo = header.querySelector('p'),\n    script = void 0,\n    loaded = false;\n\nbody.onclick = function (e) {\n  if (e.target.tagName !== 'BUTTON') return;\n\n  if (_Utils2.default.hasClass(e.target, 'update-team')) {\n    var input = body.querySelector('input[type=\"file\"]'),\n        teamName = body.querySelector('.team-name input'),\n        teamInfo = body.querySelector('.team-info textarea');\n\n    var formData = new FormData();\n    formData.append('logo', input.files[0]);\n    formData.append('name', teamName.value);\n    formData.append('info', teamInfo.value);\n\n    _Async2.default.post({\n      url: '../Team/Update',\n      data: formData,\n      successMessage: 'Your changes have been saved',\n      onDone: function onDone(data) {\n        data = JSON.parse(data);\n        hImage.src = data.LogoURL;\n        hName.innerHTML = data.Name;\n        hInfo.innerHTML = data.Info;\n      }\n    });\n  }\n  if (_Utils2.default.hasClass(e.target, 'delete-team')) {\n    main.notify('working');\n    $.ajax({\n      url: '../Team/Delete',\n      method: 'POST'\n    }).done(function (data) {\n      main.notify('success', 'Your team has been successfuly deleted');\n\n      setTimeout(function () {\n        window.location = data.redirectUrl;\n      }, 5000);\n    }).fail(function () {\n      main.notify('error', 'Something went terribly wrong. Sorry...');\n    });\n  }\n  if (_Utils2.default.hasClass(e.target, 'add-members-team')) {\n    var removeMembers = body.querySelector('.remove-members ul'),\n        added = body.querySelector('.' + _common.SEQUENTIAL_ADD.ELEMENTS),\n        addedItems = added.querySelectorAll('.' + _common.SEQUENTIAL_ADD.ITEM_ADDED),\n        emails = _Utils2.default.uniqueEmails(addedItems),\n        _formData = new FormData();\n\n    if (!emails.length) return main.notify('warning', 'Are you really trying to add new members, without actually adding new members?');\n\n    _formData.append('emails', emails.join(','));\n    _Async2.default.post({\n      url: '../Team/AddMembers',\n      data: _formData,\n      successMessage: 'The new members have been successfuly added',\n      onDone: function onDone(data) {\n        added.innerHTML = '';\n        data = JSON.parse(data);\n        removeMembers.innerHTML = '';\n\n        data.forEach(function (member) {\n          removeMembers.innerHTML += \"<li>\\n            <div>\\n              <div>\" + member.FullName + \"</div>\\n              <div class=\\\"user-email\\\">\" + member.Email + \"</div>\\n            </div>\\n            <div><button type=\\\"button\\\" class=\\\"remove-member\\\"></button></div>\\n          </li>\";\n        });\n      }\n    });\n  }\n  if (_Utils2.default.hasClass(e.target, 'remove-members-team')) {\n    var _removeMembers = body.querySelector('.remove-members ul'),\n        forRemoval = _removeMembers.querySelectorAll('.for-removal'),\n        _emails = _Utils2.default.uniqueEmails(forRemoval),\n        _formData2 = new FormData();\n\n    if (!_emails.length) return main.notify('warning', 'Are you really trying to add new members, without actually adding new members?');\n\n    _formData2.append('emails', _emails.join(','));\n    _Async2.default.post({\n      url: '../Team/RemoveMembers',\n      data: _formData2,\n      successMessage: 'The selected members have been remove from your team',\n      onDone: function onDone() {\n        [].forEach.call(forRemoval, function (element) {\n          _Alter2.default.unmount(element);\n        });\n\n        if (!_removeMembers.firstElementChild) _removeMembers.innerHTML = '<li class=\"no-members\">There are currently no other members in your team to remove</li>';\n      }\n    });\n  }\n};\n\nnav.addEventListener('click', function (e) {\n  if (e.target.tagName === 'A') {\n    e.preventDefault();\n\n    _Utils2.default.removeClass(active, 'active');\n    active = e.target;\n    _Utils2.default.addClass(active, 'active');\n\n    ajaxHandler(e.target.getAttribute('data-href'));\n  }\n});\n\nwindow.addEventListener('scroll', function () {\n  var navPosition = nav.getBoundingClientRect().top;\n\n  if (navPosition < 0) {\n    triggeredOn = window.scrollY;\n    nav.style.position = 'fixed';\n    nav.style.top = 0;\n    _Alter2.default.after(placeholder, nav);\n    mounted = true;\n  } else if (navPosition === 0) {\n    if (window.scrollY <= triggeredOn) {\n      nav.style.position = 'relative';\n      nav.style.top = 'auto';\n      mounted && _Alter2.default.unmount(placeholder);\n      mounted = false;\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/js/manage.js?");

/***/ }),

/***/ "./src/scss/teams.scss":
/*!*****************************!*\
  !*** ./src/scss/teams.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"css/teams.css\";\n\n//# sourceURL=webpack:///./src/scss/teams.scss?");

/***/ }),

/***/ 0:
/*!******************************************************!*\
  !*** multi ./src/js/manage.js ./src/scss/teams.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/js/manage.js */\"./src/js/manage.js\");\nmodule.exports = __webpack_require__(/*! ./src/scss/teams.scss */\"./src/scss/teams.scss\");\n\n\n//# sourceURL=webpack:///multi_./src/js/manage.js_./src/scss/teams.scss?");

/***/ })

/******/ });