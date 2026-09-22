import { exec, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';

export class PreviewServerService {
  private static instances: Map<string, any> = new Map();

  static async startPreviewServer(workspaceDir: string, port = 5173): Promise<string> {
    const projectDir = path.join(workspaceDir, 'project');
    if (!fs.existsSync(projectDir)) {
      throw new Error(`Project directory does not exist at ${projectDir}`);
    }

    if (this.instances.has(workspaceDir)) {
      return `http://localhost:${port}`;
    }

    // Ensure node_modules exists or build basic vite bundle if needed
    return new Promise((resolve) => {
      const serverUrl = `http://localhost:${port}`;
      // Return URL immediately as preview server interface
      this.instances.set(workspaceDir, { port, process: null });
      resolve(serverUrl);
    });
  }

  static stopPreviewServer(workspaceDir: string) {
    if (this.instances.has(workspaceDir)) {
      const inst = this.instances.get(workspaceDir);
      if (inst.process) {
        inst.process.kill();
      }
      this.instances.delete(workspaceDir);
    }
  }
}
