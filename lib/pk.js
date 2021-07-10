/**
 * @name Pk.js
 * @version 1.0.0
 * @copyright 2021
 * @author Eissa Saber
 * @license MIT
 */
((root, factory) => {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else if (typeof define === "function" && define.amd) define(factory);
  else {
    const ob = factory();
    for(let key in ob) { root[key] = ob[key]; }
  }
})(typeof self !== "undefined" ? self : this, () => {
  "use strict";
  /**
   * helpers for optimizing the code
   */
  const global = typeof self !== "undefined" ? self : this;
  const isDebugging = false;
  const debugStr = "Pk [warn]:";
  const quotes = str => "“" + str + "”";
  const devtoolHint = `${debugStr} ${quotes("devtool extension")} is not installed!
  \nto install it please download ${quotes("devtool.js")} from the official repo
  \n@ https://github.com/eissapk/pkjs/blob/develop/devtool.js
  \nand save it in the root of your project`;
  const isDev = () => !!["localhost", "127.0.0.1"].includes(location.hostname);
  const isObj = obj => !!(obj !== null && typeof obj === "object");
  const isFullArr = arr => !!(isObj(arr) && Array.isArray(arr) && arr.length);
  const isFullObj = obj => !!(isObj(obj) && Array.isArray(Object.keys(obj)) && Object.keys(obj).length);
  const isDef = val => !!(val !== undefined && val !== null);
  const isTrue = val => !!(val === true);
  const toNum = val => parseFloat(val.replace(/\D/g, ""));
  const delItem = (arr, item) => (arr.length && arr.indexOf(item) > -1 ? arr.splice(arr.indexOf(item), 1) : null);
  const hasProp = (obj, key) => !!obj.hasOwnProperty(key);
  const delProp = (obj, key) => (hasProp(obj, key) ? delete obj[key] : null);
  const isSame = (a, b) => !!(a === b);
  const addProp = (obj, key, val) => {
    Object.defineProperty(obj, key, {
      value: val,
      writable: true,
      configurable: true,
    });
  };
  const debugLib = (args, level = "log") => {
    level = level == "err" ? "error" : level;
    if (isDebugging) Array.isArray(args) ? console[level](...args) : console[level](args);
  }
  String.prototype.upper = function () {
    return this.toUpperCase();
  };
  String.prototype.lower = function () {
    return this.toLowerCase();
  };

  /* Capitalize a string */
  String.prototype.cap = function () {
    return this.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  /* For debuging purposes, works in dev mode */
  const debug = (args, level = "log") => {
    level = level == "err" ? "error" : level;
    if (isDev()) Array.isArray(args) ? console[level](...args) : console[level](args);
  }

  /**
   * A shorthand for selecting nodes from dom
   *
   * @example $(".header") // returns 1st element
   * @example $(".header", true) // returns array
   * @example $(elm).get("li") // returns 1st li inside elm
   * @example $(elm).get("li", true) // returns array of li inside elm
   * @param {String} target can be class, id, tag or Element
   * @param {Boolean} level (optional) boolean if omited it returns 1st element otherwise (true) returns array
   */
  const $ = (target, level, el = document) => {
    if (typeof target == "string") {
      const elms = [].slice.call(el.querySelectorAll(target));
      if (isFullArr(elms)) {
        if (level) return elms;
        else return elms[0];
      } else {
        if (level) {
          return [];
        } else {
          return null;
        }
      }
    } else {
      if (!Array.isArray(target) && !!target && target instanceof Element) target.get = (t, l) => $(t, l, target);
      return target;
    }
  };

  /**
   * A shorthand for addEventListener() - removeEventListener()
   */
  function on(event, cb, propagation = false) {
    return this.addEventListener(event, cb, propagation);
  }

  function off(event, cb, propagation = false) {
    return this.removeEventListener(event, cb, propagation);
  }
  Element.prototype.on = on;
  Element.prototype.off = off;
  Document.prototype.on = on;
  Document.prototype.off = off;
  global.on = on;
  global.off = off;

  /**
   * Replace string with values
   *
   * @example setTemp(`<div>{{name}}</div>`, {name:"pkjs"})
   */
  const setTemp = (temp, obj, delimit = ["{{", "}}"]) => {
    for (let key in obj) {
      temp = temp.replace(new RegExp(`\\${delimit[0][0]}\\${delimit[0][1]}${key}\\${delimit[1][0]}\\${delimit[1][1]}`, "g"), obj[key]);
    }
    return temp;
  }

  /**
   * Expand/Collapse element height
   *
   * @example elm.toggle(0.6)
   * @Hint CSS must have `height: 0; overflow: hidden;`
   */
  Element.prototype.toggle = function (time = 0.3) {
    this.style.transition = `height ${time}s ease-in-out`;
    if (this.clientHeight == 0) {
      this.style.height = "auto";
      const h = this.clientHeight + "px";
      this.style.height = "0";
      setTimeout(() => this.style.height = h, 0);
    } else this.style.height = "0";
  };

  /**
   * @example origin.method(url, { body: {name:"pkjs"},"Content-Type": "application/json" }).then(console.log).catch(console.error)
   */
  class Origin {
    constructor() {
      if (!(this instanceof Origin)) console.error(`${debugStr} can't invoke ${quotes("Origin constructor")} without new keyword`);
      this.xhr = new XMLHttpRequest();
    }

    setParams(data) {
      if (isFullObj(data)) {
        for (let key in data) {
          if (key !== "body") this.xhr.setRequestHeader(key, data[key]);
        }
        if (hasProp(data, "body") && isFullObj(data.body)) {
          return JSON.stringify(data.body);
        }
        return null;
      }
    }

    onload(resolve, reject) {
      return this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          if (this.xhr.status === 0 || (this.xhr.status >= 200 && this.xhr.status <= 299)) {
            try {
              resolve(JSON.parse(this.xhr.responseText));
            } catch (err) {
              resolve(this.xhr.responseText);
            }
          } else if (this.xhr.status >= 400 && this.xhr.status <= 599) {
            reject(`${debugStr} couldn't reach the server`);
          }
        }
      };
    }

    req(method, url, data = {}) {
      return new Promise((resolve, reject) => {
        this.xhr.open(method, url, true);
        const form = this.setParams(data);
        this.onload(resolve, reject);
        this.xhr.onerror = () => reject(`${debugStr} network error`);
        form !== null ? this.xhr.send(form) : this.xhr.send();
      });
    }

    get = (url, data = {}) => this.req("GET", url, data);
    post = (url, data = {}) => this.req("POST", url, data);
    delete = (url, data = {}) => this.req("DELETE", url, data);
    put = (url, data = {}) => this.req("PUT", url, data);
    patch = (url, data = {}) => this.req("PATCH", url, data);
  }

  /**
   * @example new Pk({
      mode: "history",
      root: "/",
      el: "#app",
      prefix: "app",
      routes: [{ path: "/", comp: Home }],
    });
   */
  class Pk {
    routes = [];
    views = [];
    pushStateAPI = !!global.history.pushState;

    constructor({
      mode,
      root,
      el,
      prefix,
      err,
      routes
    }) {
      if (!(this instanceof Pk)) console.error(`${debugStr} can't invoke ${quotes("Pk constructor")} without new keyword`);
      this.setMode(mode);
      this.setRoot(root);
      this.setPrefix(prefix);
      this.setErr(err);

      if (!this.hasRootElm(el)) {
        console.error(`${debugStr} couldn't find a value for ${quotes("el property")} @ router instance. \nmake sure it has the right selector e.g. el:"#app" \nand ${quotes("Root Element")} exists in dom e.g. <div id="app"></div>`);
      } else if (!this.hasRoutes(routes)) {
        console.error(`${debugStr} couldn't find ${quotes("routes property")} @ router instance or it's empty. \nmake sure that ${quotes("routes property")} has components \ne.g. routes = [{ path: "/", comp: Home }]`);
      } else {
        this.buildStyles();
        this.popStateEvent = new PopStateEvent("popstate");
        this.listen();
      }
    }

    hasRootElm(el) {
      const appMarkup = document.querySelector(el);

      if (!!el && !!appMarkup) {
        this.rootCompName = el.replace(/\#|\./, "").cap();
        this.appMarkup = appMarkup;
        return true;
      }

      return false;
    }

    hasRoutes(routes) {
      if (!!routes && isFullArr(routes)) {
        routes.forEach(route => {
          this.views.push(route.comp);
          this.addRoute(route.path, route.comp);
        });
        return true;
      }
      return false;
    }

    setPrefix(prefix) {
      if (!!prefix) {
        this.prefix = prefix;
      } else {
        this.prefix = null;
        console.warn(`${debugStr} couldn't find ${quotes("prefix property")} @ router instance. \nfalling back to default component tag e.g. <ComponentName/>`);
      }
    }

    setRoot(root) {
      if (!!root) {
        this.root = root;
      } else {
        this.root = "/";
        console.warn(`${debugStr} couldn't find ${quotes("root property")} @ router instance. \nfalling back to default value: ${quotes("/")}`);
      }
    }

    setErr(err) {
      if (!!err) {
        this.err = this.resolve(err);
      } else {
        this.err = null;
        console.warn(`${debugStr} couldn't find ${quotes("err property")} @ router instance. \nfalling back to default 404 page`);
      }
    }

    setMode(mode) {
      if (!!mode) {
        if (this.pushStateAPI) this.mode = mode;
        else {
          this.mode = "hash"; // force hash
          console.warn(`${debugStr} mode is set to ${quotes("hash")} \n${quotes("history")} is not supported!`);
        }
      } else {
        this.mode = this.pushStateAPI ? "history" : "hash"; // default
        console.warn(`${debugStr} couldn't find ${quotes("mode property")} @ router instance. \nfalling back to available default mode: ${quotes(this.mode)}`);
      }
    }

    addRoute(path, comp) {
      this.routes.push({
        path: this.resolve(path),
        cb: () => this.inject(comp),
      });
    }

    delRoute(path) {
      this.routes.forEach(item => {
        if (item.path === this.resolve(path)) delItem(this.routes, item);
      });
    }

    flush() {
      this.routes = [];
    }

    resolve(path) {
      const root = this.clear(this.root);
      path = this.clear(path);
      path = (this.root !== "/") ? ("/" + root + "/" + path) : ("/" + path);
      path = path !== "/" ? path.replace(/\/$/g, "") : path;
      return path;
    }

    clear(str) {
      const regex = new RegExp(`^[\#\/]{1,}|\/$`, "g");
      str = str.lower().trim().replace(regex, "");
      return str;
    }

    listen() {
      global.on("popstate", () => {
        debugLib(["Dispatched Popstate", this.routes]);
        let current = this.getRoute();
        const root = "/" + this.clear(this.root);
        
        // todo enhance this part 
        current = (this.mode === "hash" && this.root !== "/") ? (current = root + current).replace(/\/$/, "") : current;

        const route = this.routes.find(route => {
          if (route.path === current) {
            return route;
          } else if (current === "" || current === "/" || current.includes("index.html")) {
            return route.path === root;
          }
        });

        if (isDef(route)) {
          route.cb(); // invokes inject(view)
          this.active(route);
        } else {
          if (isDef(this.err)) {
            const err = this.routes.find(route => route.path === this.err);
            if (isDef(err)) {
              err.cb();
            } else {
              console.error(`${debugStr} unmached path of ${quotes("err property")} @ router instance.`);
            }
          } else {
            this.appMarkup.innerHTML = "Not Found!";
          }
        }

        debugLib({
          current,
          route
        });

      });

      dispatchEvent(this.popStateEvent);
    }

    getRoute() {
      let fragment = "";
      if (this.mode === "history") {
        fragment = this.clear(decodeURI(location.pathname));
      } else if (this.mode === "hash") {
        fragment = this.clear(decodeURI(location.hash));
      }
      return "/" + fragment;
    }

    navigate(path) {
      path = this.resolve(path);
      if (this.mode === "history") {
        global.history.pushState({}, "", path);
        debugLib("Pushed to history");
        dispatchEvent(this.popStateEvent);
      } else if (this.mode === "hash") {
        // todo enhance this part 
        if (this.root === "/") {
          location.href = `${location.href.replace(/\#.*/g, "")}#${path}`;
        } else {
          let root = this.clear(this.root);
          root = root.replace(/\//g, `\\/`);
          const rootRegex = new RegExp(`\\/${root}`, "g");
          let _path = path.replace(rootRegex, "");
          _path = "/" + _path.replace(/^\//g, "");
          location.href = `${location.href.replace(/\#.*/g, "")}#${_path}`;
        }
      }

    }

    to() {
      const links = $("[to]", true);
      if (isFullArr(links)) {
        links.forEach(link => {
          // disable href in anchor
          if (link.nodeName === "A") link.setAttribute("href", "javascript:void(0)");
          // disable icons in links
          [...link.children].forEach(icon => (icon.style.pointerEvents = "none"));

          // onclick
          link.on("click", e => {
            const path = e.target.getAttribute("to");
            const _path_ = this.resolve(path);
            const current = this.getRoute();
            if (isSame(_path_, current)) return; // stop routing | preserve history from duplicated routes
            this.navigate(path); // navigate to clicked route
          });
        });
      }
    }

    active(route) {
      const links = $("[to]", true);
      if (isFullArr(links)) {
        links.forEach(link => {
          const path = this.resolve(link.getAttribute("to"));
          if (path === route.path) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    }

    buildTree(entry) {
      const compsArr = [];
      const recursive = comp => {
        if (hasProp(comp, "components") && isFullObj(comp.components)) {
          for (let key in comp.components) {
            const obj = {};
            addProp(obj, "parent", comp.name);
            addProp(obj, "child", {});
            addProp(obj.child, "name", key);
            const instance = new comp.components[key]();
            addProp(obj.child, "data", instance.data());
            compsArr.push(obj);

            if (hasProp(obj, "child") && hasProp(obj.child, "data")) {
              const nextEntry = obj.child.data;
              recursive(nextEntry);
            }
          }
        }
      };
      recursive(entry);
      debugLib(["compsArr", compsArr]);

      return compsArr;
    }

    inject(View) {
      if (!View || typeof View != "function") {
        console.error(`${debugStr} ${quotes("View argument")} is missing or it's not a constructor function! @ Pk.inject(View)`);
      } else {
        const view = new View();
        const entry = view.data();
        const compsArr = this.buildTree(entry);

        const init = instance => {
          // labeling components
          const label = instance ? instance.label(entry, compsArr) : {
            entry,
            compsArr
          };
          // final component (View)
          const viewObj = this.merge(label);
          // html
          this.appMarkup.innerHTML = viewObj.template;
          // js
          setTimeout(() => {
            this.to(); // enables to attribute e.g. <a to="/">Home</a>
            for (let key in viewObj.script) viewObj.script[key]();
          }, 0);
        }

        if (isDev()) {
          import("/devtool.js").then(module => {
            const Devtool = module.default;
            const instance = new Devtool(this.appMarkup, this.rootCompName);
            init(instance);
          }).catch(() => console.warn(devtoolHint));
        } else {
          init();
        }

      }
    }

    buildStyles() {
      const styles = [];
      this.views.forEach(View => {
        const view = new View();
        const entry = view.data();
        const compsArr = this.buildTree(entry);
        const entryStyle = entry.style || "";
        styles.push(entryStyle); // push view style
        compsArr.forEach(comp => {
          if (hasProp(comp.child, "data")) {
            const compStyle = comp.child.data.style || "";
            styles.push(compStyle.trim()); // push children styles
          }
        });
      });
      const cleanStyles = [...new Set(styles)];
      document.head.insertAdjacentHTML("beforeend", `<style>${cleanStyles.join("")}</style>`); // override global styling
    }

    merge({
      entry,
      compsArr
    }) {
      // parent (view) 
      let template = entry.template || "";
      const script = {};
      !!(entry.render) ? (script[0] = entry.render) : null;

      // children 
      if (isFullArr(compsArr)) {
        compsArr.forEach((comp, index) => {
          const data = comp.child.data;
          const html = data.template || "";
          const js = data.render || null;
          const name = this.prefix !== null ? this.prefix + "-" + data.name : data.name;
          const regex = new RegExp(`<(${name}\\s{0,})\\/>`, "gi"); // detect components e.g. <App-AddTodo /> or <AddTodo />

          template = template.replace(regex, html);
          if (js !== null) script[index + 1] = js;
        });
      }

      return {
        template,
        script,
      };
    }

  }

  /**
   * @example const event = new Service("eventName");
   * window.on(event.event, () => console.log("fired"));
   * event.trigger()
   */
  class Service {
    constructor(event) {
      if (!(this instanceof Service)) console.error(`${debugStr} can't invoke ${quotes("Service constructor")} without new keyword`);
      this.event = event;
      this.init();
      return this;
    }

    init() {
      this.serviceEvent = new CustomEvent(this.event, {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: false,
      });
    }

    trigger() {
      if (isDef(this.serviceEvent)) dispatchEvent(this.serviceEvent);
    }
  }

  return {
    Pk,
    Service,
    Origin,
    $,
    debug,
    setTemp,
  };

});