### Get current route
> Get the current route by calling `getRoute` method

> You need to install olum router first
```bash
npm install olum-router
```

```javascript
import OlumRouter from "olum-router";

const router = new OlumRouter(configObject);

router.getRoute();
```

### Navigate to a certain route
> We do navigate here to `"/about"` page by passing it's path to `navigate` method

```javascript
import OlumRouter from "olum-router";

const router = new OlumRouter(configObject);

router.navigate("/about");
```

### Navigate by HTML attribute
> In order to navigate directly to a certain route without using javascript then just add `to="path"` attribute to any element in your markup

```html
<template>
  <div class="ComponentName">
    <a to="/about">about</a> <!-- click this anchor tag to get about page -->
  </div>
</template>
```

### Hint
> The current route link has `.active` class name, so you can use this class later in styling

> You need to give any children of a router link `<a to="/about">about</a>` a style of `pointer-events: none;` 

### Freeze & unfreeze router
> In some cases you will be needing to stop your web app page from rendering if you pushed a route 

```javascript
import OlumRouter from "olum-router";

const router = new OlumRouter(configObject);

router.freeze(); // this method stops page rendering 
router.unfreeze(); // this method resets your app to the default 
```