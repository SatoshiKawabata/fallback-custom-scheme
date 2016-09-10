class Context {

  urlScheme = null;
  query = null;
  fallback = null;
  onFallback = null;
  browserback = null;
  onBrowserback = null;

  constructor(context) {
    context && this.extend(context);
  }

  extend(target) {
    target.urlScheme && (this.urlScheme = target.urlScheme);
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
