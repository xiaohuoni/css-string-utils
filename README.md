# css-string-utils

theme class utils, css utils

```js
pnpm i css-string-utils

import {} from 'css-string-utils';
```

## stringifyCss

根据指定模版，将对象的值解析道模版中，生成最终的 css 字符串

```js
const tpl = '.cc{ background-color: backgroundColor; font-size: fontSize;}';
const a = { backgroundColor: 'red', fontSize: '12px' };
const c = stringifyCss(tpl, a);
console.log(c); // .cc{ background-color:red; font-size:12px;}
```

## parseCss

根据指定模版，将值从 css 字符串中解析成对象

```js
const tpl = '.cc{ background-color: backgroundColor; font-size: fontSize;}';
const a = '.cc{ background-color:red; font-size:12px;}';
const c = parseCss(tpl, a);
console.log(c); // { backgroundColor:'red',fontSize:'12px'}
```

## normalizeCSS

编译 css 且支持给 css 提供指定的选择器，如

```js
const a = '.a{ .b{ font-size:12px; } }';

const css = normalizeCSS(a);

console.log(css);

// output: '.a .b{font-size:12px;}'

const css1 = normalizeCSS(a, '.cc');
console.log(css1);
// output: '.cc .a .b{font-size:12px;}'
```

## insertRules

将 css 挂载到页面上 `insertRules(id: string, rules: string,selector = document.head,);` 指定 id，会覆盖生产的 style 标签

```js
insertRules('12312', css);
```

## insertLink

挂载指定的 css link `insertLink(id: string, href: string, insertBefore = false)`

可选择指定挂在在 body.firstElementChild 还是 head 中

```js
insertLink('12312', 'http://xxx.css', true);
```
