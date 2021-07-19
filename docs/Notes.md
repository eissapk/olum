### Accessing methods and props from markup and style
> We built the component structure with a way in which we can access all `props` & `methods` from `<template>` & `<style>` tags

```html
<template>
  <div class="ComponentName">
    width is ${this.width}
  </div>
</template>

<script>
  export default class ComponentName {
    width = 50
    data() {
      return {
        name: "ComponentName",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {}
  }
</script>

<style lang="scss">
  .ComponentName {
    width: ${this.width}px;
  }
</style>
```
* As you realized above we defined `width` property in the class of the script tag
* Then we got access on `width` property in `<template>` & `<style>` tags through `${}` this is because all inner content of `<template>` & `<style>` tags are template literals

### Dealing with assets
> We handle assets as modules so in order to import a certain image we do the following

```html
<template>
  <div class="ComponentName">
    <img src="${image}"/> <!-- passing the imported image -->
  </div>
</template>

<script>
  import image from "assets/logo.svg"; // import the image
  export default class ComponentName {
    data() {
      return {
        name: "ComponentName",
        components: {},
        template: this.template(),
        style: this.style(),
        render: this.render.bind(this),
      };
    }

    render() {}
  }
</script>

<style lang="scss">
  .ComponentName {
    background-image: url("${image}"); /* passing the imported image */
  }
</style>
```
* As you saw above we import assets in script tag and passing it in `<template>` & `<style>` tags with template literals placeholder `${}`

### Don'ts
* Don't invoke `data` method from inside `<template>` or `<style>` tags because it will lead to infinite loop just call any prop in `data` method directly so `this.style()` instead of `this.data().style` 
* Don't remove `<style>` or `<template>` tag even if they are empty.
* Don't add `.html` extension while importing `view/components` because html isn't a module so just add `.js` extension to all views/components whenever they location are.