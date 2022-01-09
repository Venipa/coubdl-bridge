export const downloadByUrl = function(url: string, filename?: string) {
  const dl = document.createElement("a");
  dl.href = url;
  dl.download = filename;
  dl.style.height = "0";
  dl.style.width = "0";
  dl.style.position = "fixed";
  dl.click();
  dl.remove();
}
export const openByUrl = function(url: string) {
  const dl = document.createElement("a");
  dl.href = url;
  dl.style.height = "0";
  dl.style.width = "0";
  dl.style.position = "fixed";
  dl.click();
  dl.remove();
}