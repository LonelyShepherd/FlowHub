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

/***/ "./src/js/components/Modal.js":
/*!************************************!*\
  !*** ./src/js/components/Modal.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _Utils = __webpack_require__(/*! ../core/Utils */ \"./src/js/core/Utils.js\");\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nvar _Alter = __webpack_require__(/*! ../core/Alter */ \"./src/js/core/Alter.js\");\n\nvar _Alter2 = _interopRequireDefault(_Alter);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar zIndex = 100;\n\nvar DEFAULTS = {};\n\nvar TEMPLATE = \"<div class=\\\"js-modal\\\" style=\\\"z-index: \" + zIndex++ + \"\\\">\\n  <div class=\\\"js-modal__header\\\">\\n  </div>\\n  <div class=\\\"js-modal__body\\\">\\n  </div>\\n  <div class=\\\"js-modal__footer\\\">\\n  </div>\\n</div>\";\n\nfunction Modal(settings) {\n  var _options = _extends({}, DEFAULTS, settings),\n      _modal = void 0,\n      _body = void 0,\n      _footer = void 0,\n      _closeButton = void 0,\n      _overlay = void 0,\n      _opened = false,\n      _events = [];\n\n  function _init() {\n    _create();\n    _addEvents();\n  }\n\n  function _create() {\n    _overlay = _Utils2.default.createElement('div', { className: 'js-modal-overlay' });\n    _closeButton = _Utils2.default.createElement('button', { className: 'js-modal__header-close' });\n\n    var generator = _Utils2.default.createElement('div', {\n      innerHTML: TEMPLATE\n    }, {\n      visibility: 'hidden'\n    });\n\n    _modal = generator.children[0];\n    _body = _modal.children[1];\n    _footer = _modal.children[2];\n\n    _modal.children[0].appendChild(_Utils2.default.createElement('h1', { innerHTML: settings.title }));\n    _modal.children[0].appendChild(_closeButton);\n\n    for (var button in settings.buttons) {\n      _footer.appendChild(_Utils2.default.createElement('button', { innerHTML: button }));\n    }\n  }\n\n  function _footerEvents(e) {\n    if (e.target.tagName !== 'BUTTON') return;\n\n    for (var button in settings.buttons) {\n      if (e.target.innerHTML === button) settings.buttons[button].call();\n    }\n  }\n\n  function _addEvents() {\n    _events.push({ element: _closeButton, event: 'click', handler: close });\n    _events.push({ element: _footer, event: 'click', handler: _footerEvents });\n    _events.push({ element: _overlay, event: 'click', handler: close });\n\n    _attachEvents(_events);\n  }\n\n  function _attachEvents(ref) {\n    ref.forEach(function (_ref) {\n      var element = _ref.element,\n          event = _ref.event,\n          handler = _ref.handler;\n\n      element.addEventListener(event, handler);\n    });\n  }\n\n  function _detachEvents(ref) {\n    ref.forEach(function (_ref2) {\n      var element = _ref2.element,\n          event = _ref2.event,\n          handler = _ref2.handler;\n\n      element.removeEventListener(event, handler);\n    });\n\n    ref.length = 0;\n  }\n\n  function _open() {\n    if (_opened) return;\n\n    var fragment = document.createDocumentFragment();\n    fragment.appendChild(_overlay);\n    fragment.appendChild(_modal);\n    _Alter2.default.prepend(fragment, document.body);\n\n    _opened = true;\n  }\n\n  function _close() {\n    if (!_opened) return;\n\n    _Alter2.default.unmount(_overlay);\n    _Alter2.default.unmount(_modal);\n\n    _opened = false;\n  }\n\n  function open() {\n    _open();\n  }\n\n  function close() {\n    _close();\n  }\n\n  function setContent(content) {\n    _body.innerHTML = '';\n\n    content instanceof Element ? _body.appendChild(content) : typeof content === 'string' && (_body.innerHTML = content);\n  }\n\n  _init();\n\n  return {\n    open: open,\n    close: close,\n    setContent: setContent\n  };\n}\n\nexports.default = Modal;\n\n//# sourceURL=webpack:///./src/js/components/Modal.js?");

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

