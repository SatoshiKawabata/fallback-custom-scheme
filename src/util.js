const { document, location } = window;

const openURLByIFrame = (url) => {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.setAttribute('height', 0);
  iframe.setAttribute('width', 0);
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  return iframe;
};

const openURLByHref = (url, isReplace) => {
  if (isReplace) {
    location.replace(url);
  } else {
    location.href = url;
  }
};

const parseQuery = (str) => {
  const queries = {};
  const queryStr = str.replace(/^(\?|#|&)/, '');
  const elements = queryStr.split('&');
  for (let i = 0; i < elements.length; i++) {
    const param = elements[i];
    const parts = param.replace(/\+/g, ' ').split('=');
    let key = parts.shift();
    let val = parts.length > 0 ? parts.join('=') : undefined;
    key = decodeURIComponent(key);
    val = val === undefined ? null : decodeURIComponent(val);

    if (queries[key] === undefined) {
      queries[key] = val;
    } else if (Array.isArray(queries[key])) {
      queries[key].push(val);
    } else {
      queries[key] = [
        queries[key],
        val,
      ];
    }
  }

  return queries;
};

export default {
  openURLByIFrame,
  openURLByHref,
  parseQuery,
};
