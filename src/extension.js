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

function switchLine() {
  // function switchLine (editor, edit) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const document = editor.document;
    const selection = editor.selection;

    if (document.getText(selection)) {
      const text = document.getText(selection);
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, formatText(text, false));
      });
    }

    const cursorPosition = editor.selection.active;
    const lineNum = cursorPosition.line;
    const lineRange = document.lineAt(lineNum).range;
    const lineText = document.getText(lineRange)
    // const canProcess = (lineText.match(/[{}()]/g) || [])?.length > 0;
    const canProcess = (lineText.match(/[{}]/g) || [])?.length > 0;
    if (!canProcess) {
      return
    }

    const {
      startLine,
      endLine
    } = getBlockRange(document, cursorPosition);
    const isSingleLine = startLine === endLine;
    // Return the range from the start of the opening brace to the end of the closing brace
    const start = new vscode.Position(startLine, 0);
    const end = new vscode.Position(endLine, document.lineAt(endLine).range.end.character);
    const blockRange = new vscode.Range(start, end);
    if (document.getText(blockRange)) {
      const text = document.getText(blockRange);
      vscode.window.showInformationMessage(text);
      console.log(text)
      editor.edit((editBuilder) => {
        editBuilder.replace(blockRange, formatText(text, isSingleLine));
      });
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

function getCharCount(lineText, char) {
  const escapedChar = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escapedChar, 'g');
  return (lineText.match(regex) || []).length;
}