/***/ "./src/js/core/Event.js":
/*!******************************!*\
  !*** ./src/js/core/Event.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Event = function () {\n  function Event() {\n    _classCallCheck(this, Event);\n  }\n\n  _createClass(Event, null, [{\n    key: 'trigger',\n    value: function trigger(element, event) {\n      if (document.createEvent) {\n        var e = document.createEvent('HTMLEvents');\n        e.initEvent(event, false, true);\n        element.dispatchEvent(e);\n      } else {\n        var _e = document.createEventObject();\n        _e.eventType = event;\n        element.fireEvent('on' + _e.eventType, _e);\n      }\n    }\n  }]);\n\n  return Event;\n}();\n\nexports.default = Event;\n\n//# sourceURL=webpack:///./src/js/core/Event.js?");

/***/ }),

/***/ "./src/js/core/Traversal.js":
/*!**********************************!*\
  !*** ./src/js/core/Traversal.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _Utils = __webpack_require__(/*! ./Utils */ \"./src/js/core/Utils.js\");\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar ep = Element.prototype;\nvar s = 'atchesSelector';\n_Utils2.default.define(Element.prototype, 'matches', ep['matches'] || ep['m' + s] || ep['mozM' + s] || ep['oM' + s] || ep['webkitM' + s] || ['msM' + s]);\n\nvar Traversal = function () {\n  function Traversal() {\n    _classCallCheck(this, Traversal);\n  }\n\n  _createClass(Traversal, null, [{\n    key: 'prev',\n    value: function prev(element, selector) {\n      if (selector) {\n        var first = element;\n\n        while (first = first.previousElementSibling) {\n          if (first.matches(selector)) return first;\n        }\n\n        return null;\n      }\n\n      return element.previousElementSibling;\n    }\n  }, {\n    key: 'next',\n    value: function next(element, selector) {\n      if (selector) {\n        var first = element;\n\n        while (first = first.nextElementSibling) {\n          if (first.matches(selector)) return first;\n        }\n\n        return null;\n      }\n\n      return element.nextElementSibling;\n    }\n  }, {\n    key: 'parents',\n    value: function parents(element, selector) {\n      var first = element;\n\n      while (first = first.parentNode) {\n        if (first === document) return null;\n\n        if (first.matches(selector)) return first;\n      }\n\n      return null;\n    }\n  }]);\n\n  return Traversal;\n}();\n\nexports.default = Traversal;\n\n//# sourceURL=webpack:///./src/js/core/Traversal.js?");

/***/ }),

/***/ "./src/js/core/Utils.js":
/*!******************************!*\
  !*** ./src/js/core/Utils.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Utils = function () {\n  function Utils() {\n    _classCallCheck(this, Utils);\n  }\n\n  _createClass(Utils, null, [{\n    key: 'hasClass',\n    value: function hasClass(element, className) {\n      return new RegExp('\\\\b' + className + '\\\\b').test(element.className);\n    }\n  }, {\n    key: 'addClass',\n    value: function addClass(element, className) {\n      if (!this.hasClass(element, className)) element.className += ' ' + className;\n    }\n  }, {\n    key: 'removeClass',\n    value: function removeClass(element, className) {\n      if (this.hasClass(element, className)) element.className = element.className.replace(new RegExp('\\\\b' + className + '\\\\b', 'g'), '').trim();\n    }\n  }, {\n    key: 'define',\n    value: function define(obj, key, val) {\n      if (!(key in obj)) {\n        try {\n          if (val !== undefined) Object.defineProperty(obj, key, { value: val });\n        } catch (e) {}\n      }\n    }\n  }, {\n    key: 'css',\n    value: function css(element, properties) {\n      for (var property in properties) {\n        element.style[property] = properties[property];\n      }\n    }\n  }, {\n    key: 'createElement',\n    value: function createElement(tagName, htmlProperties, cssProperties) {\n      var element = document.createElement(tagName);\n\n      for (var property in htmlProperties) {\n        element[property] = htmlProperties[property];\n      }this.css(element, cssProperties);\n\n      return element;\n    }\n  }, {\n    key: 'URLToImage',\n    value: function URLToImage(input, display) {\n      if (input.files && input.files[0]) {\n        if (new RegExp(/^image\\/(jpeg|png|tiff)$/).test(input.files[0].type)) {\n          var reader = new FileReader();\n\n          reader.onload = function (e) {\n            return display.src = e.target.result;\n          };\n\n          reader.readAsDataURL(input.files[0]);\n\n          return true;\n        }\n\n        return false;\n      }\n    }\n  }, {\n    key: 'isFunction',\n    value: function isFunction(f) {\n      return f && {}.toString.call(f) === '[object Function]';\n    }\n  }, {\n    key: 'uniqueEmails',\n    value: function uniqueEmails(source) {\n      var emails = [];\n\n      [].forEach.call(source, function (element) {\n        emails.push(element.querySelector('.user-email').innerHTML);\n      });\n\n      return emails.filter(function (email, index, self) {\n        return self.indexOf(email) === index;\n      });\n    }\n  }]);\n\n  return Utils;\n}();\n\nexports.default = Utils;\n\n//# sourceURL=webpack:///./src/js/core/Utils.js?");

/***/ }),

