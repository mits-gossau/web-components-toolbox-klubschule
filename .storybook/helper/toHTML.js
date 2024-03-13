/* This is just a simple function to convert an html string to an HTMLElement */

export function toHTML (str) {
  const div = document.createElement('div')

  // convert string to html and add script to load web components
  div.innerHTML = str;

  if (Array.from(div.children) > 1) {
    return div;
  } else {
    return div.firstElementChild;
  }
}