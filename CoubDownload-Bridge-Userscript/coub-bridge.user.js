// ==UserScript==
// @name         Coub-Bridge
// @namespace    https://venipa.net
// @version      0.1
// @description  try to take over the world!
// @author       Venipa
// @match        https://*.coub.com/*
// @match        https://coub.com/*
// @grant        none
// ==/UserScript==

(function() {
    // 'use strict';
    const downloadButton = function() {
        const btn = document.createElement('a');
        btn.innerText = "Download Coub";
        btn.style.padding = "8px 12px";
        btn.style.color = "#fff";
        btn.style.background = "#000";
        btn.style.lineHeight = 1;
        btn.style.fontSize = "0.875rem";
        btn.style.alignSelf = 'center';
        btn.style.borderRadius = '4px';
        btn.style.marginRight = '8px';
        return btn;
    }
    var log = {
        debug: function(msg, ...params) {
            console.log('[coub-bridge|debug] ', msg, params);
        },
        tag: function(tag, msg, ...params) {
            console.log('[coub-bridge|' + tag + '] ', msg, params);
        }
    };
    log.debug('boot');
    const buttonId = 'coubdl-download';
    var checkCoubs = function() {
        var coubs = document.querySelectorAll('.coubs-list .coub[coub-block]:not(.timeline-banner), .coub-page > .coub-block-col .coub[coub-block]');
        var coubRelated = document.querySelectorAll('.suggests-block-col .suggest__list > .suggest__item');

        if (coubs) {
            coubs.forEach(function(x) {
                if (!x || !x.querySelector) {
                    return;
                }
                var controls = x.querySelector('.description__controls');
                if (controls && controls.querySelectorAll && controls.querySelectorAll('#' + buttonId).length === 0) {
                    var coubId = x.getAttribute('data-permalink');
                    var downloadBtn = downloadButton();
                    downloadBtn.id = buttonId;
                    downloadBtn.href = "coubdl-bridge://" + coubId;
                    controls.prepend(downloadBtn);
                }
            });
        }
        if (coubRelated) {
            coubRelated.forEach(function(x) {
                if (x && x.querySelectorAll && x.querySelectorAll('#' + buttonId).length === 0) {
                    var coubId = x.getAttribute('data-permalink');
                    var downloadBtn = downloadButton();
                    downloadBtn.id = buttonId;
                    downloadBtn.href = "coubdl-bridge://" + coubId;
                    downloadBtn.style.padding = '4px 6px';
                    downloadBtn.style.position = 'absolute';
                    downloadBtn.style.top = 0;
                    downloadBtn.style.right = 0;
                    downloadBtn.style.marginTop = '8px';
                    downloadBtn.style.marginRight = '8px';
                    downloadBtn.style.zIndex = 9999;
                    x.prepend(downloadBtn);
                }
            });
        }
    };
    var worker;
    var workerFunc = function() {
        clearInterval(worker);
        checkCoubs();
        worker = setInterval(workerFunc, 2500);
    };
    workerFunc();
})();