import * as vscode from 'vscode';


const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const config = vscode.workspace.getConfiguration("gouvernail");

const gouvernailnsp = {
	engine: config.get("engine"),
	token: config.get("token"),
	max_tokens: config.get("maxTokens"),
	min_time: config.get("requestInterval") as number,
	auto_trigger: config.get("autoTriggerCompletion")
}

let content = "";
let resp = "";
let corr = ["", ""];
let canReq = true;
if (gouvernailnsp.token === "") {
	vscode.window.showInformationMessage("Please consider configuring your API Key in the settings and reloading the extension to make it work.", "Open settings").then(
		selection => {
			if (selection === "Open settings") {
				vscode.commands.executeCommand("workbench.action.openSettings", "gouvernail.token");
			}
		}
	)
} else {
	var gouvernail_req = function () {
		if (content !== corr[0] && canReq) {
			console.log("sending request");
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						console.log("request done");
						resp = JSON.parse(xhr.responseText).text;
						corr = [content, resp];
						vscode.commands.executeCommand("editor.action.inlineSuggest.trigger");
					} else if (xhr.status >= 400){
						vscode.window.showErrorMessage(xhr.status + " - " + JSON.parse(xhr.responseText).error);
					}
				}
				canReq = true;


			};
			xhr.open("POST", "https://api.textsynth.com/v1/engines/" + gouvernailnsp.engine + "/completions", true);

			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Authorization", "Bearer " + gouvernailnsp.token);
			xhr.send(JSON.stringify({
				max_tokens: 50,
				prompt: content,
				top_k: 10,
				top_t: 0.8
			}));
			canReq = false;
		} else {
			console.log("no request");
		}

		vscode.commands.executeCommand("editor.action.inlineSuggest.trigger");
	};
	if (gouvernailnsp.auto_trigger){
		setInterval(gouvernail_req, gouvernailnsp.min_time);
	}
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'extension.inline-completion-settings',
		() => {
			vscode.window.showInformationMessage('Show settings');
		}
	);

	context.subscriptions.push(disposable);
	let someTrackingIdCounter = 0;

	const provider: vscode.InlineCompletionItemProvider = {
		provideInlineCompletionItems: (document, position, context, token) => {
			if (!gouvernailnsp.auto_trigger){
				gouvernail_req();
			}
			console.log('provideInlineCompletionItems triggered');
			console.log(context);
			content = document.getText(new vscode.Range(document.positionAt(0), position));
			let insertText = "";
			if (content === corr[0]) {
				insertText = resp;

			}

			return [
				{
					insertText,
					someTrackingId: someTrackingIdCounter++,
				},
			] as MyInlineCompletionItem[];

		},
	};

	vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);

}

interface MyInlineCompletionItem extends vscode.InlineCompletionItem {
	someTrackingId: number;
}
