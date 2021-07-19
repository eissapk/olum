### Create service
> The reason behind creating a service is to share data between components despite the direct/indirect relations between components/views, let's create a service called `api` under this path `src/services/api.js`

```javascript
import { Service } from "olum";

class API extends Service {
  constructor() { super("ApiDataLoaded"); }

}

export const api = new API();
```

* We imported `Service` from `olum` library 
* We created a class called `API` that inherits `Service` methods & props
* Also we called the base class by `super` and passed the event name which is `"ApiDataLoaded"` in our case, we will use this event later don't worry
* Also we made an instance from `API` class to be stored in `api variable` and then exported it.

### Hint
* You need to choose a proper event name for avoiding conflicts with native events
* Don't ever export the `API` class directly without making an instance from it, because if you did that then you will lose your data because each instance has its own seperated data and this is a pure javascript that you should know
* You don't have to use import and inherits `Service` class from `olum` library, if you know how to create events and dispatch them then you can make your own stuff

### A faster way for generating service
* Install [Olum Extension](https://marketplace.visualstudio.com/items?itemName=eissapk.olum) on `Visual Studio Code` and just type `olums` and hit tab 