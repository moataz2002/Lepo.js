const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

function isScriptExecutionEnabled() {
  try {
    child_process.execSync('Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser', { stdio: ['ignore', 'ignore', 'ignore'] });
    return true;
  } catch (error) {
    return false;
  }
}

function createProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  const templatePath = path.join(__dirname, '../templates/project_template');
  
  if (fs.existsSync(projectPath)) {
    console.error(`Project directory "${projectName}" already exists!`);
    return;
  }

  fs.mkdirSync(projectPath);
  copyTemplateFiles(templatePath, projectPath);
  console.log(`Project "${projectName}" created successfully!`);
}

function copyTemplateFiles(source, destination) {
  const files = fs.readdirSync(source);
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    if (fs.statSync(sourcePath).isDirectory()) {
      fs.mkdirSync(destPath);
      copyTemplateFiles(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

function installGlobally() {
  if (process.platform === 'win32' && !isScriptExecutionEnabled()) {
    console.error('Script execution is disabled. You can try the following:\n');
    console.error('1. Open PowerShell as administrator and run:\n');
    console.error('   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser\n');
    console.error('2. Run the command again.\n');
    console.error('**Warning:** Enabling script execution can be a security risk. Only proceed if you trust the source of this script.');
    return;
  }
  
  child_process.spawnSync('npm', ['install', '-g', '.'], { stdio: 'inherit' });
  console.log('Lepo framework installed globally successfully!');
}

const [, , command, projectName] = process.argv;

if (command === 'init') {
  createProject(projectName);
} else if (command === 'global') {
  installGlobally();
} else {
  console.error(`Unknown command: ${command}`);
}
