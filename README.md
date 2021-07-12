<p align="center"><img width="100" src="https://www.eissa.xyz/olum/logo.png" alt="Olum logo"></p>

# Olumjs
`The VanillaJS developer’s platform.`


Are you a Vanilla JS fan? 

Want to build an amazing `spa` with just vanilla javascript!

Then Olumjs is for you.

Olumjs is built for ignoring anything but vanilla javascript.

---

### Features
* Reusable Components
* State Management System
* Routing (SPA)
* Coding with Vanilla JS `(the best feature)`

> You don't need to learn a new library or a framework if you already know vanilla js, and this is the reason behind Olumjs creation.

---

### Ecosystem
  * Routing (SPA)
  * State Management system 
  * Olum-CLI
  * Devtool that works anywhere
  * VSC extension with syntax highlighter and code snippets.

---

# Get Started
### Install CLI
```bash
npm i -g olum-cli
```
### Create a project
```bash
olum create myApp
```
### Run dev server
```bash
npm run dev
```

### Build to deploy
```bash
npm run build
```

---

# Documentation - `CLI`
### Router - `app.mjs`
> You must install the Router in app.mjs as it's entry point of the application.

```javascript
import { Olum } from "olum";
import Home from "./views/home.js";
import NotFound from "./views/notfound.js";

const routes = [
  { path: "/404", comp: NotFound },
  { path: "/", comp: Home },
];

const olum = new Olum({
  mode: "history", // history or hash
  root: "/",
  el: "#app", // app wrapper will be found in index.html
  prefix: "app", // prefix components e.g. <App-Nav /> 
  err: "/404", // default path of error page must be the same path as NotFound component above
  routes,
});
```

---

### Component Structure
```html
<template>
  <div class="Home">
    <!-- here is you markup must be wrapped, prefered to be a div -->
    <App-Nav /> <!-- registering Nav component -->
  </div>
</template>

<script>
  import Nav from "../components/nav";
  export default class Home {
    constructor() {}
    data() {
      return {
        name: "Home",
        components: { Nav }, // registering Nav component 
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() { 
      // here is your logic 
    }
  }
</script>

<style lang="scss">
  .Home { 
    /* here is your style */ 
  }
</style>
```

---

### State Management System - `api.js`
> api.js is a shared service between components direct/indirect

```javascript
import { Service } from "olum";

class Api extends Service {

  constructor() {  
    super("eventName"); // service event name
  }

  todos = [];

  add(todo) {
    this.todos.push(todo); // store passed todo in todos array
    this.trigger(); // dispatch service event to listen on it from other components 
  }

  get() {
    return this.todos;
  }

}

export const api = new Api(); // you must export one instance for preserving your data from loss

```

---

### A Component Stores Data in `Shared Service`
> On form submission it stores a todo in the shared service `api.js` through its method `add`
```html
<template>
  <div class="AddTodo">
    <form>
      <input type="text" placeholder="Enter Todo..." />
      <button type="submit">add</button>
    </form>
  </div>
</template>

<script>
  import { api } from "../services/api.js";
  export default class AddTodo {

    data() {
      return {
        name: "AddTodo",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {
      const form = document.querySelector(".AddTodo form");
      const input = document.querySelector(".AddTodo input");

      form.addEventListener("submit", e => {
        e.preventDefault();
        const todo = { title: input.value, id: 1 };
        api.add(todo);
      });

    }

  }
</script>

<style lang="scss">
  .AddTodo {}
</style>

```
---

### A Component retrieves data from `Shared Service`

```html
<template>
  <div class="Todos">
    <ul></ul>
  </div>
</template>

<script>
  import { api } from "../services/api.js";
  export default class Todos {

    data() {
      return {
        name: "Todos",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {
      window.addEventListener(api.event, () => { // listen on the service event
        const todos = api.get();
        const ul = document.querySelector(".Todos ul");
        ul.innerHTML = todos.map(todo => `<li>${todo.title}</li>`).join("");
      });

      api.trigger(); // dispatch service event 
    }

  }
</script>

<style lang="scss">
  .Todos {}
</style>
```

---




# Important Notes
* Don't invoke this.data() from inside __template__ or __style__ tags because it will lead to infinite loop just call any prop in data() directly so `this.style()` instead of `this.data().style` 

* In __style__ tag if you want to pass a prop or method from component class then put it the same thing as the template literals palceholder `width: ${this.todoWidth}px;`

* You have to wrap your markup inside a wrapper and it's recommended to use __div__ tag this way
```html 
<template>
  <div>
    <!-- your markup goes here -->
  </div>
</template>
```
* Don't remove __template__ or __style__ tag even if they are empty.

* You may have a case in which two views use one component, so in order to know current route from the shared component then you gotta use this method olum.getRoute(), it returns a string with the route path e.g. "/about"