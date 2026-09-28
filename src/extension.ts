import * as vscode from "vscode";
import { execFileSync } from "node:child_process";

const TERMINAL_NAME = "凡语言";

let runTerminal: vscode.Terminal | undefined;

function executablePath(): string {
  return vscode.workspace
    .getConfiguration("fan")
    .get<string>("executablePath", "fan");
}

function quotePath(path: string): string {
  return `"${path.replace(/"/g, '\\"')}"`;
}

function verifyExecutable(path: string): boolean {
  try {
    execFileSync(path, ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function ensureExecutable(): Promise<string | undefined> {
  const path = executablePath();
  if (verifyExecutable(path)) {
    return path;
  }
  const choice = await vscode.window.showErrorMessage(
    `未找到可用的解释器：${path}。请先安装凡语言，或在设置 fan.executablePath 中指定其路径。`,
    "打开安装文档",
    "打开设置"
  );
  if (choice === "打开设置") {
    await vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "fan.executablePath"
    );
  } else if (choice === "打开安装文档") {
    await vscode.env.openExternal(
      vscode.Uri.parse("https://china-lan-fan.github.io/guide/")
    );
  }
  return undefined;
}

function getRunTerminal(clear: boolean): vscode.Terminal {
  if (!runTerminal || runTerminal.exitStatus !== undefined) {
    runTerminal = vscode.window.createTerminal({ name: TERMINAL_NAME });
  }
  runTerminal.show(true);
  if (clear) {
    runTerminal.sendText("clear", true);
  }
  return runTerminal;
}

async function runCurrentFile(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "fan") {
    await vscode.window.showWarningMessage("请先在编辑器中打开一个凡语言文件。");
    return;
  }

  const document = editor.document;
  if (document.isUntitled || document.isDirty) {
    const saved = await document.save();
    if (!saved) {
      return;
    }
  }

  const path = await ensureExecutable();
  if (!path) {
    return;
  }

  const config = vscode.workspace.getConfiguration("fan");
  if (config.get<boolean>("runInTerminal", true)) {
    const terminal = getRunTerminal(config.get<boolean>("clearBeforeRun", false));
    terminal.sendText(`${path} run ${quotePath(document.fileName)}`, true);
  }
}

async function startRepl(): Promise<void> {
  const path = await ensureExecutable();
  if (!path) {
    return;
  }
  const terminal = vscode.window.createTerminal({ name: "凡语言 REPL" });
  terminal.show(true);
  terminal.sendText(path, true);
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("fan.run", runCurrentFile),
    vscode.commands.registerCommand("fan.repl", startRepl),
    vscode.window.onDidCloseTerminal((terminal) => {
      if (terminal === runTerminal) {
        runTerminal = undefined;
      }
    })
  );
}

export function deactivate(): void {
  runTerminal = undefined;
}
