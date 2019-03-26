// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed



export function activate(context: vscode.ExtensionContext) {
	try {
		init(context);
	} catch (e) {
		console.info(e);
	}
}

let saveHandler: vscode.Disposable;

function init(context: vscode.ExtensionContext) {

	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => console.log("Did save."));
	vscode.workspace.onWillSaveTextDocument(() => console.log("Will save..."));


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension is alive.');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand('kie.submarine', (uri: vscode.Uri) => {

		// The code you place here will be executed every time your command is executed
		console.info("Opened: " + uri);
		const split = uri.path.split("/");

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'kie-submarine', // Identifies the type of the webview. Used internally
			"KIE:: " + split[split.length - 1], // Title of the panel displayed to the user
			{ viewColumn: vscode.ViewColumn.One, preserveFocus: true }, // Editor column to show the new webview panel in.
			{ enableCommandUris: true } // Webview options. More on these later.
		);

		console.info(`OPEN: registerig save handler for ${uri}`);
		saveHandler = vscode.commands.registerCommand("workbench.action.files.save", () => {
			console.info(`Saving ${uri}`);
		});

		panel.onDidDispose(() => {
			try {
				saveHandler.dispose();
			} catch(e) {
				console.info("Exception on dispose");
			}
		});

		panel.onDidChangeViewState(() => {
			console.info(`Changed state: ${panel.title} -> ${panel.active}`);
			if (panel.active) {
				try {
					saveHandler.dispose();
				} catch(e) {
					console.info("Exception before registering");
				}

				console.info(`CHANGE: registerig save handler for ${uri}`);
				saveHandler = vscode.commands.registerCommand("workbench.action.files.save", () => {
					console.info(`Saving ${uri}`);
				});
			} else {
				try {
					saveHandler.dispose();
				} catch(e) {
					console.info("Exception on not active anymore.");
				}
			}
		});

		vscode.workspace.openTextDocument(uri).then((document) => {
			let source = document.getText();
			panel.webview.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Cat Coding</title>
			</head>
			<body>
					<textarea id="code">${source}</textarea>
			</body>
			</html>`;
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
