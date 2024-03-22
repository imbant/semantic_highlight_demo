import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	useServerHighlight(context);

	useClientHighlight(context);
}

function useServerHighlight(context: ExtensionContext) {
	const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions,
		},
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'serverHighlight' }],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
		},
	};

	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	client.start();
}

function useClientHighlight(context: ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerDocumentRangeSemanticTokensProvider(
			{ language: 'clientHighlight' },
			new DocumentRangeSemanticTokensProvider(),
			{
				tokenTypes: ['comment', 'string', 'keyword'],
				tokenModifiers: [],
			}
		)
	);
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

class DocumentRangeSemanticTokensProvider
	implements vscode.DocumentRangeSemanticTokensProvider
{
	provideDocumentRangeSemanticTokens() {
		const builder = new vscode.SemanticTokensBuilder();
		// comment
		builder.push(1, 5, 7, 0);
		// keyword
		builder.push(1, 24, 7, 2);
		// string, before keyword, not in increasing order
		builder.push(1, 15, 6, 1);
		return builder.build();
	}
}
