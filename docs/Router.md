> The entry point of the entire application is the router which should be installed in `app.mjs`

### Import the library
```javascript
import { Olum } from "olum";
```

### Make instance
```javascript
import { Olum } from "olum";

new Olum();
```

### Create config object
```javascript
const config = {
  mode: <String>,
  root: <String>,
  el: <String>, 
  prefix: <String>, 
  err: <String>,
  routes: <Array>,
};
```

* __mode__: router mode, either `"hash"` or `"history"`
* __root__: default route of the entire application, it's `"/"` by default, if you had a situation in which your app domain is `www.domainName.com/appName` then the root should equal your app name `"/appName"`
* __el__: its value should be either `#id` or `.class` of the main html element wrapper that will hold the entire app markup, its `#app` by default
* __prefix__: optional prefix for component name, if it's `"app"` then the component name will be `<App-Nav/>` if omitted then your component name will be just `<Nav/>`
* __err__: optional path for not found page
* __routes__: it's an Array of objects the holds the entire application routes 

### Import components
```javascript
import Home from "views/home.js";
import NotFound from "views/notfound.js";
```
> You can think of each one of these components as a `view` that will be injected in the User Interface and holds other little components like nav, header, sidebar and so on.

### Define application routes array
```javascript
import Home from "views/home.js";
import NotFound from "views/notfound.js";

const routes = [
  { path: "/404", comp: NotFound },
  { path: "/", comp: Home },
];
```

### Gathering all together
```javascript
// import library
import { Olum } from "olum"; 
// import components
import Home from "views/home.js";
import NotFound from "views/notfound.js";

// make routes array
const routes = [
  { path: "/404", comp: NotFound },
  { path: "/", comp: Home },
];

// make config object
const config = {
  mode: "history", // history or hash
  root: "/", // default root path
  el: "#app", // application element wrapper will be found in index.html
  prefix: "app", // prefix components with app e.g. <App-Nav /> 
  err: "/404", // error or not found page must be the same path as error or not found component
  routes: routes, // routes array of object
};

new Olum(config); // making instance and passing config object to it
```

### Simplifying the above code
```javascript
import { Olum } from "olum";
import Home from "views/home.js";
import NotFound from "views/notfound.js";

const routes = [{ path: "/404", comp: NotFound }, { path: "/", comp: Home }];
new Olum({ mode: "history", root: "/", el: "#app", prefix: "app", err: "/404", routes});
```
### A faster way for generating router
* Install [Olum Extension](https://marketplace.visualstudio.com/items?itemName=eissapk.olum) on `Visual Studio Code` and just type `olumr` and hit tab 