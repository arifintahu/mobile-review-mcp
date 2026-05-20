import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export type Platform = 'ios' | 'android' | 'desktop';

export interface BrowserOptions {
  platform?: Platform;
  device?: string;
}

export interface ExecResult {
  stdout: string;
  stderr: string;
}

const DEFAULT_DEVICE: Record<Platform, string> = {
  ios: 'iPhone 16 Pro',
  android: 'Pixel 7',
  desktop: '',
};

export class AgentBrowser {
  private platform: Platform;
  private device: string;

  constructor(options: BrowserOptions = {}) {
    this.platform = options.platform ?? 'ios';
    this.device = options.device ?? DEFAULT_DEVICE[this.platform];
  }

  private platformFlags(): string {
    if (this.platform === 'desktop') return '';
    const deviceFlag = this.device ? `--device "${this.device}"` : '';
    return `-p ${this.platform} ${deviceFlag}`.trim();
  }

  async open(url: string): Promise<ExecResult> {
    return execAsync(`agent-browser ${this.platformFlags()} open "${url}"`);
  }

  async snapshot(interactive = false): Promise<ExecResult> {
    const flag = interactive ? '-i' : '';
    return execAsync(`agent-browser snapshot ${flag}`.trim());
  }

  async click(ref: string): Promise<ExecResult> {
    return execAsync(`agent-browser click ${ref}`);
  }

  async type(ref: string, text: string): Promise<ExecResult> {
    const escaped = text.replace(/"/g, '\\"');
    return execAsync(`agent-browser type ${ref} "${escaped}"`);
  }

  async screenshot(outputPath?: string): Promise<ExecResult> {
    const pathArg = outputPath ? `--output "${outputPath}"` : '';
    return execAsync(`agent-browser screenshot ${pathArg}`.trim());
  }

  async navigate(url: string): Promise<ExecResult> {
    return execAsync(`agent-browser navigate "${url}"`);
  }

  async back(): Promise<ExecResult> {
    return execAsync('agent-browser back');
  }

  async getUrl(): Promise<string> {
    const { stdout } = await execAsync('agent-browser url');
    return stdout.trim();
  }

  async scroll(direction: 'up' | 'down' | 'left' | 'right', amount = 300): Promise<ExecResult> {
    return execAsync(`agent-browser scroll ${direction} ${amount}`);
  }

  static async checkInstalled(): Promise<boolean> {
    try {
      await execAsync('agent-browser --version');
      return true;
    } catch {
      return false;
    }
  }

  static async install(): Promise<ExecResult> {
    return execAsync('npm install -g agent-browser && agent-browser install');
  }
}
