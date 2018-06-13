const djsdoc = require('../djsdoc');

describe('djsdoc', () => {
  it('parse', () => {
    expect(djsdoc(
      `/**
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
*/`)).toEqual({
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
      })
  });
});