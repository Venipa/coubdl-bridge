import AppContext from "./lib/AppContext";
import {
  createButton,
  createButtonGroup,
  createElement,
  createSeperator,
  injectStyle,
} from "./lib/CoubButtons";
import { openByUrl } from "./lib/DownloadHandler";
import Logger from "./lib/Logger";

export default function ({
  env: { dev: __DEV__, name: AppName, version: AppVersion, ...env },
}: AppContext) {
  // 'use strict';
  const log = new Logger(
    `[${AppName}, v${AppVersion}]${__DEV__ ? "(dev)" : ""}`
  );
  log.debug("boot", COUB_DL_CONTEXT);
  const buttonId = "coubdl-download";
  /**
   *
   * @param {HTMLElement[]} parentNodes
   */
  const checkCoubs = function (parentNodes) {
    parentNodes
      .filter(
        (x) => x.querySelectorAll && x.querySelector(".description__controls")
      )
      .forEach((x: HTMLElement) => {
        var _coubControls = x.querySelector(
          ".description__controls"
        )! as HTMLElement;
        var controls = x as HTMLDivElement;
        if ((controls = controls.querySelector("div#coub_dl_controls"))) return;
        else {
          let coubId =
            _coubControls.findAncestor<HTMLElement>(".coub")?.dataset.permalink;
          const cdlChildrens = [
            createButtonGroup(
              ...(() => {
                let downloadBtn = createButton("Download");
                downloadBtn.href = "coubdl-bridge://" + coubId;
                let downloadBtnFull = createButton("Looped");
                downloadBtnFull.href = "coubdl-bridge://" + coubId + "/full";
                return [downloadBtn, downloadBtnFull];
              })(),
              createSeperator(),
              (() => {
                let downloadBtn = createButton("GIF");
                downloadBtn.href = "coubdl-bridge://" + coubId + "/gif";
                return downloadBtn;
              })(),
              (() => {
                let downloadBtn = createButton("Audio");
                downloadBtn.href = "coubdl-bridge://" + coubId + "/audio";
                return downloadBtn;
              })()
            ),
          ];
          controls = createElement(
            "div",
            {
              id: "coub_dl_controls",
              children: cdlChildrens,
            },
            {
              height: "48px",
              display: "flex",
              flex: "1 1 auto",
              justifyContent: "flex-end",
            }
          );
          x.querySelector(".coub__description").prepend(controls);
        }
      });
  };
  /**
   *
   * @param {HTMLElement[]} parentNodes
   */
  const checkRelated = function (parentNodes) {
    parentNodes
      .filter((x) => x.querySelectorAll)
      .map((x) => Array.from(x.querySelectorAll(".suggest__item")))
      .filter((x) => x.length > 0)
      .reduce((l, r) => [...l, ...r], [])
      .forEach(function (x) {
        if (
          x &&
          x.querySelectorAll &&
          x.querySelectorAll("#" + buttonId).length === 0
        ) {
          var coubId = x.getAttribute("data-permalink");
          var downloadBtn = createButton("Download", {
            padding: "4px 6px",
            position: "absolute",
            top: "0",
            right: "0",
            marginTop: "8px",
            marginRight: "8px",
            zIndex: "9999",
          });
          downloadBtn.id = buttonId;
          downloadBtn.href = "coubdl-bridge://" + coubId;
          x.prepend(downloadBtn);
        }
      });
  };
  const mut = new MutationObserver((mutations) => {
    /**
     * @type {HTMLElement[]}
     */
    let addednodes;
    if (
      (addednodes = mutations
        .filter((x) => x.addedNodes && x.addedNodes.length > 0)
        .map((x) => x.addedNodes)
        .reduce((l, r) => [...l, ...r], [])).length > 0 &&
      addednodes
    ) {
      console.log(addednodes);
      const validNodes = addednodes.filter((x) =>
        [
          "coub",
          "coub-page",
          "viewer__video",
          "page",
          "coub--normal-card",
        ].filter((y) => x.classList?.contains(y))
      );
      if (validNodes.length > 0) {
        checkCoubs(validNodes);
        checkRelated(coubBox);
      }
    }
  });
  // document
  //   .querySelectorAll('#coubchat, .coubs-list, .coub-page .coub-block-col')
  //   .forEach(x => {
  //   });

  const bodyObserver = new MutationObserver((m) => {
    mut.disconnect();
    let coubBox = Array.from(
      document.querySelectorAll(
        ".coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page, .cobb-page .suggests--page"
      )
    );
    checkCoubs(coubBox);
    checkRelated(coubBox);
    m.filter((x) => x.addedNodes?.length)
      .map((x) => Array.from(x.addedNodes))
      .reduce((l, r) => [...l, ...r], [])
      .forEach((el) => {
        mut.observe(el, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
        });
      });
  });
  bodyObserver.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
  let coubBox = Array.from(
    document.querySelectorAll(
      ".coub.coub--page-card,.coub.coub--timeline,.coubs-list__inner .page"
    )
  );
  checkCoubs(coubBox);
  checkRelated(coubBox);
  window.addEventListener("keydown", (ev) => {
    /**
     * @type {HTMLElement} el
     */
    let el;
    if (
      ev.ctrlKey &&
      ev.key.toLowerCase() === "s" &&
      getSelection()?.anchorNode &&
      (el = document.querySelector(
        ".coubs-list .coub.active[data-id][data-permalink]"
      )) &&
      el.dataset.permalink
    ) {
      ev.preventDefault();
      const coubId = el.dataset.permalink;
      openByUrl("coubdl-bridge://" + coubId + "/video");
    }
  });

  ((fn) => {
    log.debug("ready", document.readyState);
    if (document.readyState !== "loading") fn();
    else window.addEventListener("DOMContentLoaded", fn);
  })(() => {
    log.debug("style add", env.style);
    injectStyle(env.style);
  });
}
