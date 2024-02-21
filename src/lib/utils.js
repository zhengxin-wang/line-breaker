const vscode = require('vscode');

module.exports = {
  getCharCount,
  getCurrentIndentation
}

function getCharCount(lineText, char) {
  const escapedChar = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escapedChar, 'g');
  return (lineText.match(regex) || []).length;
}

function getCurrentIndentation() {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const { tabSize, insertSpaces } = editor.options;
    return insertSpaces ? ' '.repeat(tabSize) : '\t';
  }

  return null;
}