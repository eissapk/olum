> Suppose we have A parent and child components and we want to register the child in the parent

### Child component

> We do export this child component to import it later in parent component

```html
<template>
  <div class="Child">Hello from child component</div>
</template>

<script>
  export default class Child {
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

> We register child in parent as follows

```html
<template>
  <div class="Parent">
    Hello from parent component
    <Child />
  </div>
</template>

<script>
  import Child from "components/child.html";
  export default class Parent {
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

- You will realize that we imported child component and added the child markup placeholder as a tag `<Child />` and that's it!

> Hint
* While importing component we can remove the extension or add it as `.html` or even as `.js`

### Valid imports are as follows:

```javascript
import Child from "components/child";
// or
import Child from "components/child.html";
// or
import Child from "components/child.js";
```
