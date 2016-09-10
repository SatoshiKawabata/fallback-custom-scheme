(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.FallbackCustomScheme = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var RE_IS_IPHONE = /(iPhone\sOS)\s([\d_]+)/;
var RE_IS_IPAD = /(iPad).*OS\s([\d_]+)/;
var RE_IS_IPOD_TOUCH = /(iPod touch).*OS\s([\d_]+)/;
var RE_IS_ANDROID = /(Android)\s+([\d.]+)/;
var RE_IS_WIN = /Windows/;
var RE_IS_MAC = /Mac OS/;

var UserAgent = function UserAgent() {
  classCallCheck(this, UserAgent);
  this.isIOS = null;
  this.isAndroid = null;
  this.isWin = null;
  this.isMac = null;
  this.isPC = null;
  this.osVer = null;

  var ua = navigator.userAgent;
  this.isIOS = !!ua.match(RE_IS_IPHONE) || ua.match(RE_IS_IPAD) || ua.match(RE_IS_IPOD_TOUCH);
  this.isAndroid = !!ua.match(RE_IS_ANDROID);
  this.isWin = !!ua.match(RE_IS_WIN);
  this.isMac = !!ua.match(RE_IS_MAC);
  this.isPC = !!(this.isWin || this.isMac);
  if (this.isIOS || this.isAndroid) {
    var ver = ua.match(/(OS|Android) ([0-9_\.]+){1,3}/);
    ver = ver && ver[2].replace(/_/g, '.');
    this.osVer = ver && Number(ver[0]);
  } else {
    this.osVer = null;
  }
};

var Context = function () {
  function Context(context) {
    classCallCheck(this, Context);
    this.urlScheme = null;
    this.query = null;
    this.fallback = null;
    this.onFallback = null;
    this.browserback = null;
    this.onBrowserback = null;

    context && this.extend(context);
  }

  createClass(Context, [{
    key: 'extend',
    value: function extend(target) {
      target.urlScheme && (this.urlScheme = target.urlScheme);
      target.query && (this.query = target.query);
      target.fallback && (this.fallback = target.fallback);
      target.onFallback && (this.onFallback = target.onFallback);
      target.browserback && (this.browserback = target.browserback);
      target.onBrowserback && (this.onBrowserback = target.onBrowserback);
    }
  }, {
    key: 'handleFallback',
    value: function handleFallback() {
      var fallback = this.fallback;

      if (fallback) {
        location.href = fallback;
      }
      this.onFallback && this.onFallback();
    }
  }, {
    key: 'handleBrowserBack',
    value: function handleBrowserBack() {
      var browserback = this.browserback;

      if (browserback === 'back') {
        history.back();
      }
      this.onBrowserback && this.onBrowserback();
    }
  }]);
  return Context;
}();

var _window = window;
var document$1 = _window.document;
var location$1 = _window.location;


var openURLByIFrame = function openURLByIFrame(url) {
  var iframe = document$1.createElement('iframe');
  iframe.src = url;
  iframe.setAttribute('height', 0);
  iframe.setAttribute('width', 0);
  iframe.style.display = 'none';
  document$1.body.appendChild(iframe);
  return iframe;
};

var openURLByHref = function openURLByHref(url, isReplace) {
  if (isReplace) {
    location$1.replace(url);
  } else {
    location$1.href = url;
  }
};

var parseQuery = function parseQuery(str) {
  var queries = {};
  var queryStr = str.replace(/^(\?|#|&)/, '');
  var elements = queryStr.split('&');
  for (var i = 0; i < elements.length; i++) {
    var param = elements[i];
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = parts.shift();
    var val = parts.length > 0 ? parts.join('=') : undefined;
    key = decodeURIComponent(key);
    val = val === undefined ? null : decodeURIComponent(val);

    if (queries[key] === undefined) {
      queries[key] = val;
    } else if (Array.isArray(queries[key])) {
      queries[key].push(val);
    } else {
      queries[key] = [queries[key], val];
    }
  }

  return queries;
};

var util$1 = {
  openURLByIFrame: openURLByIFrame,
  openURLByHref: openURLByHref,
  parseQuery: parseQuery
};

var BrowserBackgroundObserver = function () {
  function BrowserBackgroundObserver(onReturn, onLeave, useRequestAnimationFrame) {
    var _this = this;

    classCallCheck(this, BrowserBackgroundObserver);
    this.isReturnBrowser = false;
    this.isLeaveBrowser = false;

    this.onReturn = onReturn;
    this.onLeave = onLeave;
    this.useRequestAnimationFrame = useRequestAnimationFrame;

    this._onLeave = this._onLeave.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    this._onWebkitVisibilityChange = this._onWebkitVisibilityChange.bind(this);

    window.focus();
    window.addEventListener('blur', this._onBlur);
    if (document.hidden !== undefined) {
      document.addEventListener('visibilitychange', this._onVisibilityChange);
    } else if (document.webkitHidden !== undefined) {
      document.addEventListener('webkitvisibilitychange', this._onWebkitVisibilityChange);
    }

    if (useRequestAnimationFrame) {
      (function () {
        var observe = function observe() {
          _this.rafId = window.requestAnimationFrame(observe);
          if (_this.rafTimer !== false) {
            clearTimeout(_this.rafTimer);
          }

          _this.rafTimer = setTimeout(function () {
            if (!isReturnBrowser) {
              _onReturn();
            }

            window.cancelAnimationFrame(_this.rafId);
          }, 1000);
        };

        observe();
      })();
    }
  }

  createClass(BrowserBackgroundObserver, [{
    key: '_onReturn',
    value: function _onReturn() {
      var rafTimer = this.rafTimer;
      var rafId = this.rafId;

      this.isReturnBrowser = true;
      document.removeEventListener('visibilitychange', this._onVisibilityChange);
      document.removeEventListener('webkitvisibilitychange', this._onWebkitVisibilityChange);
      window.removeEventListener('focus', this._onFocus);
      clearTimeout(rafTimer);
      window.cancelAnimationFrame && window.cancelAnimationFrame(rafId);

      this.onReturn && this.onReturn();
    }
  }, {
    key: '_onLeave',
    value: function _onLeave() {
      this.isLeaveBrowser = true;
      this.onLeave && this.onLeave();
    }
  }, {
    key: '_onBlur',
    value: function _onBlur() {
      var isLeaveBrowser = this.isLeaveBrowser;

      window.removeEventListener('blur', this._onBlur);
      window.addEventListener('focus', this._onFocus);
      if (!isLeaveBrowser) {
        this._onLeave();
      }
    }
  }, {
    key: '_onFocus',
    value: function _onFocus() {
      var isReturnBrowser = this.isReturnBrowser;

      if (!isReturnBrowser) {
        this._onReturn();
      }
    }
  }, {
    key: '_onVisibilityChange',
    value: function _onVisibilityChange() {
      var isLeaveBrowser = this.isLeaveBrowser;
      var isReturnBrowser = this.isReturnBrowser;

      if (!isLeaveBrowser && document.hidden) {
        this._onLeave();
      } else if (!isReturnBrowser && !document.hidden) {
        this._onReturn();
      }
    }
  }, {
    key: '_onWebkitVisibilityChange',
    value: function _onWebkitVisibilityChange() {
      var isLeaveBrowser = this.isLeaveBrowser;
      var isReturnBrowser = this.isReturnBrowser;

      if (!isLeaveBrowser && document.webkitHidden) {
        this._onLeave();
      } else if (!isReturnBrowser && !document.webkitHidden) {
        this._onReturn();
      }
    }
  }]);
  return BrowserBackgroundObserver;
}();

var BaseLauncher = function () {
  function BaseLauncher(context) {
    classCallCheck(this, BaseLauncher);
    this._context = null;
    this._fallbackTime = 500;

    this._context = context;

    this._handleTimeout = this._handleTimeout.bind(this);
    this._handleLeaveBrowser = this._handleLeaveBrowser.bind(this);
    this._handleBrowserBack = this._handleBrowserBack.bind(this);
  }

  createClass(BaseLauncher, [{
    key: 'launch',
    value: function launch() {
      util$1.openURLByIFrame(this._context.urlScheme);
      this._timerId = setTimeout(this._handleTimeout, this._fallbackTime);
      this._observer = new BrowserBackgroundObserver(this._handleBrowserBack, this._handleLeaveBrowser, true);
    }
  }, {
    key: '_handleTimeout',
    value: function _handleTimeout() {
      this._context.handleFallback();
    }
  }, {
    key: '_handleLeaveBrowser',
    value: function _handleLeaveBrowser() {
      var _timerId = this._timerId;

      clearTimeout(_timerId);
    }
  }, {
    key: '_handleBrowserBack',
    value: function _handleBrowserBack() {
      this._context.handleBrowserBack();
    }
  }]);
  return BaseLauncher;
}();

var IOS = function (_BaseLauncher) {
  inherits(IOS, _BaseLauncher);

  function IOS() {
    classCallCheck(this, IOS);
    return possibleConstructorReturn(this, (IOS.__proto__ || Object.getPrototypeOf(IOS)).apply(this, arguments));
  }

  createClass(IOS, [{
    key: 'launch',
    value: function launch() {
      var _context = this._context;

      if (_context.osVer > 8) {
        util$1.openURLByHref(_context.urlScheme);
      } else {
        util$1.openURLByIFrame(_context.urlScheme);
      }

      this._timerId = setTimeout(this._handleTimeout, this._fallbackTime);
      this._observer = new BrowserBackgroundObserver(this._handleBrowserBack, this._handleLeaveBrowser, true);
    }
  }]);
  return IOS;
}(BaseLauncher);

var Android = function (_BaseLauncher) {
  inherits(Android, _BaseLauncher);

  function Android() {
    classCallCheck(this, Android);
    return possibleConstructorReturn(this, (Android.__proto__ || Object.getPrototypeOf(Android)).apply(this, arguments));
  }

  return Android;
}(BaseLauncher);

var PC = function (_BaseLauncher) {
  inherits(PC, _BaseLauncher);

  function PC(context) {
    classCallCheck(this, PC);

    var _this = possibleConstructorReturn(this, (PC.__proto__ || Object.getPrototypeOf(PC)).call(this, context));

    _this._enableEventListener(window);
    _this._enableEventListener(document);
    return _this;
  }

  createClass(PC, [{
    key: 'launch',
    value: function launch() {
      util$1.openURLByIFrame(this._context.urlScheme);
      this._timerId = setTimeout(this._handleTimeout, this._fallbackTime);
      this._observer = new BrowserBackgroundObserver(this._handleBrowserBack, this._handleLeaveBrowser, true);
    }
  }, {
    key: '_enableEventListener',
    value: function _enableEventListener(target) {
      if (!target.addEventListener) {
        target.addEventListener = function (type, callback) {
          target.attachEvent('on' + type, callback);
        };
      }

      if (!target.removeEventListener) {
        target.removeEventListener = function (type, callback) {
          target.detachEvent('on' + type, callback);
        };
      }
    }
  }]);
  return PC;
}(BaseLauncher);

var util = {
  IOS: IOS,
  Android: Android,
  PC: PC
};

var FallbackCustomScheme = function () {
  function FallbackCustomScheme(options) {
    classCallCheck(this, FallbackCustomScheme);
    this._ua = new UserAgent();

    this._context = new Context(options);
  }

  createClass(FallbackCustomScheme, [{
    key: 'launch',
    value: function launch(options) {
      var _context = this._context;
      var _ua = this._ua;

      options && _context.extend(options);
      var urlScheme = _context.urlScheme;
      var isIOS = _ua.isIOS;
      var isAndroid = _ua.isAndroid;
      var isPC = _ua.isPC;


      if (!urlScheme) {
        throw new Error('you must set "urlScheme"');
      }

      if (isIOS) {
        this._launcher = new IOS(_context);
      } else if (isAndroid) {
        this._launcher = new Android(_context);
      } else if (isPC) {
        this._launcher = new PC(_context);
      }
      if (this._launcher) {
        this._launcher.launch();
      }
    }
  }]);
  return FallbackCustomScheme;
}();

return FallbackCustomScheme;

})));