// ==UserScript==
// @name         Coub-Bridge
// @namespace    https://venipa.net
// @version      0.1.5
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
    btn.innerText = 'Download';
    btn.style.padding = '8px 12px';
    btn.style.color = '#fff';
    btn.style.background = '#000';
    btn.style.lineHeight = 1;
    btn.style.fontSize = '0.875rem';
    btn.style.alignSelf = 'center';
    btn.style.borderRadius = '4px';
    btn.style.marginRight = '8px';
    return btn;
  };
  const groupButtons = function(...innerButtons) {
    const seperator = document.createElement('div');
    seperator.style.width = '2px';
    seperator.style.backgroundColor = 'rgba(255,255,255,.25)';
    seperator.style.borderRadius = '18px';
    seperator.style.height = '18px';
    const btnGroup = document.createElement('div');
    btnGroup.style.color = '#fff';
    btnGroup.style.background = '#000';
    btnGroup.style.lineHeight = 1;
    btnGroup.style.fontSize = '0.875rem';
    btnGroup.style.alignSelf = 'center';
    btnGroup.style.borderRadius = '4px';
    btnGroup.style.flexDirection = 'row';
    btnGroup.style.overflow = 'hidden';
    if (innerButtons.length > 0) {
      innerButtons.map(function(x) {
        x.style.borderRadius = '0';
        x.style.margin = '0';
        x.style.flexDirection = 'row';
        return x;
      }).forEach(function(x, i) {
        if ((i + 1) % 2 === 0) {
          btnGroup.appendChild(seperator);
        }
        btnGroup.appendChild(x);
      });
    }
    return btnGroup;
  };
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
  const buttonLoopedId = 'coubdl-download-looped';
  const buttonAudioId = 'coubdl-audio-download';
  const buttonGifId = 'coubdl-gif-download';
  var checkCoubs = function() {
    var coubs = document.querySelectorAll(
      '#coubchat .coub[coub-block]:not(.timeline-banner), .coubs-list .coub[coub-block]:not(.timeline-banner), .coub-page > .coub-block-col .coub[coub-block]'
    );
    var coubRelated = document.querySelectorAll(
      '.suggests-block-col .suggest__list > .suggest__item'
    );

    if (coubs) {
      coubs.forEach(function(x) {
        if (!x || !x.querySelector) {
          return;
        }
        var controls = x.querySelector('.description__controls');
        if (controls && controls.querySelectorAll) {
          if (controls.querySelectorAll('#' + buttonId).length === 0) {
            let coubId = x.getAttribute('data-permalink');
            let downloadBtn = downloadButton();
            downloadBtn.href = 'coubdl-bridge://' + coubId;
            downloadBtn.innerText = 'Download';
            let downloadBtnFull = downloadButton();
            downloadBtnFull.href = 'coubdl-bridge://' + coubId + '/full';
            downloadBtnFull.innerText = 'Looped';
            let grp = groupButtons(downloadBtn, downloadBtnFull);
            grp.id = buttonId;
            controls.prepend(grp);
          }
          if (controls.querySelectorAll('#' + buttonAudioId).length === 0) {
            let coubId = x.getAttribute('data-permalink');
            let downloadBtn = downloadButton();
            downloadBtn.id = buttonAudioId;
            downloadBtn.innerText = 'Audio';
            downloadBtn.href = 'coubdl-bridge://' + coubId + '/audio';
            controls.prepend(downloadBtn);
          }
          if (controls.querySelectorAll('#' + buttonGifId).length === 0) {
            let coubId = x.getAttribute('data-permalink');
            let downloadBtn = downloadButton();
            downloadBtn.id = buttonGifId;
            downloadBtn.innerText = 'GIF';
            downloadBtn.href = 'coubdl-bridge://' + coubId + '/gif';
            controls.prepend(downloadBtn);
          }
        }
      });
    }
    if (coubRelated) {
      coubRelated.forEach(function(x) {
        if (
          x &&
          x.querySelectorAll &&
          x.querySelectorAll('#' + buttonId).length === 0
        ) {
          var coubId = x.getAttribute('data-permalink');
          var downloadBtn = downloadButton();
          downloadBtn.id = buttonId;
          downloadBtn.href = 'coubdl-bridge://' + coubId;
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
