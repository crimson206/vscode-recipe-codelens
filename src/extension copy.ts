import * as vscode from 'vscode';
import { TypeScriptCellCodeLensProvider } from './providers/TypeScriptCellCodeLensProvider';
import { TypeScriptCellFoldingRangeProvider } from './providers/TypeScriptCellFoldingRangeProvider';
import { registerShowMenuCommand } from './commands/showMenu';
import { registerEditMarkdownCommand } from './commands/editMarkdown';

export function activate(context: vscode.ExtensionContext) {
    const provider = new TypeScriptCellCodeLensProvider();

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            [
                { scheme: 'file', language: 'javascript' },
                { scheme: 'file', language: 'javascriptreact' },
                { scheme: 'file', language: 'typescript' },
                { scheme: 'file', language: 'typescriptreact' }
            ],
            provider
        )
    );

    vscode.languages.registerFoldingRangeProvider(
        [
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'javascriptreact' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'typescriptreact' }
        ],
        new TypeScriptCellFoldingRangeProvider()
    );

    if (vscode.window.activeTextEditor) {
        provider.updateDecorations(vscode.window.activeTextEditor);
    }
    
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                provider.updateDecorations(editor);
            }
        })
    );
    
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
                provider.updateDecorations(vscode.window.activeTextEditor);
            }
        })
    );

    registerShowMenuCommand(context, provider);
    registerEditMarkdownCommand(context);
}