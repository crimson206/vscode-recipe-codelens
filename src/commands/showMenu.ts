import * as vscode from 'vscode';
import { selectedOptions } from '../utils/selectedOptions';
import { TypeScriptCellCodeLensProvider } from '../providers/TypeScriptCellCodeLensProvider';

export function registerShowMenuCommand(context: vscode.ExtensionContext, provider: TypeScriptCellCodeLensProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.showMenu', (range: vscode.Range) => {
            const items: vscode.QuickPickItem[] = [
                { label: 'Option 1', description: 'First option' },
                { label: 'Option 2', description: 'Second option' },
                { label: 'Option 3', description: 'Third option' }
            ];
            vscode.window.showQuickPick(items).then(selection => {
                if (!selection) { return; }
                const key = `${range.start.line},${range.start.character}`;
                selectedOptions.set(key, selection.label);
                provider._onDidChangeCodeLenses.fire();
            });
        })
    );
}