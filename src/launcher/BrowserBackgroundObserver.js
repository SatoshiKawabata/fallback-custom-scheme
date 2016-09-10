class BrowserBackgroundObserver {
  onReturn;
  onLeave;
  useRequestAnimationFrame;
  isReturnBrowser = false;
  isLeaveBrowser = false;
  rafId;
  rafTimer;

  constructor(onReturn, onLeave, useRequestAnimationFrame) {
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
      const observe = () => {
        this.rafId = window.requestAnimationFrame(observe);
        if (this.rafTimer !== false) {
          clearTimeout(this.rafTimer);
        }

        this.rafTimer = setTimeout(() => {
          if (!isReturnBrowser) {
            _onReturn();
          }

          window.cancelAnimationFrame(this.rafId);
        }, 1000);
      };

      observe();
    }
  }

  _onReturn() {
    const {
      rafTimer,
      rafId,
    } = this;
    this.isReturnBrowser = true;
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    document.removeEventListener('webkitvisibilitychange', this._onWebkitVisibilityChange);
    window.removeEventListener('focus', this._onFocus);
    clearTimeout(rafTimer);
    window.cancelAnimationFrame && window.cancelAnimationFrame(rafId);

    this.onReturn && this.onReturn();
  }

  _onLeave() {
    this.isLeaveBrowser = true;
    this.onLeave && this.onLeave();
  }

  _onBlur() {
    const {
      isLeaveBrowser,
    } = this;
    window.removeEventListener('blur', this._onBlur);
    window.addEventListener('focus', this._onFocus);
    if (!isLeaveBrowser) {
      this._onLeave();
    }
  }

  _onFocus() {
    const {
      isReturnBrowser,
    } = this;
    if (!isReturnBrowser) {
      this._onReturn();
    }
  }

  _onVisibilityChange() {
    const {
      isLeaveBrowser,
      isReturnBrowser,
    } = this;
    if (!isLeaveBrowser && document.hidden) {
      this._onLeave();
    } else if (!isReturnBrowser && !document.hidden) {
      this._onReturn();
    }
  }

  _onWebkitVisibilityChange() {
    const {
      isLeaveBrowser,
      isReturnBrowser,
    } = this;
    if (!isLeaveBrowser && document.webkitHidden) {
      this._onLeave();
    } else if (!isReturnBrowser && !document.webkitHidden) {
      this._onReturn();
    }
  }
}

export default BrowserBackgroundObserver;
