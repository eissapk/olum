/**
 * @name Olum.js
 * @version 0.1.3
 * @copyright 2021
 * @author Eissa Saber
 * @license MIT
 */
((root, factory) => {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else if (typeof define === "function" && define.amd) define(factory);
  else {
    const obj = factory();
    root.Olum = obj.Olum;
    root.$ = obj.$;
    root.debug = obj.debug;
  }
})(typeof self !== "undefined" ? self : this, () => {
  "use strict";
  /**
   * helpers for optimizing the code
   */
  const global = typeof self !== "undefined" ? self : this;
  const isDebugging = false;
  const debugStr = "Olum [warn]:";
  const quotes = str => "“" + str + "”";
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
   * @example new Olum({
      mode: "history",
      root: "/",
      el: "#app",
      prefix: "app",
      routes: [{ path: "/", comp: Home }],
    });
   */
  class Olum {
    isFrozen = false;
    routes = [];
    pushStateAPI = !!global.history.pushState;

    constructor({
      mode,
      root,
      el,
      prefix,
      err,
      routes
    }) {
      if (!(this instanceof Olum)) console.error(`${debugStr} can't invoke ${quotes("Olum constructor")} without new keyword`);
      this.setMode(mode);
      this.setRoot(root);
      this.setPrefix(prefix);
      this.setErr(err);

      if (!this.hasRootElm(el)) {
        console.error(`${debugStr} couldn't find a value for ${quotes("el property")} @ router instance. \nmake sure it has the right selector e.g. el:"#app" \nand ${quotes("Root Element")} exists in dom e.g. <div id="app"></div>`);
      } else if (!this.hasRoutes(routes)) {
        console.error(`${debugStr} couldn't find ${quotes("routes property")} @ router instance or it's empty. \nmake sure that ${quotes("routes property")} has components \ne.g. routes = [{ path: "/", comp: Home }]`);
      } else {
        this.popStateEvent = new PopStateEvent("popstate");
        this.viewLoaded = new CustomEvent("viewLoaded", { detail: {}, bubbles: true, cancelable: true, composed: false });
        this.listen();
      }
    }

    hasRootElm(el) {
      const appMarkup = document.querySelector(el);
      if (!!el && !!appMarkup) {
        this.rootCompName = el.replace(/\#|\./, "").cap();
        this.appMarkup = appMarkup;
        global.olum = { rootCompName: this.rootCompName, el }; // for devtool
        return true;
      }

      return false;
    }

    hasRoutes(routes) {
      if (!!routes && isFullArr(routes)) {
        routes.forEach(route => this.addRoute(route.path, route.comp));
        return true;
      }
      return false;
    }

    setPrefix(prefix) {
      if (!!prefix) {
        this.prefix = prefix;
      } else {
        this.prefix = null;
        debug(`${debugStr} couldn't find ${quotes("prefix property")} @ router instance. \nfalling back to default component tag e.g. <ComponentName/>`, "warn");
      }
    }

    setRoot(root) {
      if (!!root) {
        this.root = root;
      } else {
        this.root = "/";
        debug(`${debugStr} couldn't find ${quotes("root property")} @ router instance. \nfalling back to default value: ${quotes("/")}`, "warn");
      }
    }

    setErr(err) {
      if (!!err) {
        this.err = this.resolve(err);
      } else {
        this.err = null;
        debug(`${debugStr} couldn't find ${quotes("err property")} @ router instance. \nfalling back to default 404 page`, "warn");
      }
    }

    setMode(mode) {
      if (!!mode) {
        if (this.pushStateAPI) this.mode = mode;
        else {
          this.mode = "hash"; // force hash
          debug(`${debugStr} mode is set to ${quotes("hash")} \n${quotes("history")} is not supported!`, "warn");
        }
      } else {
        this.mode = this.pushStateAPI ? "history" : "hash"; // default
        debug(`${debugStr} couldn't find ${quotes("mode property")} @ router instance. \nfalling back to available default mode: ${quotes(this.mode)}`, "warn");
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

    freeze() {
      this.isFrozen = true;
    }
    
    unfreeze(){
      this.isFrozen = false;
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
          if (!this.isFrozen) route.cb(); // invokes inject(view)
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
      this.unfreeze();
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

    active(path_b) {
      const links = $("[to]", true);
      if (isFullArr(links)) {
        links.forEach(link => {
          const path_a = this.resolve(link.getAttribute("to"));
          if (path_a === path_b) {
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
    
    label(root, arr) {
      const compAttrRegex = /(olum-component=[\"\']([^\"|\']*)[\"\'])|(olum-component)/gi;
      const openingSelfClosingTagRegex = /<[a-z]+(>|.*?[^?]>)/gi;
      const greaterCharRegex = /\>/gi;
      const compsArr = [...arr];
      const entry = root;
  
      // children
      compsArr.forEach(comp => {
        const name = comp.child.data.name || "undefined";
        if (comp.child && comp.child.data && hasProp(comp.child.data, "template")) {
          const data = comp.child.data;
          // clean
          data.template = data.template.replace(compAttrRegex, "");
          // labeling
          const compWrapper = data.template.match(openingSelfClosingTagRegex);
          if (isFullArr(compWrapper)) {
            data.template = data.template.replace(compWrapper[0], compWrapper[0].replace(greaterCharRegex, ` olum-component="${name}">`));
          }
        }
      });
  
      // parent (view)
      if (entry.template) {
        const name = entry.name || "undefined";
        // clean
        entry.template = entry.template.replace(compAttrRegex, "");
        // labeling
        const compWrapper = entry.template.match(openingSelfClosingTagRegex);
        if (isFullArr(compWrapper)) {
          entry.template = entry.template.replace(
            compWrapper[0],
            compWrapper[0].replace(greaterCharRegex, ` olum-component="${name}" router-view="${name}">`)
          );
        }
      }
  
      // root (placeholder)
      this.appMarkup.setAttribute("olum-component", this.rootCompName);
  
      return {
        entry,
        compsArr,
      };
    }

    inject(View) {
      if (!View || typeof View != "function") {
        console.error(`${debugStr} ${quotes("View argument")} is missing or it's not a constructor function! @ Olum.inject(View)`);
      } else {
        const view = new View();
        const entry = view.data();
        const compsArr = this.buildTree(entry);

        // labeling components
        const label = isDev() ? this.label(entry, compsArr) : {
          entry,
          compsArr
        };
        // final component (View)
        const viewObj = this.merge(label);
        // css
        this.buildStyles(viewObj.style);
        // html
        this.appMarkup.innerHTML = viewObj.template;
        // js
        setTimeout(() => {
          this.active(this.getRoute()); // add active class to current route link tag
          this.to(); // enables to attribute e.g. <a to="/">Home</a>
          const scriptKeysArr = Object.keys(viewObj.script);
          const recursive = (num = 0) => {
            viewObj.script[scriptKeysArr[num]]();
            if (num === scriptKeysArr.length - 1) {
              if (isDef(this.viewLoaded)) {
                dispatchEvent(this.viewLoaded);
                debugLib("viewLoaded");
              }
            }
            if (num + 1 <= scriptKeysArr.length - 1) recursive(num + 1);
          };
          recursive();
        }, 0);

      }
    }

    buildStyles(css) {
      const id = "olum_style_tag";
      let styleTag = document.getElementById(id);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = id;
        document.head.append(styleTag);
      }
      styleTag.innerHTML = css;
    }

    merge({
      entry,
      compsArr
    }) {
      // parent (view) 
      let template = entry.template || "";
      let style = entry.style || "";
      const script = {};
      !!(entry.render) ? (script[0] = entry.render) : null;

      // children 
      if (isFullArr(compsArr)) {
        compsArr.forEach((comp, index) => {
          const data = comp.child.data;
          const html = data.template || "";
          const css = data.style || "";
          const js = data.render || null;
          const name = this.prefix !== null ? this.prefix + "-" + data.name : data.name;
          const regex = new RegExp(`<(${name}\\s{0,})\\/>`, "gi"); // detect components e.g. <App-AddTodo /> or <AddTodo />

          template = template.replace(regex, html);
          style += css;
          if (js !== null) script[index + 1] = js;
        });
      }

      return {
        template,
        style,
        script,
      };
    }

  }

  return {
    Olum,
    $,
    debug
  };

});