# djsdoc

Simple JSDoc parser. parses jsdoc string to json. 

(You need to pass in the comment, not a whole JavaScript file, you can use [jsdoc-regex](https://github.com/neogeek/jsdoc-regex) to matching the JSDoc in a JavaScript file).

## Installation
You can install djsdoc using npm:

```
$ npm install djsdoc
```

## Usage

``` js
djsdoc(`/**
* djsdoc is a simple JSDoc parser. parses jsdoc string to json.
* @title something
* @subtitle something else
* @date 2018-06-12
* @comments
* 
* @tags 
* a
* b
* 
* c
* @categories d e f
*
* @const @const
* @中文 滑稽
*
*/`)
/*{
  description: 'djsdoc is a simple JSDoc parser. parses jsdoc string to json.',
  tags:
    [{ title: 'title', content: 'something' },
    { title: 'subtitle', content: 'something else' },
    { title: 'date', content: '2018-06-12' },
    { title: 'comments', content: '' },
    { title: 'tags', content: 'a\nb\n\nc' },
    { title: 'categories', content: 'd e f' },
    { title: 'const', content: '@const' },
    { title: '中文', content: '滑稽'}]
}*/
```

### About

Open sourced under the GPL v3.0 license.

Part of the code was modified from [doctrine](https://github.com/eslint/doctrine).