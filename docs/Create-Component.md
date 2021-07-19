> Components must be under components directory of the project tree and they acutally are `html` files, each component includes 3 parts `template`, `style` & `script` tags

### Template tag
```html
<template>

</template>
```
* Template tag holds the component markup and the markup must be wrapped in an element, it's prefered to use a `div` as markup wrapper

```html
<template>
  <div class="ComponentName">
    <!-- your markup goes here -->
  </div>
</template>
```

### Script tag
```html
<script>

</script>
```
> Script tag is based on es6 `OOP` Object Oriented Programming so you need to be familiar with it, if you don't then you should watch this [video](https://www.youtube.com/watch?v=vDJpGenyHaA)

#### Create a class
> Let's create `Nav` class

```html
<script>
  class Nav {

  }
</script>
```

#### Export the class
> It doesn't matter if you export it as default or non-default, you will handle it later when importing it

```html
<script>
  export default class Nav {

  }
</script>
```

#### Add configuration to the class
> Add `data` method which returns configuration object

```html
<script>
  export default class Nav {
    data() {
      return {
        name: "Nav",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }
  }
</script>
```
* __name__: holds the class/component name
* __components__: an object for registering other components in current class/component, we will explain this later
* __template__: invokes template method and it links the `<template>` tag with current class
* __style__: invokes style method and it links the `<style>` tag with current class
* __render__: invokes render method that has the component logic


#### Define render method
> Write the component logic in render method

```html
<script>
  export default class Nav {
    data() {
      return {
        name: "Nav",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() { 
      console.log("Hello World"); // Your logic goes here
    }

  }
</script>
```

### Style tag
> You can write your styling as `css` or `sass`

```html
<style>
  /* your styling goes here as css */
  .selector { 
     background: red;
  }
</style>
```

#### Enabling Sass
> Just add `lang="scss"` or `lang="sass"` attribute in the style tag 

```html
<style lang="scss">
  /* your styling goes here as scss */
  .selector { 
     background: red;
  }
</style>
```

### A faster way for generating component
* Install [Olum Extension](https://marketplace.visualstudio.com/items?itemName=eissapk.olum) on `Visual Studio Code` and just type `olumc` and hit tab 