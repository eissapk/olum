> You can export an instance of Olum to use it later with other components and views

### Get current route
> Get the current route by calling `getRoute` method

```javascript
import { Olum } from "olum";

const olum = new Olum(configObject);

olum.getRoute();
```

### Navigate to a certain route
> We do navigate here to `"/about"` page by passing it's path to `navigate` method

```javascript
import { Olum } from "olum";

const olum = new Olum(configObject);

olum.navigate("/about");
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

### Freeze & unfreeze router
> In some cases you will be needing to stop your web app page from rendering if you pushed a route 

```javascript
import { Olum } from "olum";

const olum = new Olum(configObject);

olum.freeze(); // this method stops page rendering 
olum.unfreeze(); // this method resets your app to the default 
```