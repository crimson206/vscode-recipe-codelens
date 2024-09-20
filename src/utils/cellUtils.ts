import * as vscode from 'vscode';

export interface CellType {
    name: string;
    startRegex: RegExp;
    endRegex: RegExp;
}

export const cellTypes: CellType[] = [
    {
        name: 'note',
        startRegex: /\/\/ note/,
        endRegex: /(?=\/\/ note|\/\*\* markdown|\Z)/
    },
    {
        name: 'markdown',
        startRegex: /\/\*\* markdown/,
        endRegex: /\*\//
    }
];

export const cellStartRegex = new RegExp(cellTypes.map(type => type.startRegex.source).join('|'));

export function findCellRange(document: vscode.TextDocument, line: number): vscode.Range {
    let startLine = line;
    let endLine = line;

    // Find the start of the cell
    while (startLine > 0 && !cellStartRegex.test(document.lineAt(startLine - 1).text)) {
        startLine--;
    }

    // Find the end of the cell
    const cellType = cellTypes.find(type => type.startRegex.test(document.lineAt(startLine).text));
    if (cellType) {
        while (endLine < document.lineCount - 1) {
            if (cellType.endRegex.test(document.lineAt(endLine + 1).text)) {
                endLine++;
                break;
            }
            if (cellStartRegex.test(document.lineAt(endLine + 1).text)) {
                break;
            }
            endLine++;
        }
    }

    return new vscode.Range(startLine, 0, endLine, document.lineAt(endLine).text.length);
}

export function getCellType(line: string): string | undefined {
    const cellType = cellTypes.find(type => type.startRegex.test(line));
    return cellType?.name;
}