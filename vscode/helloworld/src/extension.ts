// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	vscode.commands.registerCommand("exampleTreeView.selectNode", (item:vscode.TreeItem) => {
		console.log(item.label);
});
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		console.log("YAY");
	});

	function listen() { console.log("yo"); }

	vscode.workspace.onWillSaveTextDocument(listen);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand('extension.helloWorld', (uri:vscode.Uri) => {
		// The code you place here will be executed every time your command is executed


		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'catCoding', // Identifies the type of the webview. Used internally
			'Cat Coding', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{} // Webview options. More on these later.
		);

		// Display a message box to the user
		vscode.window.showInformationMessage('Dora: ' + uri.fsPath);
		vscode.workspace.openTextDocument(uri).then((document) => {
			let text = document.getText();

			// And set its HTML content
			panel.webview.html = getWebviewContent(text);
		});

		function getWebviewContent(code: string) {
			return `<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Cat Coding</title>
		</head>
		<body>
				<textarea id="code">${code}</textarea>
		</body>
		</html>`;
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
