import { compile, stringify, serialize } from 'stylis';

export function stringifyCss(tpl: string, values: any) {
  if (!tpl) return '';
  let result = tpl;

  // eslint-disable-next-line guard-for-in
  for (const key in values) {
    const value = values[key];
    const regex = new RegExp(`${key}\\b`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

export function parseCss(tpl: string, a: string) {
  if (!tpl) return {};
  const tplRegex = /\.(\w+)\s*{\s*(.*?)\s*}/g;
  const tplMatches = [...tpl.matchAll(tplRegex)];

  const aRegex = /\.(\w+)\s*{\s*(.*?)\s*}/g;
  const aMatches = [...a.matchAll(aRegex)];

  const result: any = {};
  // eslint-disable-next-line
  for (let i = 0; i < tplMatches.length; i++) {
    const tplMatch = tplMatches[i];
    const tplSelector = tplMatch[1];
    const tplStyles = tplMatch[2]
      .split(';')
      .map((style) => style.trim())
      .filter(Boolean);

    const aMatch = aMatches.find((match) => match[1] === tplSelector);
    if (aMatch) {
      const aStyles = aMatch[2]
        .split(';')
        .map((style) => style.trim())
        .filter(Boolean);
      // eslint-disable-next-line
      for (let j = 0; j < tplStyles.length; j++) {
        const tplStyle = tplStyles[j];
        const [tplKey, tplValue] = tplStyle
          .split(':')
          .map((item) => item.trim());
        const aStyle = aStyles.find((style) => style.startsWith(tplKey));
        if (aStyle) {
          const [, aValue] = aStyle.split(':').map((item) => item.trim());
          result[tplValue] = aValue;
        }
      }
    }
  }

  return result;
}

export function normalizeCSS(css: string, selector?: string) {
  let mergeCss = css;
  if (selector) {
    const hasD = selector.startsWith('.') || selector.startsWith('#');
    mergeCss = `${hasD ? '' : '.'}${selector} {${css}}`;
  }
  const compiled = compile(mergeCss);
  return serialize(compiled, stringify);
}

// 这个解法不是特别好，但是组件有些是有嵌套的 div 有些是没有嵌套，所以给可用的 class 添加一个 &. 的样式前缀
export function prefixAnyCSS(
  css: string,
  prefix?: string,
  hasPrefix?: boolean,
) {
  if (prefix) {
    const hasD = prefix.startsWith('.') || prefix.startsWith('#');
    const prefixCss = `${hasD ? '' : '.'}${prefix}`;
    if (hasPrefix) return `${prefixCss}${css}`;
    return css
      .split('\n')
      .map((i) => {
        if (i.trimStart().startsWith('.')) {
          return `${prefixCss}${i.trimStart()}`;
        }
        return i;
      })
      .join('\n');
  }
  return css;
}

export function insertRules(
  id: string,
  rules: string,
  selector = document.head,
) {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    (selector ?? document.head).appendChild(style);
    style!.innerHTML = rules;
  } else {
    style!.innerHTML = rules;
  }
}

export function insertLink(id: string, href: string, insertBefore = false) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = href;
  if (insertBefore) {
    document.body.insertBefore(link, document.body.firstElementChild);
  } else {
    document.head.appendChild(link);
  }
}
