> Suppose we have A parent and child components and we want to register the child in the parent

### Child component
> We do export this child component to import it in parent component
```html
<template>
  <div class="Child">Hello from child component</div>
</template>

<script>
  export default class Child {
    constructor() {}
    data() {
      return {
        name: "Child",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {
      console.log("Hello from child component");
    }
  }
</script>

<style lang="scss">
  .Child {
  }
</style>
```

### Parent component
> We register child in parnt as follows

```html
<template>
  <div class="Parent">
    Hello from parent component
    <Child />
  </div>
</template>

<script>
  import Child from "components/child.js";
  export default class Parent {
    data() {
      return {
        name: "Parent",
        components: { Child },
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {
      console.log("Hello from parent component");
    }
  }
</script>

<style lang="scss">
  .Parent {
  }
</style>
```
* You will realize that we imported child component and passed it in `components` object in `data` method, also we added the child markup placeholder as a tag `<Child />` and that's it!
* Also we added `.js` instead of `.html` when importing child component that's because all components/views will be compiled from `HTML` file to `Javascript` file 