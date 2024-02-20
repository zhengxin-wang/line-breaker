const vscode = require("vscode");

module.exports = {
  activate
};

function activate(context) {
  const commandID = "extension.lineBreaker";

  const disposable = vscode.commands.registerCommand(
    commandID,
    switchLine
  );

  context.subscriptions.push(disposable);
}

function processRange(editor, document, range) {
  if (document.getText(range)) {
    const text = document.getText(range);
    const isSingleLine = range.start.line === range.end.line;
    editor.edit((editBuilder) => {
      editBuilder.replace(range, formatText(text, isSingleLine));
      vscode.window.showInformationMessage('Switched to ' + (isSingleLine ? 'multi line' : 'single line'));
    });
  }
}


function switchLine() {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    if (document.getText(selection)) {
      processRange(editor, document, selection);
      return
    }

    const blockRange = calcBlockRange(editor, document);
    if (blockRange) {
      processRange(editor, document, blockRange);
    }
  }
}

function formatText(text, isSingleLine) {
  if (isSingleLine) {
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
    return text.replace(/{\s*[\r\n\t]+(.*?)\s*[\r\n\t]+\s*}/gs, (_, inner) => {
      const innerWithoutExtraWhitespace = inner.replace(/[\r\n\t]+/g, ' ');
      const wellSpacedInner = innerWithoutExtraWhitespace.replace(/\s\s+/g, ' ');
      return `{ ${wellSpacedInner.trim()} }`;
    });
  }
}

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
    const openBracket = 1;
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

function getCharCount(lineText, char) {
  const escapedChar = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escapedChar, 'g');
  return (lineText.match(regex) || []).length;
}
