import * as path from "path"

export const getPythonPath = () => {
    return process.platform === 'win32' ? path.resolve(process.cwd(), 'scripts/venv/Scripts/python.exe') : path.resolve(process.cwd(), 'scripts/venv/bin/python');
}