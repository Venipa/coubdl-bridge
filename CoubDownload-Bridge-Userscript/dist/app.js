/*! // ==UserScript==
// @name         Coub-Bridge
// @namespace    https://venipa.net
// @version      0.2.0
// @description  try to take over the world!
// @author       Venipa
// @match        https://*.coub.com/*
// @match        https://coub.com/*
// @grant        none
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==
// ==OpenUserJS==
// @author Venipa
// ==/OpenUserJS== */
!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s=0)}([function(e,t,r){e.exports=r(1)},function(e,t){function r(e){return function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}!function(){var e=function(){var e=document.createElement("a");return e.innerText="Download",e.style.padding="8px 12px",e.style.color="#fff",e.style.background="#000",e.style.lineHeight=1,e.style.fontSize="0.875rem",e.style.alignSelf="center",e.style.borderRadius="4px",e.style.marginRight="8px",e},t=function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];console.log("[coub-bridge|debug] ",e,r)};t("boot");var n="coubdl-download",o=function(r){t(r),r.filter((function(e){return e.querySelectorAll})).forEach((function(t){var r=t.querySelector(".description__controls");if(r&&r.querySelectorAll){if(0===r.querySelectorAll("#"+n).length){var o=t.getAttribute("data-permalink"),l=e();l.href="coubdl-bridge://"+o,l.innerText="Download";var i=e();i.href="coubdl-bridge://"+o+"/full",i.innerText="Looped";var u=function(){var e=document.createElement("div");e.style.width="2px",e.style.backgroundColor="rgba(255,255,255,.25)",e.style.borderRadius="18px",e.style.height="18px";var t=document.createElement("div");t.style.color="#fff",t.style.background="#000",t.style.lineHeight=1,t.style.fontSize="0.875rem",t.style.alignSelf="center",t.style.borderRadius="4px",t.style.flexDirection="row",t.style.overflow="hidden";for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return n.length>0&&n.map((function(e){return e.style.borderRadius="0",e.style.margin="0",e.style.flexDirection="row",e})).forEach((function(r,n){(n+1)%2==0&&t.appendChild(e),t.appendChild(r)})),t}(l,i);u.id=n,r.prepend(u)}if(0===r.querySelectorAll("#coubdl-audio-download").length){var a=t.getAttribute("data-permalink"),c=e();c.id="coubdl-audio-download",c.innerText="Audio",c.href="coubdl-bridge://"+a+"/audio",r.prepend(c)}if(0===r.querySelectorAll("#coubdl-gif-download").length){var d=t.getAttribute("data-permalink"),f=e();f.id="coubdl-gif-download",f.innerText="GIF",f.href="coubdl-bridge://"+d+"/gif",r.prepend(f)}}}))},l=function(t){t.filter((function(e){return e.querySelectorAll})).map((function(e){return Array.from(e.querySelectorAll(".suggest__item"))})).filter((function(e){return e.length>0})).reduce((function(e,t){return[].concat(r(e),r(t))}),[]).forEach((function(t){if(t&&t.querySelectorAll&&0===t.querySelectorAll("#"+n).length){var r=t.getAttribute("data-permalink"),o=e();o.id=n,o.href="coubdl-bridge://"+r,o.style.padding="4px 6px",o.style.position="absolute",o.style.top=0,o.style.right=0,o.style.marginTop="8px",o.style.marginRight="8px",o.style.zIndex=9999,t.prepend(o)}}))},i=new MutationObserver((function(e){var t;if((t=e.filter((function(e){return e.addedNodes&&e.addedNodes.length>0})).map((function(e){return e.addedNodes})).reduce((function(e,t){return[].concat(r(e),r(t))}),[])).length>0&&t){console.log(t);var n=t.filter((function(e){return["coub","coub-page","viewer__video","page","coub--normal-card"].filter((function(t){var r;return null===(r=e.classList)||void 0===r?void 0:r.contains(t)}))}));n.length>0&&(o(n),l(u))}}));new MutationObserver((function(e){i.disconnect();var t=Array.from(document.querySelectorAll(".coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page, .cobb-page .suggests--page"));o(t),l(t),e.filter((function(e){var t;return null===(t=e.addedNodes)||void 0===t?void 0:t.length})).map((function(e){return Array.from(e.addedNodes)})).reduce((function(e,t){return[].concat(r(e),r(t))}),[]).forEach((function(e){i.observe(e,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}))})).observe(document.documentElement,{attributes:!0,characterData:!0,childList:!0,subtree:!0});var u=Array.from(document.querySelectorAll(".coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page"));o(u),l(u)}()}]);