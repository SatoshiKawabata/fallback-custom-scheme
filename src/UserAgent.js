const RE_IS_IPHONE = /(iPhone\sOS)\s([\d_]+)/;
const RE_IS_IPAD = /(iPad).*OS\s([\d_]+)/;
const RE_IS_IPOD_TOUCH = /(iPod touch).*OS\s([\d_]+)/;
const RE_IS_ANDROID = /(Android)\s+([\d.]+)/;
const RE_IS_WIN = /Windows/;
const RE_IS_MAC = /Mac OS/;

class UserAgent {
  isIOS = null;
  isAndroid = null;
  isWin = null;
  isMac = null;
  isPC = null;
  osVer = null;

  constructor() {
    const ua = navigator.userAgent;
    this.isIOS = !!ua.match(RE_IS_IPHONE) || ua.match(RE_IS_IPAD) || ua.match(RE_IS_IPOD_TOUCH);
    this.isAndroid = !!ua.match(RE_IS_ANDROID);
    this.isWin = !!ua.match(RE_IS_WIN);
    this.isMac = !!ua.match(RE_IS_MAC);
    this.isPC = !!(this.isWin || this.isMac);
    if (this.isIOS || this.isAndroid) {
      let ver = ua.match(/(OS|Android) ([0-9_\.]+){1,3}/);
      ver = ver && ver[2].replace(/_/g, '.');
      this.osVer = ver && Number(ver[0]);
    } else {
      this.osVer = null;
    }
  }
}

export default UserAgent;
