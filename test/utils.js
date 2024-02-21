const vscode = require('vscode');
const path = require('path');
const assert = require('assert');

module.exports= {
  openFile
}

async function openFile (filename) {
   // Construct the path to the file you want to open
   const testFilePath = path.join(__dirname, 'files', filename);
    
   // Use the VS Code API to open the text document
   const document = await vscode.workspace.openTextDocument(testFilePath);
   assert.ok(document, 'Document not found');
   
   // Use the VS Code API to show the document in the editor
   const editor = await vscode.window.showTextDocument(document);
   assert.ok(editor, 'Editor not opened');

   return {
     document,
     editor
   }
}