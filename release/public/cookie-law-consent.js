!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=15)}([function(e,t,n){"use strict";var o,i="object"==typeof Reflect?Reflect:null,r=i&&"function"==typeof i.apply?i.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};o=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var s=Number.isNaN||function(e){return e!=e};function a(){a.init.call(this)}e.exports=a,a.EventEmitter=a,a.prototype._events=void 0,a.prototype._eventsCount=0,a.prototype._maxListeners=void 0;var c=10;function l(e){return void 0===e._maxListeners?a.defaultMaxListeners:e._maxListeners}function u(e,t,n,o){var i,r,s,a;if("function"!=typeof n)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof n);if(void 0===(r=e._events)?(r=e._events=Object.create(null),e._eventsCount=0):(void 0!==r.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),r=e._events),s=r[t]),void 0===s)s=r[t]=n,++e._eventsCount;else if("function"==typeof s?s=r[t]=o?[n,s]:[s,n]:o?s.unshift(n):s.push(n),(i=l(e))>0&&s.length>i&&!s.warned){s.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=s.length,a=c,console&&console.warn&&console.warn(a)}return e}function f(){for(var e=[],t=0;t<arguments.length;t++)e.push(arguments[t]);this.fired||(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,r(this.listener,this.target,e))}function h(e,t,n){var o={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=f.bind(o);return i.listener=n,o.wrapFn=i,i}function d(e,t,n){var o=e._events;if(void 0===o)return[];var i=o[t];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(i):y(i,i.length)}function p(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function y(e,t){for(var n=new Array(t),o=0;o<t;++o)n[o]=e[o];return n}Object.defineProperty(a,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");c=e}}),a.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},a.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},a.prototype.getMaxListeners=function(){return l(this)},a.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var o="error"===e,i=this._events;if(void 0!==i)o=o&&void 0===i.error;else if(!o)return!1;if(o){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var a=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw a.context=s,a}var c=i[e];if(void 0===c)return!1;if("function"==typeof c)r(c,this,t);else{var l=c.length,u=y(c,l);for(n=0;n<l;++n)r(u[n],this,t)}return!0},a.prototype.addListener=function(e,t){return u(this,e,t,!1)},a.prototype.on=a.prototype.addListener,a.prototype.prependListener=function(e,t){return u(this,e,t,!0)},a.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.on(e,h(this,e,t)),this},a.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.prependListener(e,h(this,e,t)),this},a.prototype.removeListener=function(e,t){var n,o,i,r,s;if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);if(void 0===(o=this._events))return this;if(void 0===(n=o[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete o[e],o.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,r=n.length-1;r>=0;r--)if(n[r]===t||n[r].listener===t){s=n[r].listener,i=r;break}if(i<0)return this;0===i?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,i),1===n.length&&(o[e]=n[0]),void 0!==o.removeListener&&this.emit("removeListener",e,s||t)}return this},a.prototype.off=a.prototype.removeListener,a.prototype.removeAllListeners=function(e){var t,n,o;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var i,r=Object.keys(n);for(o=0;o<r.length;++o)"removeListener"!==(i=r[o])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(o=t.length-1;o>=0;o--)this.removeListener(e,t[o]);return this},a.prototype.listeners=function(e){return d(this,e,!0)},a.prototype.rawListeners=function(e){return d(this,e,!1)},a.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):p.call(e,t)},a.prototype.listenerCount=p,a.prototype.eventNames=function(){return this._eventsCount>0?o(this._events):[]}},function(e){e.exports=JSON.parse('{"position":1,"mandatory":false,"id":"non-necessary","title":"Non Necessary","description":"Any cookies that may not be particularly necessary for the website to function is used specifically to collect user personal data via analytics, ads, other embedded contents are termed as non-necessary cookies. It is mandatory to procure user consent prior to running these cookies on your website.","texts":{"enable":"Enable cookies","disable":"Disable cookies","enabled":"Enabled","disabled":"Disabled","alwaysEnabled":"Always enabled"},"enabled":false,"services":[]}')},function(e){e.exports=JSON.parse('{"categories":[],"texts":{"title":"Privacy Overview","description":"This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.","close":"Close","save":"Save & Accept"}}')},function(e){e.exports=JSON.parse('{"position":"bottom-right","texts":{"title":"Cookies","message":"This site uses cookies to help improve your user experience and gives you control over what you want to activate.","personalize":"Personalize","acceptAll":"Ok, accept all"}}')},function(e){e.exports=JSON.parse('{"banner_position":"bottom-right","cookieName":"cookie-law-consent","hash":"cookie-law-settings","categories":[],"texts":{"banner":{},"modal":{},"category":{}}}')},,function(e,t,n){},,,,,,,,,function(e,t,n){"use strict";n.r(t);n(6);function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e){return e&&"object"===r(e)&&!Array.isArray(e)}function a(e){for(var t=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e),n=arguments.length,r=new Array(n>1?n-1:0),c=1;c<n;c++)r[c-1]=arguments[c];return r.forEach((function(n){s(e)&&s(n)&&Object.keys(n).forEach((function(o){s(n[o])&&o in e?t[o]=a(e[o],n[o]):Object.assign(t,i({},o,n[o]))}))})),t}function c(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=" ".concat(document.cookie).split(" ".concat(e,"="));return n.length<2?t:n.pop().split(";").shift()}function l(e,t,n,o,i,r){var s=new Date;s.setHours(s.getHours()+24*("number"!=typeof n?365:n)),document.cookie="".concat(e,"=").concat(t,";expires=").concat(s.toUTCString(),";path=").concat(i||"/").concat(o?";domain=".concat(o):"").concat(r?";secure":"")}var u=n(0),f=n(1);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var v=".cookie-law-category__tab",g=".cookie-law-category__title",m=".cookie-law-category__switch",w=".cookie-law-category__checkbox",k=".cookie-law-category__label",_=".cookie-law-category__status",O=".cookie-law-category__content",C=".cookie-law-category__desc",j=function(e){function t(e,n){var o,i,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),i=this,(o=!(r=p(t).call(this))||"object"!==h(r)&&"function"!=typeof r?y(i):r).config=a(f,n,{container:e}),o.state=new Proxy({collapsed:!0,enabled:o.config.enabled},{set:o.stateChange.bind(y(o))});var s=o.init();return o.refs={el:s,tab:s.querySelector(v),title:s.querySelector(g),switch:s.querySelector(m),checkbox:s.querySelector(w),label:s.querySelector(k),status:s.querySelector(_),content:s.querySelector(O),desc:s.querySelector(C)},o.onChange=o.onChange.bind(y(o)),o.onToggle=o.onToggle.bind(y(o)),o.stopPropagation=o.stopPropagation.bind(y(o)),o.refs.tab.addEventListener("click",o.onToggle),o.refs.checkbox&&o.refs.checkbox.addEventListener("change",o.onChange),o.refs.switch&&o.refs.switch.addEventListener("click",o.stopPropagation),o}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(t,e),n=t,(o=[{key:"destroy",value:function(){this.refs.tab.removeEventListener("click",this.onToggle),this.refs.checkbox&&this.refs.checkbox.removeEventListener("change",this.onChange),this.refs.switch&&this.refs.switch.removeEventListener("click",this.stopPropagation)}},{key:"stateChange",value:function(e,t,n){switch(e[t]=n,t){case"collapsed":this.toggleExpanded();break;case"enabled":this.toggleStatus(),this.emit("change",{enabled:n,id:this.config.id})}return!0}},{key:"onToggle",value:function(e){e.stopPropagation(),this.state.collapsed=!this.state.collapsed}},{key:"onChange",value:function(e){e.stopPropagation(),this.state.enabled=e.target.checked}},{key:"stopPropagation",value:function(e){e.stopPropagation()}},{key:"getId",value:function(){return this.config.id}},{key:"setEnabled",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.config.mandatory||(this.state.enabled=e)}},{key:"init",value:function(){var e=document.createElement("li");return e.classList.add("cookie-law-category"),e.insertAdjacentHTML("beforeend",'<div class="cookie-law-category__tab">\n\t\t\t\t<button class="cookie-law-category__title">\n\t\t\t\t\t<span>'.concat(this.config.title,"</span>\n\t\t\t\t</button>\n\t\t\t\t").concat(this.config.mandatory?'<span class="cookie-law-category__caption">'.concat(this.config.texts.alwaysEnabled,"</span>"):'<div class="cookie-law-category__switch">\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\tclass="cookie-law-category__checkbox"\n\t\t\t\t\t\t\tid="cookie-law-category-checkbox-'.concat(this.config.id,'"\n\t\t\t\t\t\t\t').concat(this.state.enabled?"checked":"",'\n\t\t\t\t\t\t>\n\t\t\t\t\t\t<label class="cookie-law-category__label" for="cookie-law-category-checkbox-').concat(this.config.id,'">\n\t\t\t\t\t\t\t').concat(this.config.texts[this.state.enabled?"disable":"enable"],'\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<span class="cookie-law-category__status">\n\t\t\t\t\t\t\t').concat(this.config.texts[this.state.enabled?"enabled":"disabled"],"\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>"),'\n\t\t\t</div>\n\t\t\t<div class="cookie-law-category__content" aria-hidden="').concat(this.state.collapsed,'">\n\t\t\t\t<div class="cookie-law-category__desc">').concat(this.config.description,"</div>\n\t\t\t</div>")),this.config.container.insertAdjacentElement("beforeend",e),e}},{key:"toggleExpanded",value:function(){this.refs.content.setAttribute("aria-hidden",this.state.collapsed),this.refs.el.classList[this.state.collapsed?"remove":"add"]("is-expanded")}},{key:"toggleStatus",value:function(){this.refs.label&&(this.refs.label.textContent=this.config.texts[this.state.enabled?"disable":"enable"]),this.refs.status&&(this.refs.status.textContent=this.config.texts[this.state.enabled?"enabled":"disabled"]),this.refs.checkbox&&this.state.enabled!==this.refs.checkbox.checked&&(this.refs.checkbox.checked=this.state.enabled)}}])&&d(n.prototype,o),i&&d(n,i),t}(u.EventEmitter),E=n(2);function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function x(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function P(e){return(P=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function L(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var T=function(e){function t(e,n){var o,i,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),i=this,(o=!(r=P(t).call(this))||"object"!==S(r)&&"function"!=typeof r?L(i):r).config=a(E,n,{container:e}),o.refs={el:null,list:null,categories:[],close:null,save:null},o.state=new Proxy({hidden:!0},{set:o.stateChange.bind(L(o))}),o.onSave=o.onSave.bind(L(o)),o.onClose=o.onClose.bind(L(o)),o.onCategoryChange=o.onCategoryChange.bind(L(o)),o.onLostFocus=o.onLostFocus.bind(L(o)),o.init(),o}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(t,e),n=t,(o=[{key:"bindEvents",value:function(){var e=this;document.addEventListener("focusin",this.onLostFocus),this.refs.save.addEventListener("click",this.onSave),this.refs.close.addEventListener("click",this.onClose),this.refs.categories.forEach((function(t){return t.on("change",e.onCategoryChange)}))}},{key:"unbindEvents",value:function(){var e=this;document.removeEventListener("focusin",this.onLostFocus),this.refs.save.removeEventListener("click",this.onSave),this.refs.close.removeEventListener("click",this.onClose),this.refs.categories.forEach((function(t){return t.off("change",e.onCategoryChange)}))}},{key:"destroy",value:function(){this.state.hidden||this.close(),this.refs.categories.forEach((function(e){return e.destroy()}))}},{key:"stateChange",value:function(e,t,n){switch(e[t]=n,t){case"hidden":this.toggle()}return!0}},{key:"onCategoryChange",value:function(e){this.emit("categoryChange",e)}},{key:"onSave",value:function(e){e.stopPropagation(),this.save()}},{key:"onClose",value:function(e){e.stopPropagation(),this.close()}},{key:"onLostFocus",value:function(e){this.refs.el.contains(e.target)||this.refs.close.focus()}},{key:"open",value:function(){!1!==this.state.hidden&&(this.state.hidden=!1,this.refs.close.focus(),this.bindEvents())}},{key:"save",value:function(){this.emit("save"),this.close()}},{key:"close",value:function(){!0!==this.state.hidden&&(this.state.hidden=!0,this.unbindEvents(),this.emit("closed"))}},{key:"setCategoryEnabled",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.refs.categories.find((function(t){return t.getId()===e.id})).setEnabled(t)}},{key:"init",value:function(){var e=this;this.refs.el=document.createElement("section"),this.refs.el.classList.add("cookie-law-modal"),this.refs.el.setAttribute("role","dialog"),this.refs.el.setAttribute("aria-hidden","true"),this.refs.el.setAttribute("tabindex","-1"),this.refs.el.insertAdjacentHTML("beforeend",'<div class="cookie-law-modal__dialog" role="document" aria-labelledby="exampleModalCenterTitle">\n\t\t\t\t<div class="cookie-law-modal__content">\n\t\t\t\t\t<button class="cookie-law-modal__close">\n\t\t\t\t\t\t<svg viewBox="0 0 24 24">\n\t\t\t\t\t\t\t<title>'.concat(this.config.texts.close,'</title>\n\t\t\t\t\t\t\t<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>\n\t\t\t\t\t\t\t<path d="M0 0h24v24H0z" fill="none"/>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class="cookie-law-modal__body">\n\t\t\t\t\t\t<header class="cookie-law-modal__head">\n\t\t\t\t\t\t\t<h4 class="cookie-law-modal__title">').concat(this.config.texts.title,'</h4>\n\t\t\t\t\t\t\t<p class="cookie-law-modal__desc">').concat(this.config.texts.description,'</p>\n\t\t\t\t\t\t</header>\n\t\t\t\t\t\t<ul class="cookie-law-modal__categories"></ul>\n\t\t\t\t\t\t<footer class="cookie-law-modal__footer">\n\t\t\t\t\t\t\t<button class="cookie-law-modal__save">').concat(this.config.texts.save,"</button>\n\t\t\t\t\t\t</footer>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>")),this.refs.list=this.refs.el.querySelector(".cookie-law-modal__categories"),this.refs.close=this.refs.el.querySelector(".cookie-law-modal__close"),this.refs.save=this.refs.el.querySelector(".cookie-law-modal__save"),this.refs.categories=this.config.categories.map((function(t){return new j(e.refs.list,t)})),this.config.container.insertAdjacentElement("beforeend",this.refs.el)}},{key:"toggle",value:function(){this.refs.el.setAttribute("aria-hidden",this.state.hidden)}}])&&x(n.prototype,o),i&&x(n,i),t}(u.EventEmitter),M=n(3);function z(e){return(z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function q(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function N(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function R(e,t){return(R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var F=".cookie-law-banner__accept",H=".cookie-law-banner__personalize",I=function(e){function t(e,n){var o,i,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),i=this,(o=!(r=D(t).call(this))||"object"!==z(r)&&"function"!=typeof r?N(i):r).config=a(M,n,{container:e}),o.state=new Proxy({hidden:!0},{set:o.stateChange.bind(N(o))});var s=o.init();return o.refs={el:s,personalize:s.querySelector(H),accept:s.querySelector(F)},o.onPersonalizeClick=o.onPersonalizeClick.bind(N(o)),o.onAcceptClick=o.onAcceptClick.bind(N(o)),o.bindEvents(),o}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&R(e,t)}(t,e),n=t,(o=[{key:"bindEvents",value:function(){this.refs.personalize.addEventListener("click",this.onPersonalizeClick),this.refs.accept.addEventListener("click",this.onAcceptClick)}},{key:"destroy",value:function(){this.refs.personalize.removeEventListener("click",this.onPersonalizeClick),this.refs.accept.removeEventListener("click",this.onAcceptClick)}},{key:"stateChange",value:function(e,t,n){switch(e[t]=n,t){case"hidden":this.toggle()}return!0}},{key:"onPersonalizeClick",value:function(e){e.stopPropagation(),this.emit("personalize")}},{key:"onAcceptClick",value:function(e){e.stopPropagation(),this.emit("acceptAll"),this.state.hidden=!0}},{key:"show",value:function(){this.state.hidden=!1}},{key:"hide",value:function(){this.state.hidden=!0}},{key:"init",value:function(){var e=document.createElement("div");return e.classList.add("cookie-law-banner"),e.classList.add("cookie-law-banner--".concat(this.config.position)),e.setAttribute("role","dialog"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-hidden","true"),e.setAttribute("aria-label","cookie-law-banner"),e.setAttribute("aria-describedby","cookie-law-banner:desc"),e.insertAdjacentHTML("beforeend",'<h5 class="cookie-law-banner__title">'.concat(this.config.texts.title,'</h5>\n\t\t\t<div id="cookie-law-banner" class="cookie-law-banner__content">\n\t\t\t\t<div id="cookie-law-banner:desc" class="cookie-law-banner__message">').concat(this.config.texts.message,'</div>\n\t\t\t\t<button class="cookie-law-banner__personalize">').concat(this.config.texts.personalize,'</button>\n\t\t\t</div>\n\t\t\t<button class="cookie-law-banner__accept">').concat(this.config.texts.acceptAll,"</button>")),this.config.container.insertAdjacentElement("beforeend",e),e}},{key:"toggle",value:function(){this.refs.el.setAttribute("aria-hidden",this.state.hidden)}}])&&q(n.prototype,o),i&&q(n,i),t}(u.EventEmitter);var J={googleanalytics:function(e){var t=e.trackingID,n=e.callback,o=e.anonymizeIp,i=void 0===o||o;return window.GoogleAnalyticsObject="ga",window.ga=window.ga||function(){window.ga.q=window.ga.q||[],window.ga.q.push(arguments)},window.ga.l=new Date,{url:"https://www.google-analytics.com/analytics.js",callback:function(){ga("create",t,{cookieExpires:34128e3}),ga("set","anonymizeIp",i),ga("send","pageview"),"function"==typeof n&&n()}}},googletagmanager:function(e){var t=e.containerID,n=e.callback;return window.dataLayer=window.dataLayer||[],window.dataLayer.push({"gtm.start":(new Date).getTime(),event:"gtm.js"}),{url:"https://www.googletagmanager.com/gtm.js?id=".concat(t),callback:n}},facebookpixel:function(e){var t,n=e.pixelID,o=e.callback;return window.fbq?{}:(t=window.fbq=function(){t.callMethod?t.callMethod.apply(t,arguments):t.queue.push(arguments)},window._fbq||(window._fbq=t),t.push=t,t.loaded=!0,t.version="2.0",t.queue=[],{url:"https://connect.facebook.net/en_US/fbevents.js",callback:function(){fbq("init",n),fbq("track","PageView"),"function"==typeof o&&o()}})},recaptcha:function(e){var t=e.callback;return window.recaptchaOnLoad=function(){"function"==typeof t&&t()},{url:"https://www.google.com/recaptcha/api.js?onload=recaptchaOnLoad",callback:null}}},U=n(4);function B(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function K(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function W(e,t){if(null==e)return{};var n,o,i=function(e,t){if(null==e)return{};var n,o,i={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function G(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var V=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.config=a(U,t),this.state=new Proxy({bannerDismissed:!0,loadedServices:[]},{set:this.stateChange.bind(this)}),this.refs=this.initRefs(),this.state.bannerDismissed="dismiss"===c("".concat(this.config.cookieName,"_banner")),this.bindEvents()}var t,n,o;return t=e,(n=[{key:"bindEvents",value:function(){this.acceptAll=this.acceptAll.bind(this),this.onHashChange=this.onHashChange.bind(this),this.onModalClosed=this.onModalClosed.bind(this),this.onModalSaved=this.onModalSaved.bind(this),this.onCategoryChange=this.onCategoryChange.bind(this),this.onPersonalizeClick=this.onPersonalizeClick.bind(this),this.refs.banner.on("acceptAll",this.acceptAll),this.refs.banner.on("personalize",this.onPersonalizeClick),this.refs.modal.on("categoryChange",this.onCategoryChange),this.refs.modal.on("save",this.onModalSaved),this.refs.modal.on("closed",this.onModalClosed),window.addEventListener("hashchange",this.onHashChange)}},{key:"destroy",value:function(){this.refs.banner.off("acceptAll",this.acceptAll),this.refs.banner.off("persoffalize",this.refs.modal.open),this.refs.modal.on("categoryChange",this.onCategoryChange),this.refs.modal.off("closed",this.onModalClosed),window.removeEventListener("hashchange",this.onHashChange),this.refs.banner.destroy(),this.refs.modal.destroy()}},{key:"stateChange",value:function(e,t,n){switch(e[t]=n,t){case"bannerDismissed":this.refs.banner[n?"hide":"show"](),l("".concat(this.config.cookieName,"_banner"),"dismiss",n?null:0)}return!0}},{key:"onPersonalizeClick",value:function(){this.refs.modal.open()}},{key:"onHashChange",value:function(e){-1!==e.newURL.indexOf("#".concat(this.config.hash))&&(this.refs.modal.open(),window.history.replaceState("","Cookie Manager",window.location.pathname+window.location.search))}},{key:"onModalClosed",value:function(){-1!==window.location.hash.indexOf("#".concat(this.config.hash))&&window.history.replaceState("",document.title,window.location.pathname+window.location.search)}},{key:"onModalSaved",value:function(){this.state.bannerDismissed=!0}},{key:"onCategoryChange",value:function(e){var t=this.config.categories.find((function(t){return t.id===e.id}));this.setCategoryCookie(t,e.enabled)}},{key:"acceptAll",value:function(){var e=this;this.state.bannerDismissed=!0,this.config.categories.forEach((function(t){e.setCategoryCookie(t,!0),e.refs.modal.setCategoryEnabled(t,!0)}))}},{key:"setCategoryCookie",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.mandatory||(l("".concat(this.config.cookieName,"_").concat(e.id,"_accepted"),n?"yes":"no"),n&&e.services&&e.services.forEach((function(e){var n=e.name,o=W(e,["name"]);t.loadService(n,o)})))}},{key:"getCategoriesSettings",value:function(){var e=this;return this.config.categories.map((function(t){var n="yes"===c("".concat(e.config.cookieName,"_").concat(t.id,"_accepted"));return n&&t.services&&t.services.forEach((function(t){var n=t.name,o=W(t,["name"]);e.loadService(n,o)})),function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?B(Object(n),!0).forEach((function(t){K(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):B(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},t,{enabled:n})}))}},{key:"loadService",value:function(e,t){if(void 0!==J[e]&&void 0===this.state.loadedServices.find((function(t){return t.name===e}))){var n=J[e](t),o=n.url,i=n.callback;this.state.loadedServices.push({name:e,script:this.addScript(o,i)})}}},{key:"addScript",value:function(e,t){var n=!1,o=document.createElement("script");if(o.type="text/javascript",o.async=!0,o.src=e,"function"==typeof t){var i=function(){var e=o.readyState;n||e&&!/loaded|complete/.test(e)||(n=!0,t())};o.onreadystatechange=i,o.onload=i}return document.head.appendChild(o),o}},{key:"initRefs",value:function(){if(void 0!==this.refs)return this.refs;var e=document.createElement("div");return e.classList.add("cookie-law"),document.body.insertAdjacentElement("afterbegin",e),{el:e,banner:new I(e,{position:this.config.banner_position,texts:this.config.texts.banner}),modal:new T(e,{categories:this.getCategoriesSettings(),texts:this.config.texts.modal})}}}])&&G(t.prototype,n),o&&G(t,o),e}();function Y(e){return(Y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var Q="undefined"==typeof clc_config?{}:JSON.parse(clc_config);"object"===Y(Q.categories)&&(Q.categories=Object.keys(Q.categories).map((function(e){return Q.categories[e]}))),new V(Q)}]);