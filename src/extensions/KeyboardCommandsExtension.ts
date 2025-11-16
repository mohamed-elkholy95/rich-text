/**
 * Keyboard Commands extension
 *
 * Reference: old text/src/js/extensions/keyboard-commands.js
 * Handles keyboard shortcuts for editor commands
 */

import { Extension } from './Extension';
import { isModKey, getKeyCode } from '../utils/browser';

export interface KeyboardCommand {
  command: string | (() => void) | false;
  key: string;
  meta: boolean;
  shift: boolean;
  alt?: boolean;
}

export interface KeyboardCommandsOptions {
  commands?: KeyboardCommand[];
}

/**
 * Keyboard Commands Extension
 *
 * Maps keyboard shortcuts to editor commands
 * Reference: old text/src/js/extensions/keyboard-commands.js
 */
export class KeyboardCommandsExtension extends Extension {
  private commands: KeyboardCommand[];
  private keys: Map<number, KeyboardCommand[]>;

  constructor(options: KeyboardCommandsOptions = {}) {
    super('keyboard-commands', options);

    // Default commands (Ctrl/Cmd+B, Ctrl/Cmd+I, Ctrl/Cmd+U)
    // Reference: keyboard-commands.js lines 18-40
    this.commands = options.commands || [
      {
        command: 'bold',
        key: 'B',
        meta: true,
        shift: false,
        alt: false,
      },
      {
        command: 'italic',
        key: 'I',
        meta: true,
        shift: false,
        alt: false,
      },
      {
        command: 'underline',
        key: 'U',
        meta: true,
        shift: false,
        alt: false,
      },
    ];

    this.keys = new Map();
  }

  /**
   * Initialize keyboard commands
   * Reference: keyboard-commands.js init()
   */
  protected override onCreate(): void {
    // Subscribe to keydown events
    this.on('keydown', this.handleKeydown.bind(this));

    // Build key code lookup map
    // Reference: keyboard-commands.js lines 47-53
    this.commands.forEach(command => {
      const keyCode = command.key.charCodeAt(0);
      if (!this.keys.has(keyCode)) {
        this.keys.set(keyCode, []);
      }
      this.keys.get(keyCode)!.push(command);
    });
  }

  /**
   * Handle keydown event
   * Reference: keyboard-commands.js handleKeydown()
   */
  private handleKeydown(event: KeyboardEvent): void {
    const keyCode = getKeyCode(event);
    const commands = this.keys.get(keyCode);

    if (!commands) {
      return;
    }

    const isMeta = isModKey(event);
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    // Check each command for this key code
    // Reference: keyboard-commands.js lines 66-84
    commands.forEach(data => {
      // Check if modifier keys match
      const metaMatch = data.meta === isMeta;
      const shiftMatch = data.shift === isShift;
      const altMatch = data.alt === undefined || data.alt === isAlt;

      if (metaMatch && shiftMatch && altMatch) {
        event.preventDefault();
        event.stopPropagation();

        // Command can be a function to execute
        if (typeof data.command === 'function') {
          data.command();
        }
        // Command can be false to just disable the shortcut
        else if (data.command !== false) {
          this.execCommand(data.command);
        }
      }
    });
  }

  /**
   * Add a keyboard command
   */
  public addCommand(command: KeyboardCommand): void {
    this.commands.push(command);

    const keyCode = command.key.charCodeAt(0);
    if (!this.keys.has(keyCode)) {
      this.keys.set(keyCode, []);
    }
    this.keys.get(keyCode)!.push(command);
  }

  /**
   * Remove a keyboard command
   */
  public removeCommand(key: string, meta: boolean, shift: boolean): boolean {
    const keyCode = key.charCodeAt(0);
    const commands = this.keys.get(keyCode);

    if (!commands) {
      return false;
    }

    const index = commands.findIndex(
      cmd => cmd.meta === meta && cmd.shift === shift
    );

    if (index !== -1) {
      commands.splice(index, 1);
      if (commands.length === 0) {
        this.keys.delete(keyCode);
      }
      return true;
    }

    return false;
  }
}
