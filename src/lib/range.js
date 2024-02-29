
const vscode = require("vscode");
const { getCharCount } = require('./utils');

module.exports = {
  calcBlockRange
};

function getBlockRange(document, cursorPosition) {
  const currentLineNumber = cursorPosition.line;
  const currentLineText = document.lineAt(currentLineNumber).text;

  let startIndex = currentLineText.indexOf('{');
  let endIndex = currentLineText.indexOf('}')

  if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {

    // Return the range from the start of the opening brace to the end of the closing brace
    return new vscode.Range(currentLineNumber, startIndex, currentLineNumber, endIndex + 1);
  }

  let startLine = currentLineNumber;
  let endLine = currentLineNumber;
  const lineCount = document.lineCount;
  if (currentLineText.includes('{') && ((endIndex < 0) || (endIndex > startIndex))) {
    // Search downwards for the closing brace '}'
    let openBrackets = 1;
    for (let i = cursorPosition.line + 1; i < lineCount; i++) {
      const lineText = document.lineAt(i).text;
      openBrackets += getCharCount(lineText, '{');
      openBrackets -= getCharCount(lineText, '}');
      if (openBrackets === 0) {
        endLine = i;
        endIndex = lineText.indexOf('}');
        break;
      }
    }
  } else if (currentLineText.includes('}')) {
    // Search upwards for the opening brace '{'
    let openBrackets = 1;
    for (let i = currentLineNumber - 1; i >= 0; i--) {
      if (i === -1) break;

      const lineText = document.lineAt(i).text;
      openBrackets += getCharCount(lineText, '}');
      openBrackets -= getCharCount(lineText, '{');
      if (openBrackets === 0) {
        startLine = i;
        startIndex = lineText.indexOf('{');
        break;
      }
    }
  }

  // Return the range from the start of the opening brace to the end of the closing brace
  const start = new vscode.Position(startLine, startIndex);
  const end = new vscode.Position(endLine, endIndex + 1);

  return new vscode.Range(start, end);
}

function calcBlockRange(editor, document) {
  const cursorPosition = editor.selection.active;
  const lineText = document.lineAt(cursorPosition.line).text;
  const canProcess = (lineText.match(/[{}]/g) || [])?.length > 0;
  if (!canProcess) {
    vscode.window.showErrorMessage('No opening or closing bracket in this line');
    return
  }

  return getBlockRange(document, cursorPosition);
}