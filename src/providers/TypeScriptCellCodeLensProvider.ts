import * as vscode from 'vscode';
import { selectedOptions } from '../utils/selectedOptions';

export class TypeScriptCellCodeLensProvider implements vscode.CodeLensProvider {
    private decorationType: vscode.TextEditorDecorationType;
    public _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        this.decorationType = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: new vscode.ThemeColor('editor.lineHighlightBackground'),
            after: {
                contentText: '─'.repeat(200),
                color: new vscode.ThemeColor('editorLineNumber.foreground'),
            }
        });
    }

    provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const cellRegex = /(?:\/\/ note|\/\*\* markdown)/g;
        let match;
    
        while (match = cellRegex.exec(text)) {
            const line = document.lineAt(document.positionAt(match.index).line);
            const range = new vscode.Range(line.range.start, line.range.end);
            const key = `${range.start.line},${range.start.character}`;
            const selectedOption = selectedOptions.get(key) || 'Select Option';
            const isMarkdown = match[0] === '/** markdown';
    
            codeLenses.push(
                new vscode.CodeLens(range, {
                    title: `📋 Menu: ${selectedOption}`,
                    command: "extension.showMenu",
                    arguments: [range]
                }),
                new vscode.CodeLens(range, {
                    title: isMarkdown ? "📝 Edit Markdown" : "▶️ Run",
                    command: isMarkdown ? "extension.editMarkdown" : "extension.runCell",
                    arguments: [range]
                }),
                new vscode.CodeLens(range, {
                    title: "🔽 Fold",
                    command: "editor.fold",
                    arguments: [{selectionLines: [line.lineNumber]}]
                })
            );
        }
    
        return codeLenses;
    }

    public updateDecorations(editor: vscode.TextEditor) {
        const document = editor.document;
        const decorations: vscode.DecorationOptions[] = [];
    
        const text = document.getText();
        const cellRegex = /(?:\/\/ note|\/\*\* markdown)/g;
        let match;
    
        while (match = cellRegex.exec(text)) {
            const line = document.lineAt(document.positionAt(match.index).line);
            decorations.push({ range: line.range });
        }
    
        editor.setDecorations(this.decorationType, decorations);
    }
}