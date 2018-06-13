let index, source;

/**
 * Return true if provided code is line terminator. Line terminator characters are formally defined in ECMA262.
 * @param {number} ch 
 */
function isLineTerminator(ch) {
  return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
}

NON_ASCII_WHITESPACES = [
  0x1680,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
  0x202F, 0x205F,
  0x3000,
  0xFEFF
];

/**
 * Return true if provided code is white space. White space characters are formally defined in ECMA262.
 * @param {number} ch 
 */
function isWhiteSpace(ch) {
  return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
    ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
}

function advance() {
  return String.fromCharCode(source.charCodeAt(index++));
}

function scanContent() {
  let content = '';

  let waiting = false;
  while (index < source.length) {
    const ch = source.charCodeAt(index);
    if (isLineTerminator(ch) && !(ch === 0x0D  /* '\r' */ && source.charCodeAt(index + 1) === 0x0A  /* '\n' */)) {
      waiting = true;
    } else if (waiting) {
      if (ch === 0x40  /* '@' */) {
        break;
      }
      if (!isWhiteSpace(ch)) {
        waiting = false;
      }
    }
    content += advance();
  }
  return content.trim();
}

function scanTitle() {
  let title = '';
  // waste '@'
  advance();

  while (index < source.length && !isWhiteSpace(source.charCodeAt(index)) && !isLineTerminator(source.charCodeAt(index))) {
    title += advance();
  }

  return title;
}

function skipToTag() {
  while (index < source.length && source.charCodeAt(index) !== 0x40  /* '@' */) {
    advance();
  }
  if (index >= source.length) {
    return false;
  }
  return true;
}

function parseTag(options) {
  var title, parser, tag;

  // skip to tag
  if (!skipToTag()) {
    return null;
  }

  // scan title
  title = scanTitle();

  // construct tag parser
  content = scanContent();

  return {title, content};
}

function scanJSDocDescription() {
  let description = '';

  let atAllowed = true;
  while (index < source.length) {
    let ch = source.charCodeAt(index);

    if (atAllowed && ch === 0x40  /* '@' */) {
      break;
    }

    if (isLineTerminator(ch)) {
      atAllowed = true;
    } else if (atAllowed && !isWhiteSpace(ch)) {
      atAllowed = false;
    }

    description += advance();
  }
  return description.trim();
}

const WHITESPACE = '[ \\f\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]';

const STAR_MATCHER = '(' + WHITESPACE + '*(?:\\*' + WHITESPACE + '?)?)(.+|[\r\n\u2028\u2029])';

function unwrapComment(doc) {
  // JSDoc comment is following form
  //   /**
  //    * .......
  //    */

  return doc.
    // remove /**
    replace(/^\/\*\*?/, '').
    // remove */
    replace(/\*\/$/, '').
    // remove ' * ' at the beginning of a line
    replace(new RegExp(STAR_MATCHER, 'g'), '$2').
    // remove trailing whitespace
    replace(/\s*$/, '');
}

function parse(comment) {

  source = unwrapComment(comment.trim());
  index = 0;

  const description = scanJSDocDescription();

  const tags = []

  while (true) {
    const tag = parseTag();
    if (!tag) {
      break;
    }
    tags.push(tag);
  }

  return {
    description: description,
    tags: tags
  };
}

module.exports = parse;