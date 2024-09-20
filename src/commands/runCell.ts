import * as vscode from 'vscode';
import { cellExecutionEventEmitter } from '../extension';

export function registerRunCellCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.runCell', (range: vscode.Range) => {
            console.log('extension.runCell command triggered');
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                
                // 전체 셀 내용을 가져오기 위해 범위를 확장합니다
                let startLine = range.start.line;
                let endLine = range.end.line;
                
                // 셀의 시작 부분 찾기
                while (startLine > 0 && !document.lineAt(startLine - 1).text.includes('// note') && !document.lineAt(startLine - 1).text.includes('/** markdown')) {
                    startLine--;
                }
                
                // 셀의 끝 부분 찾기
                while (endLine < document.lineCount - 1 && !document.lineAt(endLine + 1).text.includes('// note') && !document.lineAt(endLine + 1).text.includes('/** markdown')) {
                    endLine++;
                }
                
                const cellRange = new vscode.Range(startLine, 0, endLine, document.lineAt(endLine).text.length);
                const cellContent = document.getText(cellRange);
                
                console.log('Cell Content:', cellContent);  // 디버깅을 위한 로그
                
                // 이벤트 발생
                cellExecutionEventEmitter.fire({range: cellRange, content: cellContent});
                
                vscode.window.showInformationMessage('Cell execution triggered');
            }
        })
    );
}