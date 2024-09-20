import * as vscode from 'vscode';

export function registerEditMarkdownCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.editMarkdown', (range: vscode.Range) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            const document = editor.document;
            const start = range.start.line;
            let end = start + 1;

            // Find the end of the markdown cell
            while (end < document.lineCount) {
                const line = document.lineAt(end);
                if (line.text.trim() === '*/') {
                    break;
                }
                end++;
            }

            const markdownRange = new vscode.Range(start, 0, end, 0);
            const markdownContent = document.getText(markdownRange);

            // Open a new untitled document with the markdown content
            vscode.workspace.openTextDocument({ content: markdownContent, language: 'markdown' })
                .then(doc => vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside));
        })
    );
}