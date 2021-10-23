> Instead of using javascript native long methods you can use these methods below

```html
<!-- CDN -->
<script src="https://unpkg.com/olum-helpers@latest/dist/olum-helpers.min.js"></script>
```
```javascript
// ES6 Module 
import { $, debug, setTemp, Service, Origin, Localize } from "olum-helpers";
```

### Shorthand
* Replace `addEventListener` with `on`
* Replace `removeEventListener` with `off`
* Replace `toUpperCase` with `upper`
* Replace `toLowerCase` with `lower`

### New Methods
#### cap
* Use this new method `cap` with any string it capitalizes a string 
```javascript
"hello world".cap(); // prints Hello World
```
#### debug
> Use `debug` method which works in dev mode only so you don't need to comment your logs in production

```javascript
import { debug } from "olum-helpers";

// debug(arguments, level);
debug(1, "log") // prints 1 as console.log
debug(1, "trace") // prints 1 as console.trace 
debug(1, "warn") // prints 1 as console.warn 
debug(1, "error") // prints 1 as console.error, you can type err or error 
```
* If level is omitted then it will fall back to log level
* A shorthand for debug as follows `fetch().then(debug)`, this will print response as console.log

#### $
> Use `$` to select your nodes instead of `document.querySelector` and other stuff

```javascript
import { $ } from "olum-helpers";

$(".header") // returns 1st element
$(".header", true) // returns array, because of true, if there is no element then it will return empty array as es6 do with querySelectorAll
$(elm).get("li") // returns 1st li tag inside elm
$(elm).get("li", true) // returns array of li inside elm
```

#### setTemp
> Use `setTemp` to inject stuff in your string, default delimiters are `{{ }}`

```javascript
import { setTemp } from "olum-helpers";

// setTemp(<String>, <Object>, <Array>);
setTemp(`<div>{{name}}</div>`, {name:"olumjs"}, ["[[","]]"]);
```

#### toggle
> Use `toggle` to toggle the element hight smoothly

```javascript
const btn = $(".btn");
const elm = $("section");
btn.on("click", () => elm.toggle(0.6));
```
* The default transition timing is `0.3s` but you can pass your own as we did above `0.6`

#### Origin
> Use `Origin` for calling `APIs` just like `fetch` and `axios`

```javascript
import { Origin } from "olum-helpers";

const origin = new Origin();

origin.get(url, { body: {name:"olumjs"}, headers: {"Content-Type": "application/json"} })
  .then(console.log)
  .catch(console.error);
```
* Pass your request data in `body` object and headers params in the same level of body object, you don't have to write `.then` twice as in `fetch`
* Supported methods are `get`, `post`, `delete`, `put`, `patch`

### Hint
> I will be adding new helpers in the future, of course you don't have to stick to these helpers you can make/use your own helpers.