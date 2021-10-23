> The entry point of the entire application is in `app.mjs`

### Import the library
```javascript
import OlumRouter from "olum-router";
```

### Make instance
```javascript
import OlumRouter from "olum-router";

const router = new OlumRouter();
```

### Create config object
```javascript
const config = {
  mode: <String>,
  root: <String>,
  err: <String>,
  routes: <Array>,
};
```

* __mode__: router mode, either `"hash"` or `"history"`
* __root__: default route of the entire application, it's `"/"` by default, if you had a situation in which your app domain is `www.domainName.com/appName` then the root should equal your app name `"/appName"`
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
import OlumRouter from "olum-router";

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
  err: "/404", // error or not found page must be the same path as error or not found component
  routes: routes, // routes array of object
};

const router = new OlumRouter(config); // making instance and passing config object to it
```

### Integrating olum-router with olum
`app.mjs`
```javascript
import OlumRouter from "olum-router";
import Olum from "olum";
import Home from "views/home.js";
import NotFound from "views/notfound.js";

const routes = [{ path: "/404", comp: NotFound }, { path: "/", comp: Home }];
const router = new OlumRouter({mode: "history", root: "/", err: "/404", routes: routes}); 

new Olum({prefix:"app"}).$("#root").use(router); // using router
// new Olum({prefix:"app"}).$("#root").use(Home); // ignoring router and using Home component as root component
```

* __$("#root")__: selects the html tag from `/path/to/src/public/index.html` that will hold the entire app markup and you can select by either `#id`, `.class` or `tagName`  
* __prefix__: optional prefix for component name, if it's `"app"` then the component name will be `<App-Nav/>` if omitted then your component name will be just `<Nav/>`


### A faster way for generating router
* Install [Olum Extension](https://marketplace.visualstudio.com/items?itemName=eissapk.olum) on `Visual Studio Code` and just type `olumr` and hit tab 