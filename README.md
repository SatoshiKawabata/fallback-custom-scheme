# fallback-custom-scheme

Launcher application (iOS, Android, Windows, Mac) from web page.
Use custom url scheme to launch app.
If not installed the application, fallback (ex. app store, google play store etc).

| app | handling |
| --- | --- |
| installed | open application |
| not installed | fallback (ex. your store url) |

### DEMO
[demo page](https://satoshikawabata.github.io/fallback-custom-scheme/)

## Usage

```js
var FallbackCustomScheme = requie('fallback-custom-scheme');
var fcs = new window.FallbackCustomScheme({
  urlScheme: 'hoge://temp', // your application custom scheme
  fallback: 'itunes://hoge', // if not installed the applicaiton, handling (ex. app store, google play store etc)
  onFallback: function(){}, // fallback handler
  browserback: 'back', // handling on return browser
  onBrowserback: function(){} // browser back handler
});
```
