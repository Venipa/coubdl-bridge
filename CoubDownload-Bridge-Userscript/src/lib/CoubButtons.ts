import { flatten } from "lodash-es";
import { CSSDeclareObject } from "./Helper";
export function injectStyle(style: string) {
  const _style = createElement("style");
  _style.innerText = style;
  _style.dataset.type = "coubdl_bridge.custom_style";
  return document.head.appendChild(_style);
}
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: Partial<{
    children: any[];
    class: string | string[];
    id: string;
  }>,
  style?: Partial<CSSStyleDeclaration>
) {
  const el = document.createElement(tagName);
  Object.assign(el.style, style);
  if (options?.class) {
    el.classList.add(...flatten([options.class]));
  }
  el.id = options?.id;
  if (options?.children?.length)
    options.children.every((x) => el.appendChild(x));
  return el;
}
export function createButton(text?: string, style?: CSSDeclareObject) {
  const btn = document.createElement("a");
  if (text) btn.innerText = text;
  btn.classList.add("coubdl-button");
  Object.assign(
    btn.style,
    style
  );
  return btn;
}
export function createSeperator() {
  const seperator = document.createElement("div");
  seperator.classList.add("coubdl-seperator");
  return seperator;
}
export function createButtonGroup(...innerButtons: HTMLElement[]) {
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("coubdl-button-group");
  if (innerButtons.length > 0) {
    innerButtons.forEach(function (x, i) {
      if (!x.classList.contains("coubdl-seperator"))
        x.classList.add("coubdl-button-group-item");
      btnGroup.appendChild(x);
    });
  }
  return btnGroup;
}
