const { getCharCount } = require('./utils');

module.exports = {
  formatText
};

function formatText(document, range) {
  const isSingleLine = range.start.line === range.end.line;
  if (isSingleLine) {
    const text = document.getText(range);
    const isMultiBrackets = getCharCount(text, '{') > 1 || getCharCount(text, '}') > 1
    if (isMultiBrackets) {
      const firstBraceIndex = text.indexOf('{');
      const lastBraceIndex = text.lastIndexOf('}');
      return text.substring(0, firstBraceIndex + 1) + '\n' +
        text.substring(firstBraceIndex + 1, lastBraceIndex) +
        '\n' + text.substring(lastBraceIndex);
    } else {
      return text.replace(/{\s*(.*?)\s*}/g, (_, inner) => {
        return `{\n    ${inner.replace(/,\s*/g, ',\n    ')}\n\t}`;
      });
    }
  } else {
    let text = '';
    const space = ' ';
    for (let i = range.start.line; i <= range.end.line; i++) {
      const lineText = document.lineAt(i).text;
      if (i === range.start.line) {
         text += lineText.trimEnd();
      } else {
        text += space + lineText.trim();
      }
    }
    return text;
  }
}