import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	TextDocumentSyncKind,
	InitializeResult,
	SemanticTokensBuilder,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
	const result: InitializeResult = {
		capabilities: {
			semanticTokensProvider: {
				full: false,
				range: true,
				legend: {
					tokenTypes: ['comment', 'string', 'keyword'],
					tokenModifiers: [],
				},
			},
		},
	};

	return result;
});

documents.listen(connection);

connection.listen();

connection.languages.semanticTokens.onRange(() => {
	const builder = new SemanticTokensBuilder();
	// comment
	builder.push(1, 5, 7, 0, 0);
	// keyword
	builder.push(1, 24, 7, 2, 0);
	// string, before keyword, not in increasing order
	builder.push(1, 15, 6, 1, 0);
	return builder.build();
});
