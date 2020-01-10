!function(t){var e={};function n(a){if(e[a])return e[a].exports;var i=e[a]={i:a,l:!1,exports:{}};return t[a].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(a,i,function(e){return t[e]}.bind(null,i));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=15)}([,,,,,function(t,e,n){var a=n(9);function i(t,e,n,a,i){var s=r.apply(this,arguments);return t.addEventListener(n,s,i),{destroy:function(){t.removeEventListener(n,s,i)}}}function r(t,e,n,i){return function(n){n.delegateTarget=a(n.target,e),n.delegateTarget&&i.call(t,n)}}t.exports=function(t,e,n,a,r){return"function"==typeof t.addEventListener?i.apply(null,arguments):"function"==typeof n?i.bind(null,document).apply(null,arguments):("string"==typeof t&&(t=document.querySelectorAll(t)),Array.prototype.map.call(t,(function(t){return i(t,e,n,a,r)})))}},,function(t,e,n){},function(t,e,n){},function(t,e){var n=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var a=Element.prototype;a.matches=a.matchesSelector||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector||a.webkitMatchesSelector}t.exports=function(t,e){for(;t&&t.nodeType!==n;){if("function"==typeof t.matches&&t.matches(e))return t;t=t.parentNode}}},function(t,e,n){},function(t,e,n){},function(t,e,n){},function(t,e,n){},,function(t,e,n){"use strict";n.r(e);n(7),n(8);var a=n(5),i=n.n(a);function r(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}var s=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.el=e,this.refs={tabList:this.el.querySelector("[tab-list]"),panelList:this.el.querySelector("[panel-list]")},this.state={activeTab:0},this.bind()}var e,n,a;return e=t,(n=[{key:"bind",value:function(){i()(this.refs.tabList,"a","click",this.onTabClick.bind(this))}},{key:"onTabClick",value:function(t){t.preventDefault(),this.updateActive(Array.from(this.refs.tabList.children).indexOf(t.target))}},{key:"updateActive",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.refs.tabList.children[this.state.activeTab].classList.remove("is-active"),this.refs.panelList.children[this.state.activeTab].classList.remove("is-active"),this.refs.tabList.children[t].classList.add("is-active"),this.refs.panelList.children[t].classList.add("is-active"),this.state.activeTab=t}}])&&r(e.prototype,n),a&&r(e,a),t}();n(10),n(11);function o(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}var c=function(){function t(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.el=void 0===e?this.create(n,a):e,this.refs={title:this.el.querySelector(".category__title")},this.props={settingName:n,id:this.el.getAttribute("id").match(/category_(.*)/)[1],idx:parseInt(this.el.dataset.idx)},this.state={title:this.refs.title.value},this.onTitleChange=this.onTitleChange.bind(this),this.bind()}var e,n,a;return e=t,(n=[{key:"bind",value:function(){this.refs.title.addEventListener("keyup",this.onTitleChange)}},{key:"onTitleChange",value:function(t){this.state.title=t.target.value,this.el.dispatchEvent(new CustomEvent("titleChange",{detail:{id:this.props.id,title:this.state.title}}))}},{key:"getId",value:function(){return this.props.id}},{key:"getTitle",value:function(){return this.state.title}},{key:"create",value:function(t,e){var n=Math.random().toString(36).substr(2,9),a=document.createElement("div");return a.classList.add("category"),a.setAttribute("id","category_".concat(n)),a.dataset.idx=e,a.insertAdjacentHTML("beforeend",'<input name="'.concat(t,"[categories][").concat(e,'][id]" type="text" value="cat-').concat(n,'"/>')+'<input name="'.concat(t,"[categories][").concat(e,'][position]" type="number" value="').concat(e+1,'"/>')+'<table class="form-table"><tr class="row">'+'<th><label for="cat-mandatory_'.concat(n,'">Mandatory ?</label></th>')+'<td><div class="switch">'+'<input id="cat-mandatory_'.concat(n,'" name="').concat(t,"[categories][").concat(e,'][mandatory]" type="checkbox" class="switch__chk"/>')+'<label for="cat-mandatory_'.concat(n,'" class="switch__label">mandatory ?</label>')+'</div></td></tr><tr class="row">'+'<th><label for="cat-title_'.concat(n,'">Title</label></th>')+"<td>"+'<input id="cat-title_'.concat(n,'" name="').concat(t,"[categories][").concat(e,'][title]" type="text" class="category__title"/>')+'</td></tr><tr class="row">'+'<th><label for="cat-description_'.concat(n,'">Description</label></th>')+"<td>"+'<textarea id="cat-description_'.concat(n,'" name="').concat(t,"[categories][").concat(e,'][description]" ></textarea>')+'</td></tr><tr class="row"><th><h3>Custom Texts</h3></th></tr><tr>'+'<th><label for="texts-enable_'.concat(n,'">Enable</label></th>')+"<td>"+'<input id="texts-enable_'.concat(n,'" type="text" name="').concat(t,"[categories][").concat(e,'][texts][enable]" placeholder="Enable cookies" />')+"</td>"+'<th><label for="texts-enabled_'.concat(n,'">Enabled</label></th>')+"<td>"+'<input id="texts-enabled_'.concat(n,'" type="text" name="').concat(t,"[categories][").concat(e,'][texts][enabled]" placeholder="Enabled" />')+"</td></tr><tr>"+'<th><label for="texts-disable_'.concat(n,'">Disable</label></th>')+"<td>"+'<input id="texts-disable_'.concat(n,'" type="text" name="').concat(t,"[categories][").concat(e,'][texts][disable]" placeholder="Disable cookies" />')+"</td>"+'<th><label for="texts-disabled_'.concat(n,'">Disabled</label></th>')+"<td>"+'<input id="texts-disabled_'.concat(n,'" type="text" name="').concat(t,"[categories][").concat(e,'][texts][disabled]" placeholder="Disabled" />')+"</td></tr><tr>"+'<th><label for="texts-alwaysEnabled_'.concat(n,'">Always Enabled <br><small><em>Mandatory category</em></small></label></th>')+"<td>"+'<input id="texts-alwaysEnabled_'.concat(n,'" type="text" name="').concat(t,"[categories][").concat(e,'][texts][alwaysEnabled]" placeholder="Always enabled" />')+"</td></tr></table>"),a}},{key:"insert",value:function(t){}}])&&o(e.prototype,n),a&&o(e,a),t}();function l(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}var d=function(){function t(e){var n=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.el=e,this.props={settingName:this.el.dataset.settingName},this.refs={tabList:this.el.querySelector(".categories__tab-list"),btnAdd:this.el.querySelector(".categories__add"),panelList:this.el.querySelector(".categories__panel-list"),categories:Array.from(this.el.querySelectorAll(".category")).map((function(t){return new c(t,n.props.settingName)}))},this.state={activeId:0},this.renderTabs(),this.onAddClick=this.onAddClick.bind(this),this.onCategoryChange=this.onCategoryChange.bind(this),this.bind()}var e,n,a;return e=t,(n=[{key:"bind",value:function(){var t=this;this.refs.btnAdd.addEventListener("click",this.onAddClick),this.refs.categories.forEach((function(e){return e.el.addEventListener("titleChange",t.onCategoryChange)}))}},{key:"onAddClick",value:function(t){t.preventDefault();var e=new c(void 0,this.props.settingName,this.refs.categories.length);e.el.addEventListener("titleChange",this.onCategoryChange),this.refs.panelList.insertAdjacentElement("beforeend",e.el),this.refs.categories.push(e),this.renderTabs(),this.refs.tabList.children[this.refs.categories.length-1].click()}},{key:"onCategoryChange",value:function(t){var e=this.refs.categories.findIndex((function(e){return e.getId()===t.detail.id}));this.refs.tabList.children[e].textContent=""===t.detail.title?"Category ".concat(e+1):t.detail.title}},{key:"renderTabs",value:function(){for(var t=this;this.refs.tabList.lastChild;)this.refs.tabList.removeChild(this.refs.tabList.lastChild);this.refs.categories.forEach((function(e,n){var a=e.getTitle();t.refs.tabList.insertAdjacentHTML("beforeend",'<a href="#category_'.concat(e.getId(),'" class="categories__tab').concat(t.state.activeId===n?" is-active":"",'">').concat(""===a?"Category ".concat(n+1):a,"</a>"))}))}}])&&l(e.prototype,n),a&&l(e,a),t}();n(12);function u(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function h(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var f=function(){function t(e){h(this,t),this.el=e,this.props={},this.refs={enable:this.el.querySelector(".service__row-enable input"),rows:Array.from(this.el.querySelectorAll(".service__row-enable ~ tr")),fields:Array.from(this.el.querySelectorAll('.service__row-enable ~ tr input[type="text"], .service__row-enable ~ tr select'))},this.bind(),this.updateFields()}var e,n,a;return e=t,(n=[{key:"bind",value:function(){this.updateFields=this.updateFields.bind(this),this.refs.enable.addEventListener("change",this.updateFields)}},{key:"updateFields",value:function(){this.refs.enable.checked?(this.refs.rows.forEach((function(t){return t.style.display="table-row"})),this.refs.fields.forEach((function(t){return t.setAttribute("required",!0)}))):(this.refs.rows.forEach((function(t){return t.style.display="none"})),this.refs.fields.forEach((function(t){return t.removeAttribute("required")})))}}])&&u(e.prototype,n),a&&u(e,a),t}(),b=(n(13),document.querySelector(".categories"));b&&new d(b);var p=Array.from(document.querySelectorAll("[tabulation]"));p&&p.forEach((function(t){return new s(t)}));var y=document.querySelector(".services");y&&new function t(e){h(this,t),this.el=e,this.refs={services:Array.from(this.el.querySelectorAll(".service")).map((function(t){return new f(t)}))}}(y)}]);