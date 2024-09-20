import * as vscode from 'vscode';
import { TypeScriptCellCodeLensProvider } from './providers/TypeScriptCellCodeLensProvider';
import { TypeScriptCellFoldingRangeProvider } from './providers/TypeScriptCellFoldingRangeProvider';
import { registerShowMenuCommand } from './commands/showMenu';
import { registerEditMarkdownCommand } from './commands/editMarkdown';
import { registerRunCellCommand } from './commands/runCell';

// 새로운 이벤트 이미터 생성
export const cellExecutionEventEmitter = new vscode.EventEmitter<{range: vscode.Range, content: string}>();

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
    registerRunCellCommand(context);

    // 이벤트 리스너 예시 (실제로는 로컬 머신에서 이 이벤트를 구독해야 합니다)
    cellExecutionEventEmitter.event(({range, content}) => {
        console.log(`Cell executed. Range: ${range.start.line}-${range.end.line}, Content: ${content}`);
        // 여기에서 로컬 머신으로 데이터를 전송하는 로직을 구현할 수 있습니다.
    });

    console.log('Extension activated and commands registered');
}

export function deactivate() {}