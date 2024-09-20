import * as vscode from 'vscode';

export class TypeScriptCellFoldingRangeProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(
        document: vscode.TextDocument,
        context: vscode.FoldingContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.FoldingRange[]> {
        const ranges: vscode.FoldingRange[] = [];
        const text = document.getText();
        const cellRegex = /(?:\/\/ note|\/\*\* markdown)/g;
        let startLine = -1;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            if (cellRegex.test(line.text)) {
                if (startLine !== -1) {
                    ranges.push(new vscode.FoldingRange(startLine, i - 1));
                }
                startLine = i;
            }
        }

        // 마지막 셀 처리
        if (startLine !== -1) {
            ranges.push(new vscode.FoldingRange(startLine, document.lineCount - 1));
        }

        return ranges;
    }
}