> Settings that control the entire application

### Settings
> You will find this `settings.js` file in the root of your application

```javascript
module.exports = {
  dest: "build", // name of the final build folder for deployment
  src: ".pre-build", // name of the source folder that is used by webpack bundler
  port: 8000, // development server port
  livereload: true, // browser hot reload
  fallback: "/", // catch all routes to fallback to root in development mode only
  comments: false, // remove/keep comments from compiled/bundled files in build folder
  hash: 5, // encrypt assets with hash 
  title: "Olum App", // application <title> tag content
  asyncAwait: false, // enable/disable polyfill for supporting async/await
  https: false, // enable/disable https protocol
  favicon:"./public/favicon.png", // path to application favicon
  template: "./public/index.html", // path to application index.html
  serviceWorker: true, // enable/disable service worker
  manifest: { // manifest info for service worker
    name: "Olum App",
    short_name: "Olum App",
    description: "Olum Progressive Web App",
    background_color: "#ffffff",
    publicPath: "./",
    display: "standalone",
    orientation: "any",
    start_url: "index.html",
    theme_color: "#ffffff",
    icons: [
      {
        src: "./public/manifest.png", // path to manifest icon
        sizes: [96, 128, 192, 256, 384, 512], // generating multiple sizes of a single icon
      },
    ],
  },
};
```

### Hint
> Service worker is configured to run when building your app for production only,</br>
so you need to uncomment this block of code in `app.mjs` before running `npm run build`
```javascript
// uncomment in production mode
if ("serviceWorker" in navigator) {
  window.on("load", () => navigator.serviceWorker.register("/service-worker.js").catch(console.error));
}

// comment in development mode
// if ("serviceWorker" in navigator) {
//   window.on("load", () => navigator.serviceWorker.register("/service-worker.js").catch(console.error));
// }
```