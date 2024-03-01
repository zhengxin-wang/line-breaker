
const vscode = require("vscode");
const { getCharCount } = require('./utils');

module.exports = {
  calcBlockRange
};

const openChar = '{';
const closeChar = '}';

function nthIndexOfChar(str, char, n) {
  if (n <= 0) {
    return -1
  }

  let count = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++;
      if (count === n) {
        return i;
      }
    }
  }

  return -1; // Return -1 if the n-th closing brace was not found
}

function lastNthIndexOfChar(str, char, n) {
  if (n <= 0) {
    return -1
  }

  let count = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] === char) {
      count++;
      if (count === n) {
        return i;
      }
    }
  }

  return -1; // Return -1 if the n-th closing brace was not found
}

function findTargetIndex(str, char, counterChar, openBrackets) {
  let count = openBrackets;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === counterChar) {
      count--;
      if (count === 0) {
        return {
          targetIndex: i,
          openBrackets: 0
        };
      }
    } else if (str[i] === char) {
      count++;
    }
  }

  // If the closing brace was not found, return -1
  return {
    targetIndex: -1,
    openBrackets: count
  }
}

function getBlockRange(document, cursorPosition) {
  const currentLineNumber = cursorPosition.line;
  const currentLineText = document.lineAt(currentLineNumber).text;
  const lineCount = document.lineCount;
  let startLine = currentLineNumber;
  let endLine = currentLineNumber;

  let openIndex = currentLineText.indexOf(openChar);
  let closeIndex = currentLineText.indexOf(closeChar)
  if (openIndex >= 0 && (openIndex < closeIndex || closeIndex < 0)) {
    // search downwards
    let openBrackets = 0;
    for (let i = currentLineNumber; i < lineCount; i++) {
      const lineText = document.lineAt(i).text;
      const {
        targetIndex,
        openBrackets: newOpenBrackets
      } = findTargetIndex(lineText, openChar, closeChar, openBrackets);
      if (targetIndex >= 0) {
        endLine = i;
        closeIndex = targetIndex;
        break;
      } else {
        openBrackets = newOpenBrackets;
      }
    }
  } else {
    // search upwards
    let openBrackets = 1;
    for (let i = currentLineNumber - 1; i >= 0; i--) {
      if (i === -1) break;

      let lineText = document.lineAt(i).text;

      openBrackets -= getCharCount(lineText, openChar);
      if (openBrackets <= 0) {
        startLine = i;
        openIndex = nthIndexOfChar(lineText, openChar, 1 - openBrackets);
        break;
      }
      openBrackets += getCharCount(lineText, closeChar);
    }
  }

  // Return the range from the start of the opening brace to the end of the closing brace
  const start = new vscode.Position(startLine, openIndex);
  const end = new vscode.Position(endLine, closeIndex + 1);

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