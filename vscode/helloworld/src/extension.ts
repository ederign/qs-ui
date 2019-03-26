// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed



export function activate(context: vscode.ExtensionContext) {
	try {
		init(context);

		var eder = vscode.commands.registerCommand('workbench.action.files.save', function () {
			console.info(`Saving KIE EDITOR` + new Date());
			if (!openURI || openURI.length <= 0) {
				console.log(`no url`);
			}
			else {
				console.log(`current url ` + openURI);
				console.log(`>>> ${activePanel}`);
				activePanel!.webview.postMessage({ type: "GET_CONTENT" });
			}
			let editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}
			else {
				editor.document.save();
			}
			return Promise.resolve();

		});
		context.subscriptions.push(eder);
	} catch (e) {
		console.info(e);
	}
}

let saveHandler: vscode.Disposable;
let openURI: string;
let activePanel: vscode.WebviewPanel | undefined;

function init(context: vscode.ExtensionContext) {

	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => console.log("Did save."));
	vscode.workspace.onWillSaveTextDocument(() => console.log("Will save..."));


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension is alive.');



	// saveHandler = vscode.commands.registerCommand("workbench.action.files.save", () => {
	// console.info(`Saving KIE EDITOR`);
	// if(!openURI||openURI.length <= 0){
	// 	console.log(`no url`);
	// }
	// else{
	// 	console.log(`current url `+ openURI);
	// }
	// let editor = vscode.window.activeTextEditor;
	// if (!editor) {
	// 	return;
	// }
	// else{
	// 	editor.document.save();
	// }
	// });

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand('kie.submarine', (uri: vscode.Uri) => {

		// The code you place here will be executed every time your command is executed
		console.info("Opened: " + uri);
		openURI = uri.fsPath;
		console.log("." + openURI);
		const split = uri.path.split("/");

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
			'kie-submarine', // Identifies the type of the webview. Used internally
			"KIE:: " + split[split.length - 1], // Title of the panel displayed to the user
			{ viewColumn: vscode.ViewColumn.One, preserveFocus: true }, // Editor column to show the new webview panel in.
			{ enableCommandUris: true, enableScripts: true, retainContextWhenHidden: true } // Webview options. More on these later.
		);

		activePanel = panel;

		panel.webview.onDidReceiveMessage(
			message => {
				console.info('message received from webview');
			    switch (message.type) {
					case 'CONTENT':
						console.info(`Effectivelly saved WebView on: ${uri.path}`); //Do saving operation for open WebViews
				    	fs.writeFileSync(uri.path, message.content);
				     	console.log("Content saved: " + message.content);
				    	return;
		        }
			},
			undefined,
			context.subscriptions
		);

		// vscode.commands.registerCommand('workbench.action.files.save', () => {
		// console.info(`Saving KIE EDITOR`);
		// return Promise.resolve();
		// if(!openURI||openURI.length <= 0){
		// 	console.log(`no url`);
		// }
		// else{
		// 	console.log(`current url `+ openURI);
		// }
		// let editor = vscode.window.activeTextEditor;
		// if (!editor) {
		// 	return;
		// }
		// else{
		// 	editor.document.save();
		// }
		// });

		console.info(`OPEN: registerig save handler for ${uri}`);

		// panel.onDidDispose(() => {
		// 	try {
		// 		console.log("on did dispose");
		// 		saveHandler.dispose();
		// 	} catch(e) {
		// 		console.info("Exception on dispose");
		// 	}
		// });

		panel.onDidChangeViewState(() => {
			console.info(`Changed state: ${panel.title} -> ${panel.active}`);
			if (panel.active) {
				console.log("activating " + panel.title);
				openURI = uri.fsPath;
				activePanel = panel;
				console.log(openURI);
			}
			else if (openURI === uri.fsPath) {
				openURI = "";
				activePanel = undefined;
			}
		});

		vscode.workspace.openTextDocument(uri).then((document) => {
			let source = document.getText();
			panel.webview.html = `<!DOCTYPE html>
			<html lang="en">
				<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>KIE Editor</title>
				</head>
				<body>
					<textarea id="source">${source}</textarea>
					<script>

						var sourceTextArea = document.getElementById("source");
						const vscode = acquireVsCodeApi();
						window.addEventListener('message', event => {
							console.log(event);
							const message = event.data; // The JSON data our extension sent

							switch (message.type) {
								case 'GET_CONTENT':
									var content = sourceTextArea.value; // Replace to get actual editor content
									vscode.postMessage({
										type: "CONTENT",
										content: content
									});
									break;
							}
						});
					</script>
				</body>
			</html>`;
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
