import queryString from 'query-string';

class Context {

  _urlScheme = null;
  query = null;
  fallback = null;
  onFallback = null;
  browserback = null;
  onBrowserback = null;

  constructor(context) {
    context && this.extend(context);
  }

  get urlScheme() {
    const { query, _urlScheme } = this;
    let fullPath = _urlScheme;
    if (query) {
      const queryStr = queryString.stringify(query);
      const parsed = new URL(fullPath);
      parsed.search += (parsed.search ? '&' : '?') + queryStr;
      fullPath = parsed.href;
    }

    return fullPath;
  }

  extend(target) {
    target.urlScheme && (this._urlScheme = target.urlScheme);
    target.query && (this.query = target.query);
    target.fallback && (this.fallback = target.fallback);
    target.onFallback && (this.onFallback = target.onFallback);
    target.browserback && (this.browserback = target.browserback);
    target.onBrowserback && (this.onBrowserback = target.onBrowserback);
  }

  handleFallback() {
    const { fallback } = this;
    if (fallback) {
      location.href = fallback;
    }
    this.onFallback && this.onFallback();
  }

  handleBrowserBack() {
    const { browserback } = this;
    if (browserback === 'back') {
      history.back();
    }
    this.onBrowserback && this.onBrowserback();
  }
}

export default Context;
