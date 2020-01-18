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
      innerButtons
        .map(function(x) {
          x.style.borderRadius = '0';
          x.style.margin = '0';
          x.style.flexDirection = 'row';
          return x;
        })
        .forEach(function(x, i) {
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
  const coubsSelector =
    '#coubchat .coub[coub-block]:not(.timeline-banner), .coubs-list .coub[coub-block]:not(.timeline-banner), .coub-page > .coub-block-col .coub[coub-block]';
  const coubsRelatedSelector =
    '.suggests-block-col .suggest__list > .suggest__item';
    /**
     * 
     * @param {HTMLElement[]} parentNodes 
     */
  var checkCoubs = function(parentNodes) {
    log.debug(parentNodes);
    parentNodes.filter(x => x.querySelectorAll).forEach(x => {
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
  };
  const mut = new MutationObserver(mutations => {
    /**
     * @type {HTMLElement[]}
     */
    let addednodes;
    if ((addednodes = mutations.filter(x => x.addedNodes && x.addedNodes.length > 0).map(x => x.addedNodes).reduce((l,r) => ([...l, ...r]), [])).length > 0 && addednodes) {
      console.log(addednodes);
      const validNodes = addednodes.filter(x => ['coub', 'coub-page', 'viewer__video', 'page', 'coub--normal-card'].filter(y => x.classList?.contains(y)));
      if (validNodes.length > 0) {
        checkCoubs(validNodes);
      }
    }
  });
  // document
  //   .querySelectorAll('#coubchat, .coubs-list, .coub-page .coub-block-col')
  //   .forEach(x => {
  //   });
    
    const bodyObserver = new MutationObserver((m) => {
      mut.disconnect();
      let coubBox = Array.from(document.querySelectorAll('.coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page'));
      log.debug(['start el', coubBox]);
      checkCoubs(coubBox);
      m.filter(x => x.addedNodes?.length).map(x => x.addedNodes).reduce((l,r) => [...l, r]).forEach(el => {
        mut.observe(el);
      });
    });
    bodyObserver.observe(document.documentElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
    let coubBox = Array.from(document.querySelectorAll('.coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page'));
    log.debug(['start el', coubBox]);
    checkCoubs(coubBox);
})();
