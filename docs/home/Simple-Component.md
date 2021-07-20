```html
<template>
  <div class="HelloWorld">
    HelloWorld component works!
  </div>
</template>

<script>
  export default class HelloWorld {
    data() {
      return {
        name: "HelloWorld",
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {
      console.log("HelloWorld");
    }
  }
</script>

<style lang="scss">
  .HelloWorld {
    color: blue;
  }
</style>
```