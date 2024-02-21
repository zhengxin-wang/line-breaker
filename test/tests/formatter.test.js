const vscode = require('vscode');
const assert = require('assert');
const myExtension = require('../../src/extension');
const { openFile } = require('../utils');
const { formatText } = require('../../src/lib/formatter');
const { calcBlockRange } = require('../../src/lib/range');

const mockContext = {
  subscriptions: [],
  workspaceState: { /* ... */ },
  globalState: { /* ... */ },
  extensionPath: '',
  // ... other properties and methods from ExtensionContext if needed
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

suite('Extension Test Suite', () => {
  suiteSetup(() => {
    myExtension.activate(mockContext);
  });
  
  suiteTeardown(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test('Process multi line object', async function() {
    const { editor } = await openFile('multi-line-object.js');
    // Now the document is shown in the editor, you can add more assertions to test the extension's behavior
    const text = editor.document.getText();
    assert.strictEqual(text.includes('object'), true, 'File content does not match expected content');

    const position = new vscode.Position(0, 0);
    editor.selection = new vscode.Selection(position, position);
    editor.revealRange(new vscode.Range(position, position));

    const range = calcBlockRange(editor, editor.document);
    const result = formatText(editor.document, range);
    const expected = editor.document.lineAt(7).text;
    assert.strictEqual(result, expected, 'File content does not match expected content');
  });
});