# Line breaker

- This line-breaker is a VS code extension that would switch between single and multi line format for texts with brackets.
- User can switch format by 
  - hot key: Ctrl + Alt + L 
  - or type Command + P to open VS Code Command Palette and input >switch between... then click to execute.


### Single line format
```
 return { a: 'a', b: true }; 
```
### Muli line format 
```
  return {
    a: 'a',
    b: true
  }; 
```


## Running & Debugging the Extension

- Run `npm install` on the command-line to install the dev dependencies.
- Press <kbd>F5</kbd> to run the "Launch Extension" Debug Configuration. This will run the extension in a new VS Code window.
- Select the command "switch between..." from the Command Palette (Or just press the hot key <kbd>Ctrl+Shift+L</kbd>).

## Packing the Extension
1. Install vsce: If you haven't already installed vsce, you can do so by running the following command in your terminal:

```bash
npm install -g vsce
```

2. Navigate to Your Extension's Directory: Change directories in your terminal to the root of your extension project where the package.json file is located.

```bash
cd path/to/your/extension
```
3. Package Your Extension: Run the vsce package command to create the .vsix file:

```bash
vsce package
```

This will generate a .vsix file in the current directory. The filename will typically be a combination of your extension's name and version, as specified in the package.json file, like my-extension-0.0.1.vsix.

4. Check the Output: You should see an output like this if the packaging is successful:
```
Created: /path/to/your/extension/my-extension-0.0.1.vsix (1234 files, 10.56MB)
```

5. Verify the VSIX Package: You can verify the contents and structure of the .vsix package by changing its extension to .zip and extracting it like a standard zip file.

Keep in mind that the vsce package command will perform some validation checks and may throw errors if there are issues found with your extension's metadata or files. If you encounter any errors, consult the output messages for guidance on what needs to be fixed before proceeding.

6. Installing the Packaged Extension in VS Code

To manually install the .vsix file in VS Code, follow these steps:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window, or by pressing Ctrl+Shift+X.
3. Click the ... at the top-right of the Extensions view to open the More Actions menu.
4. Select Install from VSIX....
5. Navigate to the .vsix file you generated and select it.
6. Once the installation is complete, you'll be able to use the extension like any other installed extension in VS Code.
