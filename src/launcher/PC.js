import util from '../util';
import BaseLauncher from './Base';
import BrowserBackgroundObserver from './BrowserBackgroundObserver';

class PC extends BaseLauncher {

  constructor(context) {
    super(context);
    this._enableEventListener(window);
    this._enableEventListener(document);
  }

  launch() {
    util.openURLByIFrame(this._context.urlScheme);
    this._timerId = setTimeout(this._handleTimeout, this._fallbackTime);
    this._observer = new BrowserBackgroundObserver(
      this._handleBrowserBack,
      this._handleLeaveBrowser,
      true);
  }

  _enableEventListener(target) {
    if (!target.addEventListener) {
      target.addEventListener = (type, callback) => {
        target.attachEvent(`on${type}`, callback);
      };
    }

    if (!target.removeEventListener) {
      target.removeEventListener = (type, callback) => {
        target.detachEvent(`on${type}`, callback);
      };
    }
  }
}
export default PC;