/***/ "./src/js/posts.js":
/*!*************************!*\
  !*** ./src/js/posts.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _Alter = __webpack_require__(/*! ./core/Alter */ \"./src/js/core/Alter.js\");\n\nvar _Alter2 = _interopRequireDefault(_Alter);\n\nvar _Utils = __webpack_require__(/*! ./core/Utils */ \"./src/js/core/Utils.js\");\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nvar _Traversal = __webpack_require__(/*! ./core/Traversal */ \"./src/js/core/Traversal.js\");\n\nvar _Traversal2 = _interopRequireDefault(_Traversal);\n\nvar _Event = __webpack_require__(/*! ./core/Event */ \"./src/js/core/Event.js\");\n\nvar _Event2 = _interopRequireDefault(_Event);\n\nvar _Modal = __webpack_require__(/*! ./components/Modal */ \"./src/js/components/Modal.js\");\n\nvar _Modal2 = _interopRequireDefault(_Modal);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar composer = document.querySelector('.post-composer'),\n    textbox = composer.querySelector('textarea'),\n    manager = textbox.nextElementSibling,\n    createPost = composer.querySelector('.post-btn'),\n    uploadHolder = composer.querySelector('.post-composer__uploader'),\n    uploaded = uploadHolder.querySelector('.post-composer__uploader__uploaded'),\n    uploader = uploadHolder.querySelector('.post-composer__uploader__upload'),\n    input = uploader.querySelector('input'),\n    uniqueId = 0,\n    uploads = [],\n    actions = void 0,\n    mouseDown = false,\n    postsPresenter = document.querySelector('.posts-presenter'),\n    loadPosts = document.querySelector('.dashboard-section--post-presenter .load-posts'),\n    editModal = new _Modal2.default({\n    title: 'Edit post',\n    buttons: {\n        Save: function Save() {\n            // ajax handler for editing an existing post\n        }\n    }\n});\n\nvar actionsMenu = _Utils2.default.createElement('div', {\n    className: 'post-actions-menu',\n    innerHTML: \"<ul><li><button class=\\\"post-actions-menu__action\\\">Edit</button></li><li><button class=\\\"post-actions-menu__action\\\">Delete</button></li></ul>\"\n});\n\nfunction close(e) {\n    var parent = _Traversal2.default.parents(e.target, '.post-composer');\n\n    if (parent === null && !_Utils2.default.hasClass(e.target, 'remove-image')) {\n        _Utils2.default.css(textbox, {\n            height: 'auto',\n            overflow: 'hidden'\n        });\n        _Utils2.default.removeClass(manager, 'post-composer__manager--slide');\n        document.removeEventListener('click', close);\n    }\n}\n\nfunction autoresize(e) {\n    var target = e.target;\n\n    target.style.height = window.getComputedStyle(target).minHeight;\n    target.style.height = target.scrollHeight + target.offsetHeight - target.clientHeight + 'px';\n}\n\nfunction showComments(action, display, fetch) {\n    var postContent = _Traversal2.default.parents(action, '.posts-presenter__post__content'),\n        comments = postContent.nextElementSibling,\n        commentsPresenter = comments.querySelector('.comment-presenter');\n\n    if (commentsPresenter.getAttribute('data-acursor') === '' && fetch) {\n        var commentLoader = comments.querySelector('.loadmore');\n\n        if (commentLoader) commentLoader.click();\n    }\n\n    if (display === true) comments.style.display = 'block';else if (display === 'auto') comments.style.display = window.getComputedStyle(comments).display === 'none' ? 'block' : 'none';\n}\n\ndocument.addEventListener('DOMContentLoaded', function () {\n    _Event2.default.trigger(loadPosts, 'click');\n}, false);\n\ntextbox.addEventListener('input', function () {\n    _Utils2.default.css(textbox, {\n        height: 'auto',\n        overflow: 'auto'\n    });\n    textbox.style.height = textbox.scrollHeight + textbox.offsetHeight - textbox.clientHeight + 'px';\n});\n\ntextbox.addEventListener('focus', function () {\n    _Event2.default.trigger(textbox, 'input');\n    _Utils2.default.addClass(manager, 'post-composer__manager--slide');\n    document.addEventListener('click', close);\n});\n\ninput.addEventListener('change', function () {\n    [].forEach.call(input.files, function (file) {\n        var image = _Utils2.default.createElement('img');\n\n        if (new RegExp(/^image\\/(jpeg|png|tiff)$/).test(file.type)) {\n            var reader = new FileReader();\n\n            reader.onload = function (e) {\n                return image.src = e.target.result;\n            };\n\n            reader.readAsDataURL(file);\n\n            var imageHolder = _Utils2.default.createElement('div', { id: \"image-\" + uniqueId++, className: 'post-composer__uploader__image' }),\n                _close = _Utils2.default.createElement('button', { className: 'remove-image' }),\n                f = {\n                id: imageHolder.id,\n                file: file\n            };\n\n            uploads.push(f);\n\n            imageHolder.appendChild(_close);\n            imageHolder.appendChild(image);\n            _Alter2.default.before(imageHolder, uploader);\n        }\n    });\n\n    input.value = '';\n\n    var scrollW = uploadHolder.scrollWidth,\n        clientW = uploadHolder.clientWidth;\n\n    if (scrollW > clientW) uploadHolder.scrollLeft = scrollW - clientW;\n});\n\nuploadHolder.addEventListener('click', function (e) {\n    var action = e.target;\n\n    if (_Utils2.default.hasClass(action, 'remove-image')) {\n        var parent = action.parentNode;\n        uploads = uploads.filter(function (file) {\n            return file.id !== parent.id;\n        });\n        _Alter2.default.unmount(parent);\n    }\n});\n\ncreatePost.addEventListener('click', function () {\n    if (textbox.value.trim() !== '' || uploads.length !== 0) {\n        var formData = new FormData();\n        formData.append('message', textbox.value);\n\n        for (var i = 0; i < uploads.length; i++) {\n            formData.append(\"image-\" + i, uploads[i].file);\n        }$.ajax({\n            url: '/Post/Create',\n            method: 'POST',\n            data: formData,\n            contentType: false,\n            processData: false,\n            mimeType: 'multipart/form-data'\n        }).done(function (data) {\n            var template = document.createElement('template');\n            data = data.trim(); // Never return a text node of whitespace as the result\n            template.innerHTML = data;\n            _Alter2.default.prepend(template.content.firstChild, postsPresenter);\n\n            var uploadedImages = Array.from(uploaded.children);\n            uploadedImages.filter(function (e) {\n                return _Utils2.default.hasClass(e, 'post-composer__uploader__image');\n            }).forEach(function (e) {\n                return _Alter2.default.unmount(e);\n            });\n\n            uploads.length = 0;\n            textbox.value = '';\n\n            _Utils2.default.css(textbox, {\n                height: 'auto',\n                overflow: 'hidden'\n            });\n            _Utils2.default.removeClass(manager, 'post-composer__manager--slide');\n            document.removeEventListener('click', close);\n        });\n    }\n});\n\nloadPosts.addEventListener('click', function (e) {\n    $.ajax({\n        url: '/Post/GetPosts',\n        dataType: 'json',\n        data: 'after_cursor=' + postsPresenter.getAttribute('data-acursor')\n    }).done(function (data) {\n        if (data.cursors.after === '') _Alter2.default.unmount(loadPosts);\n\n        postsPresenter.setAttribute('data-acursor', data.cursors.after);\n        postsPresenter.innerHTML += data.posts;\n    });\n});\n\npostsPresenter.addEventListener('mousedown', function (e) {\n    if (_Utils2.default.hasClass(e.target, 'post-comment')) mouseDown = true;else if (_Utils2.default.hasClass(e.target, 'post-actions-menu') || _Traversal2.default.parents(e.target, '.post-actions-menu')) mouseDown = true;else if (_Utils2.default.hasClass(e.target, 'post-actions')) if (e.target.nextElementSibling === actionsMenu) {\n        e.preventDefault();\n        e.target.blur();\n    }\n});\n\npostsPresenter.addEventListener('focusin', function (e) {\n    switch (e.target.className) {\n        case 'comment-textbox':\n            e.target.parentNode.nextElementSibling.style.display = 'block';\n            e.target.addEventListener('input', autoresize);\n            break;\n        case 'post-actions':\n            e.target.parentNode.appendChild(actionsMenu);\n            break;\n    }\n});\n\npostsPresenter.addEventListener('focusout', function (e) {\n    if (!mouseDown) {\n        switch (e.target.className) {\n            case 'comment-textbox':\n                e.target.parentNode.nextElementSibling.style.display = 'none';\n                e.target.removeEventListener('input', autoresize);\n                break;\n            case 'post-actions':\n                _Alter2.default.unmount(actionsMenu);\n                break;\n        }\n    }\n\n    mouseDown = false;\n});\n\npostsPresenter.addEventListener('click', function (e) {\n    var action = e.target,\n        post = void 0,\n        commentsPresenter = void 0,\n        formData = void 0,\n        textarea = _Utils2.default.createElement('textarea');\n\n    switch (action.innerHTML) {\n        case 'Delete':\n            post = _Traversal2.default.parents(action, '.posts-presenter__post');\n\n            $.ajax({\n                url: '/Post/DeletePost',\n                method: 'DELETE',\n                data: 'post_id=' + post.getAttribute('data-postid')\n            }).done(function () {\n                _Alter2.default.unmount(post);\n            });\n            break;\n        case 'Edit':\n            post = _Traversal2.default.parents(action, '.posts-presenter__post');\n            textarea.value = post.querySelector('.content__post').innerHTML;\n\n            editModal.setContent(textarea);\n            editModal.open();\n            textarea.focus();\n            break;\n    }\n\n    switch (action.className) {\n        case 'show-comments':\n            showComments(action, 'auto', true);\n            break;\n\n        case 'loadmore':\n            var _post = _Traversal2.default.parents(action, '.posts-presenter__post');\n            var postId = _post.getAttribute('data-postid');\n            commentsPresenter = _Traversal2.default.prev(action, '.comment-presenter');\n\n            $.ajax({\n                url: '/Post/GetComments',\n                dataType: 'json',\n                data: 'post_id=' + postId + '&after_cursor=' + commentsPresenter.getAttribute('data-acursor')\n            }).done(function (data) {\n                if (data.cursors.after === '') _Alter2.default.unmount(action);\n\n                commentsPresenter.innerHTML += data.comments;\n                commentsPresenter.setAttribute('data-acursor', data.cursors.after);\n            });\n            break;\n        case 'post-actions-menu__action':\n            _Alter2.default.unmount(actionsMenu);\n            mouseDown = false;\n            break;\n    }\n\n    if (_Utils2.default.hasClass(action, 'post-comment')) {\n        var commentComposer = action.parentNode.previousElementSibling.querySelector('#comment-composer'),\n            commentValue = commentComposer.value.trim();\n\n        post = _Traversal2.default.parents(action, '.posts-presenter__post');\n        commentsPresenter = post.querySelector('.comment-presenter');\n\n        formData = new FormData();\n        formData.append('message', commentValue);\n        formData.append('post_id', post.getAttribute('data-postid'));\n\n        if (commentComposer.value !== '') {\n            $.ajax({\n                url: '/Post/CreateComment',\n                method: 'POST',\n                data: formData,\n                contentType: false,\n                processData: false,\n                mimeType: 'multipart/form-data'\n            }).done(function (data) {\n                var temp = _Utils2.default.createElement('div', { innerHTML: data });\n\n                //if (commentsPresenter.getAttribute('data-acursor') !== '')\n                _Alter2.default.prepend(temp.firstElementChild, commentsPresenter);\n                showComments(action, true, true);\n\n                commentComposer.value = '';\n                action.parentNode.style.display = 'none';\n            });\n        } else action.parentNode.style.display = 'none';\n    }\n});\n\n//# sourceURL=webpack:///./src/js/posts.js?");

/***/ }),

/***/ "./src/scss/dashboard.scss":
/*!*********************************!*\
  !*** ./src/scss/dashboard.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"css/dashboard.css\";\n\n//# sourceURL=webpack:///./src/scss/dashboard.scss?");

/***/ }),

/***/ 0:
/*!*********************************************************!*\
  !*** multi ./src/js/posts.js ./src/scss/dashboard.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/js/posts.js */\"./src/js/posts.js\");\nmodule.exports = __webpack_require__(/*! ./src/scss/dashboard.scss */\"./src/scss/dashboard.scss\");\n\n\n//# sourceURL=webpack:///multi_./src/js/posts.js_./src/scss/dashboard.scss?");

/***/ })

/******/ });