
const vscode = require("vscode");
const { getCharCount } = require('./utils');

module.exports = {
  calcBlockRange
};

function getBlockRange(document, cursorPosition) {
  const currentLineNumber = cursorPosition.line;
  let startLine = currentLineNumber;
  let endLine = currentLineNumber;
  const lineCount = document.lineCount;

  const currentLineText = document.lineAt(currentLineNumber).text;

  const startIndex = currentLineText.indexOf('{');
  const endIndex = currentLineText.indexOf('}')

  if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
    return {
      startLine,
      endLine
    }
  }

  if (currentLineText.includes('{')) {
    // Search downwards for the closing brace '}'
    let openBrackets = 1;
    for (let i = cursorPosition.line + 1; i < lineCount; i++) {
      const lineText = document.lineAt(i).text;
      openBrackets += getCharCount(lineText, '{');
      openBrackets -= getCharCount(lineText, '}');
      if (openBrackets === 0) {
        endLine = i;
        break;
      }
    }
  } else if (currentLineText.includes('}')) {
    // Search upwards for the opening brace '{'
    for (let i = currentLineNumber - 1; i >= 0; i--) {
      if (i === -1) break;

      const lineText = document.lineAt(i).text;
      if (lineText.includes('{') && !lineText.includes('}')) {
        startLine = i;
        break;
      }
    }
  }

  return {
    startLine,
    endLine
  };
}

function calcBlockRange(editor, document) {
  const cursorPosition = editor.selection.active;
  const lineNum = cursorPosition.line;
  const lineRange = document.lineAt(lineNum).range;
  const lineText = document.getText(lineRange)
  const canProcess = (lineText.match(/[{}]/g) || [])?.length > 0;
  if (!canProcess) {
    vscode.window.showErrorMessage('No opening or closing bracket in this line');
    return
  }

  const {
    startLine,
    endLine
  } = getBlockRange(document, cursorPosition);
  // Return the range from the start of the opening brace to the end of the closing brace
  const start = new vscode.Position(startLine, 0);
  const end = new vscode.Position(endLine, document.lineAt(endLine).range.end.character);
  const blockRange = new vscode.Range(start, end);
  return blockRange;
}