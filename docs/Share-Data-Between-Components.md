> Suppose that we have `API` service, component `One`, component `Two` and we want to share data from One to Two and vice versa

### API service

```javascript
import { Service } from "olum-helpers";

class API extends Service {
  constructor() { super("ApiDataLoaded"); }

  todos = [];

  add(todo) {
    this.todos.push(todo);
    this.trigger(); 
  }

  get() {
    return this.todos;
  }
}

export const api = new API();
```

* In this `API` service we added two methods `add` & `get`
* Regarding `add` method it pushes todo object in todos array and dispatches `ApiDataLoaded` event via `trigger` method
* Regarding `get` method it just returns the todos array

### Component One stores data in `API service`
> On form submission it stores a todo object in the shared service `api.js` through its method `add`

```html
<template>
  <div class="One">
    <form>
      <input type="text" placeholder="Enter Todo..." />
      <button type="submit">add</button>
    </form>
  </div>
</template>

<script>
  import { api } from "services/api.js"; // import the api service
  export default class One {

    data() {
      return {
        name: "One",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {
      const form = document.querySelector(".One form");
      const input = document.querySelector(".One input");

      form.addEventListener("submit", e => {
        e.preventDefault();
        const todo = { title: input.value, id: 1 };
        api.add(todo); // call add method in api service
      });

    }

  }
</script>

<style lang="scss">
  .One {}
</style>
```
* Now we added todo object to be stored in memory via api service, let's get this todo object from another component in our case it will be `Two` component






### Component Two retrieves data from `API service`
> We will listen on `ApiDataLoaded` event that we made in the API service to update the dom with the stored data

```html
<template>
  <div class="Two">
    <ul></ul>
  </div>
</template>

<script>
  import { api } from "services/api.js";
  export default class Two {

    data() {
      return {
        name: "Two",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {
      // listen on the API service event which is "ApiDataLoaded" 
      window.addEventListener(api.event, () => { 
        const todos = api.get(); // get all todos
        const ul = document.querySelector(".Two ul");
        ul.innerHTML = todos.map(todo => `<li>${todo.title}</li>`).join(""); // loop to inject todos in dom
      });
    }

  }
</script>

<style lang="scss">
  .Two {}
</style>
```

* You will realize that we did listen on the "ApiDataLoaded" event without typing it, because we can access it via `event` propery in the api service itself
* Also we got all todos via `get` method in the api service
* And the last thing is to fire or dispatch the "ApiDataLoaded" event by calling `trigger` method which does exist in api service

### Hint
> You may ask your self how we can access `event` propery or `trigger` method even we didn't define them in the `API` service, Remember that we Inherit all `props` & `method` from `Service` class that we imported from `olum-helpers` library, so this way we have access on its stuff.

### ViewLoaded Event
> You must use the router in order to access that `viewLoaded` event

> You may want to do some functionalities after loading a specific view/route in order to achieve that just listen to this event below:

```javascript
window.addEventListener("viewLoaded", e => console.log("view loaded!"));
```