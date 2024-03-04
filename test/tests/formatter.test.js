const vscode = require('vscode');
const assert = require('assert');
const myExtension = require('../../src/extension');
const { openFile } = require('../utils');
const { formatText } = require('../../src/lib/formatter');
const { calcBlockRange } = require('../../src/lib/range');
const { NOT_PAIRED_ERROR, INVALID_LINE_ERROR } = require('../../src/lib/consts');

const mockContext = {
  subscriptions: [],
  workspaceState: { /* ... */ },
  globalState: { /* ... */ },
  extensionPath: '',
  // ... other properties and methods from ExtensionContext if needed
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getTargetRangeFromFile = async (filepath, currentLineNumber = 0) => {
  const { editor } = await openFile(filepath);
  // Now the document is shown in the editor, you can add more assertions to test the extension's behavior
  const text = editor.document.getText();
  assert.strictEqual(text.length > 0, true, 'File is not correctly opened or is empty.');

  const position = new vscode.Position(currentLineNumber, 0);
  editor.selection = new vscode.Selection(position, position);
  editor.revealRange(new vscode.Range(position, position));

  const range = calcBlockRange(editor, editor.document);
  return {
    editor, 
    range
  }
}

const getTextFromLines = (document, startLine, endLine) => {
  const start = new vscode.Position(startLine, 0);
  const end = new vscode.Position(endLine, document.lineAt(endLine).range.end.character);
  const expectedRange = new vscode.Range(start, end);
  return document.getText(expectedRange);
}

suite('Extension Test Suite', () => {
  suiteSetup(() => {
    myExtension.activate(mockContext);
  });

  suiteTeardown(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  test('Not paired object should throw error', async function () {
    const cursorLine = 7;

    try {
      await getTargetRangeFromFile('error-case.js', cursorLine);
    } catch (err) {
      assert.strictEqual(err.message, NOT_PAIRED_ERROR);
    }
  });

  test('Cursor line doesn\'t contain brackets should throw error', async function () {
    const cursorLine = 14;

    try {
       await getTargetRangeFromFile('error-case.js', cursorLine);
    } catch (err) {
      assert.strictEqual(err.message, INVALID_LINE_ERROR);
    }
  });

  test('Process multi line object', async function () {
    const { editor, range } = await getTargetRangeFromFile('multi-line-object.js');
    const result = formatText(editor.document, range);
    const expectedLine = 7;
    const expected = editor.document.lineAt(expectedLine).text;
    assert.strictEqual(result, expected, 'File content does not match expected content');
  });

  test('Process multi line function params', async function () {
    const cursorLine = 14;
    const { editor, range } = await getTargetRangeFromFile('multi-line-object.js', cursorLine);
    const result = formatText(editor.document, range);
    const expectedLine = 19;
    const expected = editor.document.lineAt(expectedLine).text;
    assert.strictEqual(result, expected, 'File content does not match expected content');
  });

  test('Process nested multi line object', async function () {
    const cursorLine = 22;
    const { editor, range } = await getTargetRangeFromFile('multi-line-object.js', cursorLine);
    const result = formatText(editor.document, range);
    const expectedLine = 34;
    const expected = editor.document.lineAt(expectedLine).text;
    assert.strictEqual(result, expected, 'File content does not match expected content');
  });

  test('Process single line object', async function () {
    const { editor, range } = await getTargetRangeFromFile('single-line-object.js');
    const result = formatText(editor.document, range);
    const startLine = 3;
    const endLine = 7;
    const expected = getTextFromLines(editor.document, startLine, endLine);
    assert.strictEqual(result, expected, 'File content does not match expected content');
  });

  test('Process single line function params', async function () {
    const cursorLine = 10;
    const { editor, range } = await getTargetRangeFromFile('single-line-object.js', cursorLine);
    const result = formatText(editor.document, range);
    const startLine = 15;
    const endLine = 19;
    const expected = getTextFromLines(editor.document, startLine, endLine);
    assert.strictEqual(result, expected, 'File content does not match expected content');
  });

  test('Process nested single line object', async function () {
    const cursorLine = 22;
    const { editor, range } = await getTargetRangeFromFile('single-line-object.js', cursorLine);
    const result = formatText(editor.document, range);
    const startLine = 25;
    const endLine = 34;
    const expected = getTextFromLines(editor.document, startLine, endLine);
    assert.strictEqual(result, expected, 'File content does not match expected content');
  });
});