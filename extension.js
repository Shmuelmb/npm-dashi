// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");

function getWorkspaceFolder() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace is open.");
    return null;
  }
  return workspaceFolders[0]; // Assumes there is at least one folder open
}

async function readPackageJson() {
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) return;

  const packageJsonPath = path.join(workspaceFolder.uri.fsPath, "package.json");
  try {
    const fileUri = vscode.Uri.file(packageJsonPath);
    const fileContent = await vscode.workspace.fs.readFile(fileUri);
    const fileString = Buffer.from(fileContent).toString("utf8");
    const packageJson = JSON.parse(fileString);

    vscode.window.showInformationMessage(
      "package.json content retrieved successfully"
    );
    return packageJson.dependencies;
  } catch (error) {
    vscode.window.showErrorMessage(
      "Error reading package.json: " + error.message
    );
  }
}
const getContext = async () => {
  const dependencies = await readPackageJson();
  console.log(dependencies);
  return `
  <html>
    <body>
      <h1>This is my crazy extension!</h1>
      <ul>
      ${Object.keys(dependencies).map((dependency) => {
        return `<li>${dependency}: ${dependencies[dependency]}</li>`;
      })}
      </ul>
    </body>
  </html>
`;
};
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "npmdashi" is now active!');
  vscode.window.showInformationMessage("a");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "npmdashi.helloWorld",
    async function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("a");
      const panel = vscode.window.createWebviewPanel(
        "npmdashi",
        "Npm dashboard",
        vscode.ViewColumn.One,
        {}
      );
      console.log(await getContext());
      panel.webview.html = await getContext();
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
