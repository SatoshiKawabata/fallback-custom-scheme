import UserAgent from './UserAgent';
import Context from './Context';
import {
  IOS,
  Android,
  PC,
} from './launcher/';

class FallbackCustomScheme {
  _context;
  _ua = new UserAgent();
  _launcher;

  constructor(options) {
    this._context = new Context(options);
  }

  launch(options) {
    const {
      _context,
      _ua,
    } = this;
    options && _context.extend(options);
    const {
      urlScheme,
    } = _context;
    const {
      isIOS,
      isAndroid,
      isPC,
    } = _ua;

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
}

export default FallbackCustomScheme;
