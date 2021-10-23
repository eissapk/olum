### Accessing methods and props from markup and style
> We built the component structure with a way in which we can access all `props` & `methods` from `<template>` & `<style>` tags

```html
<template>
  <div class="ComponentName">
    height is ${height}
    width is ${this.width}
  </div>
</template>

<script>
  let height = 100;
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
    heigth: ${height}px;
    width: ${this.width}px;
  }
</style>
```
* As you realized above we defined `width` property in the class of the script tag
* Then we got access on `width/height` property in `<template>` & `<style>` tags through `${}` this is because all inner content of `<template>` & `<style>` tags are template literals

### Dealing with assets
> We handle assets as modules by default so in order to import a certain image we do the following

> You can disable `assetsAsModule` option in the packge.json file add your assets paths as normal e.g `<img src="assets/foo.png"/>`

> It's recommended to include your assets in `assets` folder inside `src` e.g. `path/to/my-project/src/assets`


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