const { getCharCount, getCurrentIndentation } = require('./utils');

module.exports = {
  formatText
};

function formatText(document, range) {
  const isSingleLine = range.start.line === range.end.line;
  if (isSingleLine) {
    const text = document.getText(range);
    const leadingWhitespace = text.match(/^\s*/)[0];
    const indent = getCurrentIndentation();
    let indentCount = 0
    return text.replace(/(,|{|})\s*/g, (match, part1) => {
      if (match[0] === '{') {
        indentCount += 1
      } else if (match[0] === '}') {
        if (indentCount > 0){
          indentCount -= 1
        }
        return '\n' + leadingWhitespace + indent.repeat(indentCount) + part1
      }
      return part1 + '\n' + leadingWhitespace +indent.repeat(indentCount)
    }) 
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