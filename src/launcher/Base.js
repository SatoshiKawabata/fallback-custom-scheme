import util from '../util';
import BrowserBackgroundObserver from './BrowserBackgroundObserver';

class BaseLauncher {
  _context = null;
  _fallbackTime = 500;
  _timerId;
  _observer;

  constructor(context) {
    this._context = context;

    this._handleTimeout = this._handleTimeout.bind(this);
    this._handleLeaveBrowser = this._handleLeaveBrowser.bind(this);
    this._handleBrowserBack = this._handleBrowserBack.bind(this);
  }

  launch() {
    util.openURLByIFrame(this._context.urlScheme);
    this._timerId = setTimeout(this._handleTimeout, this._fallbackTime);
    this._observer = new BrowserBackgroundObserver(
      this._handleBrowserBack,
      this._handleLeaveBrowser,
      true);
  }

  _handleTimeout() {
    this._context.handleFallback();
  }

  _handleLeaveBrowser() {
    const { _timerId } = this;
    clearTimeout(_timerId);
  }

  _handleBrowserBack() {
    this._context.handleBrowserBack();
  }
}

export default BaseLauncher;
