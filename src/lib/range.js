
const vscode = require("vscode");
const {
  INVALID_LINE_ERROR,
  NOT_PAIRED_ERROR
} = require('./consts');

module.exports = {
  calcBlockRange
};

const openChar = '{';
const closeChar = '}';

function findTargetIndex(str, char, counterChar, openBrackets) {
  let count = openBrackets;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++;
    } else if (str[i] === counterChar) {
      count--;
      if (count === 0) {
        return {
          targetIndex: i,
          openBrackets: 0
        };
      }
    }
  }

  // If the closing brace was not found, return -1
  return {
    targetIndex: -1,
    openBrackets: count
  }
}

function findLastTargetIndex(str, char, counterChar, openBrackets) {
  let count = openBrackets;
  for (let i = str.length - 1; i >= 0 ; i--) {
    if (str[i] === char) {
      count++;
    } else if (str[i] === counterChar) {
      count--;
      if (count === 0) {
        return {
          targetIndex: i,
          openBrackets: 0
        };
      }
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
    // Take the first close char in the current line as the end of the range.
    let openBrackets = 1;
    for (let i = currentLineNumber - 1; i >= 0; i--) {
      if (i === -1) break;
      const lineText = document.lineAt(i).text;
      const {
        targetIndex,
        openBrackets: newOpenBrackets
      } = findLastTargetIndex(lineText, closeChar, openChar, openBrackets);
      if (targetIndex >= 0) {
        startLine = i;
        openIndex = targetIndex;
        break;
      } else {
        openBrackets = newOpenBrackets;
      }
    }
  }

  if (openIndex < 0 || closeIndex < 0) {
    throw new Error(NOT_PAIRED_ERROR);
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
    throw new Error(INVALID_LINE_ERROR);
  }

  return getBlockRange(document, cursorPosition);
}