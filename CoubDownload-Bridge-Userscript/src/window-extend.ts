export default function () {
  Node.prototype.findAncestor = function <T = Element>(sel: string): T | null {
    let el = this;
    while ((el = el.parentElement) && !el.matches.call(el, sel));
    return el;
  };
}
