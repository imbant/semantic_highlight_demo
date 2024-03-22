Compare the behavior of [semantic highlighting](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#semanticTokens_rangeRequest) on the VS Code API (language client) and the LSP-based language server

## Phenomenon:

For the semantic highlighting provided by the language client, when the order of the semantic tokens is inconsistent with the order of the tokens in the character stream, it can be highlighted correctly.

In the language server(implemented by Node.js based on the `vscode-languageserver/node` npm package), when the order is inconsistent, the highlighting is incorrect, and only tokens in increasing order are highlighted.
![image](https://github.com/imbant/semantic_highlight_demo/assets/17983739/12c64792-0de6-441e-9d19-4ee7c6a30463)


The code for providing semantic tokens between the [language server](https://github.com/imbant/semantic_highlight_demo/blob/56c74f7b6ce0e1a0c46a0a623b07fe7203f55b27/server/src/server.ts#L39-L46) and the [client](https://github.com/imbant/semantic_highlight_demo/blob/56c74f7b6ce0e1a0c46a0a623b07fe7203f55b27/client/src/extension.ts#L74-L81) is almost exactly the same.
![image](https://github.com/imbant/semantic_highlight_demo/assets/17983739/d1f42ad0-b5f7-4bf1-98fe-ce2e32a2dd00)


## doubt:

No requirement for the order of semantic tokens was found in the [LSP documentation](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/).
Is this a requirement for LSP? Or is it a bug in the `vscode-languageserver/node` npm package?

## Running the Sample

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to start compiling the client and server in [watch mode](https://code.visualstudio.com/docs/editor/tasks#:~:text=The%20first%20entry%20executes,the%20HelloWorld.js%20file.).
- Switch to the Run and Debug View in the Sidebar (Ctrl+Shift+D).
- Select `Launch Client` from the drop down (if it is not already).
- Press ▷ to run the launch config (F5).
- If you want to debug the server as well, use the launch configuration `Attach to Server`
- In the [Extension Development Host](https://code.visualstudio.com/api/get-started/your-first-extension#:~:text=Then%2C%20inside%20the%20editor%2C%20press%20F5.%20This%20will%20compile%20and%20run%20the%20extension%20in%20a%20new%20Extension%20Development%20Host%20window.) instance of VSCode
  - Open the `example` folder on this project's root.
  - Open `.clientHighlight` and `.serverHighlight`

## Structure

```
.
├── client // Language Client
│   ├── src
│   │   └── extension.ts // Language Client entry point
├── package.json // The extension manifest.
└── server // Language Server
    └── src
        └── server.ts // Language Server entry point
```
