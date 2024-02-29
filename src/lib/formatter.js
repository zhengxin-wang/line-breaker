const vscode = require("vscode");
const { getCharCount, getCurrentIndentation } = require('./utils');

module.exports = {
  formatText
};

function formatText(document, range) {
  if (range.isSingleLine) {
    const text = document.getText(range);
    const startLineText = document.lineAt(range.start.line).text;
    const leadingWhitespace = startLineText.match(/^\s*/)[0];
    const indent = getCurrentIndentation();
    let indentCount = 0
    return text.replace(/({|\s*}|,\s*}|,)\s*/g, (match, part1) => {
     if (part1 === '{') {
        indentCount += 1
      } else if (part1.includes('}')) {
        if (indentCount > 0){
          indentCount -= 1
        }
        const prefix = part1.includes(',') ? ',' : '';
        return prefix + '\n' + leadingWhitespace + indent.repeat(indentCount) + '}'
      }
      return part1 + '\n' + leadingWhitespace +indent.repeat(indentCount)
    }) 
  } else {
    let text = '';
    const space = ' ';
    for (let i = range.start.line; i <= range.end.line; i++) {
      if (i === range.start.line) {
        const startLineRange = new vscode.Range(i, range.start.character, i, document.lineAt(i).range.end.character)
        const lineText = document.getText(startLineRange);
        text += lineText.trimEnd();
      } else if (i === range.end.line) {
        const endLineRange = new vscode.Range(i, 0, i, range.end.character)
        const lineText = document.getText(endLineRange);
        text += space + lineText.trim();
      } else {
        const lineText = document.lineAt(i).text;
        text += space + lineText.trim();
      }
    }
    return text;
  }
}