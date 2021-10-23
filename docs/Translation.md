> Olumjs supports multi-language SPA via `olum-helpers` package

```bash
npm install olum-helpers
```

### Dictionaries
> We can add dictionaries to `src/locales` directory

### English Dictionary
> let's say we have `en.js` file which holds all translations of English language
```javascript
export default {
  desc: "The VanillaJS developer’s platform."
};
```

### Arabic Dictionary
> let's say we have `ar.js` file which holds all translations of Arabic language
```javascript
export default {
  desc: "منصة مطوري فانيلا جافاسكربت"
};
```
### Hint
`desc` is the key that we will use later in the code and its value is the actual translation phrase that will be shown in the UI

### Registering dictionaries
> The whole setup of the translations will be in `src/app.mjs`

```javascript
import { Localize } from "olum-helpers";

// importing dictionaries
import en from "./locales/en.js";
import ar from "./locales/ar.js";

// registering
new Localize({ en, ar }, ["ar"]);
```
* Localize class takes two arguments:
  * First argument is an object `{ en, ar }` with all dictionaries imported from `src/locales`
  * Second argument is an array `["ar"]` with all languages codes that are `RTL`, this array can be omitted if you don't have `RTL` language

### Switching to a specific language
> Inside any component we can add these languages buttons below, it's kinda similar to router links
```html
<button tolang="ar">العربية</button> 
<button tolang="en">English</button>
```
* You will realize that we have `tolang` attribute with the value of the language code `en` or `ar`
* When clicking on these buttons your application should be switched to the clicked language

### Using `trans` method

> use it as follows inside script tag
```html
<script>
  console.log("desc".trans()); 
</script>
```

> use it as follows inside template tag, you must add it inside template literal placeholder `${}`
```html
<template>
  <p>${"desc".trans()}</p>
</template>
```

* `"desc".trans()` will print `The VanillaJS developer’s platform.` or `منصة مطوري فانيلا جافاسكربت` based on the current language