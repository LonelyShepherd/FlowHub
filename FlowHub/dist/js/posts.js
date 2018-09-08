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
eval("\n\nvar _Alter = __webpack_require__(/*! ./core/Alter */ \"./src/js/core/Alter.js\");\n\nvar _Alter2 = _interopRequireDefault(_Alter);\n\nvar _Utils = __webpack_require__(/*! ./core/Utils */ \"./src/js/core/Utils.js\");\n\nvar _Utils2 = _interopRequireDefault(_Utils);\n\nvar _Traversal = __webpack_require__(/*! ./core/Traversal */ \"./src/js/core/Traversal.js\");\n\nvar _Traversal2 = _interopRequireDefault(_Traversal);\n\nvar _Event = __webpack_require__(/*! ./core/Event */ \"./src/js/core/Event.js\");\n\nvar _Event2 = _interopRequireDefault(_Event);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar composer = document.querySelector('.post-composer'),\n    textbox = composer.querySelector('textarea'),\n    manager = textbox.nextElementSibling,\n    createPost = composer.querySelector('.post-btn'),\n    uploadHolder = composer.querySelector('.post-composer__uploader'),\n    uploader = uploadHolder.querySelector('.post-composer__uploader__upload'),\n    input = uploader.querySelector('input'),\n    uniqueId = 0,\n    uploads = [],\n    actions = void 0,\n    postsPresenter = document.querySelector('.posts-presenter'),\n    loadPosts = document.querySelector('.dashboard-section--post-presenter .load-posts');\n\nfunction close(e) {\n  var parent = _Traversal2.default.parents(e.target, '.post-composer');\n\n  if (parent === null && !_Utils2.default.hasClass(e.target, 'remove-image')) {\n    _Utils2.default.css(textbox, {\n      height: 'auto',\n      overflow: 'hidden'\n    });\n    _Utils2.default.removeClass(manager, 'post-composer__manager--slide');\n    document.removeEventListener('click', close);\n  }\n}\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  loadPosts.click();\n}, false);\n\ntextbox.addEventListener('input', function () {\n  _Utils2.default.css(textbox, {\n    height: 'auto',\n    overflow: 'auto'\n  });\n  textbox.style.height = textbox.scrollHeight + textbox.offsetHeight - textbox.clientHeight + 'px';\n});\n\ntextbox.addEventListener('focus', function () {\n  _Event2.default.trigger(textbox, 'input');\n  _Utils2.default.addClass(manager, 'post-composer__manager--slide');\n  document.addEventListener('click', close);\n});\n\ninput.addEventListener('change', function () {\n  var image = _Utils2.default.createElement('img');\n  var successful = _Utils2.default.URLToImage(input, image);\n\n  if (!successful) {\n    console.log('failed');\n    input.value = '';\n    return;\n  }\n\n  var imageHolder = _Utils2.default.createElement('div', { id: \"image-\" + uniqueId++, className: 'post-composer__uploader__image' }),\n      close = _Utils2.default.createElement('button', { className: 'remove-image' }),\n      file = {\n    id: imageHolder.id,\n    file: input.files[0]\n  };\n\n  uploads.push(file);\n  console.log(uploads);\n  imageHolder.appendChild(close);\n  imageHolder.appendChild(image);\n  _Alter2.default.before(imageHolder, uploader);\n  input.value = '';\n\n  var scrollW = uploadHolder.scrollWidth,\n      clientW = uploadHolder.clientWidth;\n\n  if (scrollW > clientW) uploadHolder.scrollLeft = scrollW - clientW;\n});\n\nuploadHolder.addEventListener('click', function (e) {\n  var action = e.target;\n\n  if (_Utils2.default.hasClass(action, 'remove-image')) {\n    var parent = action.parentNode;\n    uploads = uploads.filter(function (file) {\n      return file.id !== parent.id;\n    });\n    console.log(uploads);\n    _Alter2.default.unmount(parent);\n  }\n});\n\ncreatePost.addEventListener('click', function () {\n  if (textbox.value !== '' || uploads.length !== 0) {\n    var formData = new FormData();\n    formData.append('message', textbox.value);\n\n    for (var i = 0; i < uploads.length; i++) {\n      formData.append(\"image-\" + i, uploads[i].file);\n    }\n\n    console.log(formData);\n    $.ajax({\n      url: '/Post/Create',\n      method: 'POST',\n      data: formData,\n      contentType: false,\n      processData: false,\n      mimeType: 'multipart/form-data'\n    }).done(function (data) {\n      console.log(data);\n      var template = document.createElement('template');\n      data = data.trim(); // Never return a text node of whitespace as the result\n      template.innerHTML = data;\n      _Alter2.default.prepend(template.content.firstChild, postsPresenter);\n      var uploadedImages = Array.from(uploadHolder.children);\n      uploadedImages.filter(function (e) {\n        return _Utils2.default.hasClass(e, 'post-composer__uploader__image');\n      }).forEach(function (e) {\n        return _Alter2.default.unmount(e);\n      });\n      uploads.length = 0;\n      textbox.value = '';\n    });\n  }\n});\n\nloadPosts.addEventListener('click', function (e) {\n  $.ajax({\n    url: '/Post/GetPosts',\n    dataType: 'json',\n    data: 'after_cursor=' + postsPresenter.getAttribute('data-acursor')\n  }).done(function (data) {\n    console.log(data.cursors.after);\n    if (data.cursors.after === '') {\n      _Alter2.default.unmount(loadPosts);\n      // Say sth\n    }\n\n    postsPresenter.setAttribute('data-acursor', data.cursors.after);\n    postsPresenter.innerHTML += data.posts;\n  });\n});\n\n//loadPosts.addEventListener('click', e => {\n//    $.ajax({\n//        url: '/Post/GetComments'\n//        //dataType: 'json',\n//        //data: 'after_cursor=' + postsPresenter.getAttribute('data-acursor')\n//    }).done(data => {\n\n//        console.log(data);\n//    });\n//});\n\npostsPresenter.addEventListener('click', function (e) {\n  var action = e.target;\n\n  switch (action.innerHTML) {\n    case 'Delete':\n      var post = _Traversal2.default.parents(action, '.posts-presenter__post');\n      $.ajax({\n        url: '/Post/DeletePost',\n        method: 'GET',\n        data: 'post_id=' + post.getAttribute('data-postid')\n      }).done(function (data) {\n        _Alter2.default.unmount(post);\n      });\n      break;\n  }\n\n  switch (action.className) {\n    case 'show-commentos':\n      var _textbox = _Traversal2.default.parents(action, '.posts-presenter__post__content');\n      var comments = _Traversal2.default.next(_textbox, '.posts-presenter__post__comments');\n      var commentsPresenter = comments.querySelector('.comment-presenter');\n      if (commentsPresenter.getAttribute('data-acursor') === '') {\n        var commentLoader = comments.querySelector('.loadmore');\n        if (commentLoader) commentLoader.click();\n      }\n      comments.style.display = window.getComputedStyle(comments).display === 'none' ? 'block' : 'none';\n      break;\n\n    case 'loadmore':\n      var _post = _Traversal2.default.parents(action, '.posts-presenter__post');\n      var postId = _post.getAttribute('data-postid');\n      commentsPresenter = _Traversal2.default.prev(action, '.comment-presenter');\n\n      $.ajax({\n        url: '/Post/GetComments',\n        dataType: 'json',\n        data: 'post_id=' + postId + '&after_cursor=' + commentsPresenter.getAttribute('data-acursor')\n      }).done(function (data) {\n        console.log(data.cursors.after);\n        if (data.cursors.after === '') {\n          _Alter2.default.unmount(action);\n          //action.style.display = 'none';\n          // Say sth\n        }\n\n        commentsPresenter.innerHTML += data.comments;\n        commentsPresenter.setAttribute('data-acursor', data.cursors.after);\n        //console.log(data.cursors);\n      });\n\n      break;\n\n    case 'post-comment':\n      var commentInput = _Traversal2.default.parents(action, '.comment-input').querySelector('#comment-composer');\n      _post = _Traversal2.default.parents(action, '.posts-presenter__post');\n      commentsPresenter = _post.querySelector('.comment-presenter');\n      var formData = new FormData();\n      formData.append('message', commentInput.value);\n      formData.append('post_id', _post.getAttribute('data-postid'));\n      if (commentInput !== '') {\n        $.ajax({\n          url: '/Post/CreateComment',\n          method: 'POST',\n          data: formData,\n          contentType: false,\n          processData: false,\n          mimeType: 'multipart/form-data'\n        }).done(function (data) {\n          //var template = document.createElement('template');\n          //data = data.trim(); // Never return a text node of whitespace as the result\n          //template.innerHTML = data;\n          //Alter.prepend(template.content.firstChild, commentsPresenter);\n          commentsPresenter.innerHTML = data + commentsPresenter.innerHTML;\n          commentInput.value = '';\n        });\n      }\n      break;\n  }\n});\n\n//# sourceURL=webpack:///./src/js/posts.js?");

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