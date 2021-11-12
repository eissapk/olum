<!-- > We can use olum without the CLI tool but you will be needing to setup a `bundler` such as webpack on your own once you decide to deploy your app

### Download the library from unpkg
[unpkg](https://unpkg.com/olum@0.0.7/dist/olum.js)

### Download the devtool
[devtool](https://raw.githubusercontent.com/olumjs/olum-devtool/master/devtool.js)

`Paste olum.js & devtool.js in the root of your project`

### Include olum in index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Olum app</title>
  </head>
  <body>

    <div id="app"></div>

    <script src="olum.js"></script>
    <script src="app.js" type="module"></script>
  </body>
</html>
```
* We included the library `<script src="olum.js"></script>`
* Also we added `<script src="app.js" type="module"></script>` as the entry point of our app with `type="module"` 
* We also added `<div id="app"></div>` as placeholder with id of `app`

### Setup router

```javascript
import Home from "./home.js";

const routes = [{ path: "/", comp: Home }];

export const olum = new Olum({
  mode: "history",
  root: "/",
  el: "#app",
  routes,
});
```

* As you see we did setup the router and imported `Home` component

### Create home component
`The component here uses a javascript file but in the CLI we use html file`

```javascript
export default class Home {
  data() {
    return {
      name: "Home",
      template: this.template(),
      style: this.style(),
      render: this.render.bind(this),
    };
  }

  template() { // your markup goes here
    return `
      <div class="Home">
        Home component works!
      </div>
    `;
  }

  style() { // your style goes here
    return `
      .Home {
        color: blue;
      }
    `;
  }

  render() { // your logic goes here
    console.log("Home");
  }
}
``` -->