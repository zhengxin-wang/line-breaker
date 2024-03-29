const vscode = require("vscode");
const { formatText } = require('./lib/formatter');
const { calcBlockRange } = require('./lib/range');

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
    editor.edit((editBuilder) => {
      editBuilder.replace(range, formatText(document, range));
    });
    vscode.window.showInformationMessage('Switched to ' + (range.isSingleLine ? 'multi line' : 'single line'));
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

    try {
      const blockRange = calcBlockRange(editor, document);
      if (blockRange) {
        processRange(editor, document, blockRange);
      }
    } catch (err) {
      vscode.window.showErrorMessage(err.message);
    }
  }
}
