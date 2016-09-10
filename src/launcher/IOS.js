import util from '../util';
import BaseLauncher from './Base';
import BrowserBackgroundObserver from './BrowserBackgroundObserver';

class IOS extends BaseLauncher {
  launch() {
    const { _context } = this;
    if (_context.osVer > 8) {
      util.openURLByHref(_context.urlScheme);
    } else {
      util.openURLByIFrame(_context.urlScheme);
    }

    this._timerId = setTimeout(this._handleTimeout, this._fallbackTime);
    this._observer = new BrowserBackgroundObserver(
      this._handleBrowserBack,
      this._handleLeaveBrowser,
      true);
  }
}
export default IOS;
