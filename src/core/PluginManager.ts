/**
 * Plugin/Extension management
 *
 * Reference: old text/src/js/extension.js + individual extensions
 * Enhancement: Modern plugin API with TypeScript
 */

import type { Editor } from './Editor';
import type { Command, KeyBinding, StateChange } from '../types';

export interface Plugin {
  name: string;
  version?: string;

  // Lifecycle hooks
  init?(editor: Editor): void;
  destroy?(): void;
  update?(changes: StateChange): void;

  // Optional features
  commands?: Command[];
  keybindings?: KeyBinding[];
  schema?: SchemaSpec;
}

export interface SchemaSpec {
  nodes?: Record<string, any>;
  marks?: Record<string, any>;
}

/**
 * Manages plugins/extensions for the editor
 *
 * Plugins can add commands, keybindings, and extend editor functionality
 */
export class PluginManager {
  private plugins: Map<string, Plugin>;
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
    this.plugins = new Map();
  }

  /**
   * Initialize all plugins
   */
  public init(plugins: Record<string, Plugin> = {}): void {
    Object.entries(plugins).forEach(([name, plugin]) => {
      this.register(name, plugin);
    });
  }

  /**
   * Register a plugin
   */
  public register(name: string, plugin: Plugin): void {
    // Validate plugin
    if (this.plugins.has(name)) {
      throw new Error(`Plugin '${name}' already registered`);
    }

    // Validate plugin object
    if (!plugin || typeof plugin !== 'object') {
      throw new Error(`Invalid plugin: ${name}`);
    }

    // Set plugin name if not set
    if (!plugin.name) {
      plugin.name = name;
    }

    // Register plugin
    this.plugins.set(name, plugin);

    // Initialize plugin
    try {
      plugin.init?.(this.editor);
    } catch (error) {
      console.error(`Error initializing plugin '${name}':`, error);
      this.plugins.delete(name);
      throw error;
    }

    // Register commands
    if (plugin.commands) {
      plugin.commands.forEach(cmd => {
        try {
          this.editor.commands.register(cmd);
        } catch (error) {
          console.error(
            `Error registering command '${cmd.name}' from plugin '${name}':`,
            error
          );
        }
      });
    }

    // Register keybindings
    if (plugin.keybindings) {
      this.registerKeybindings(plugin.keybindings);
    }
  }

  /**
   * Get a plugin by name
   */
  public get<T extends Plugin>(name: string): T | undefined {
    return this.plugins.get(name) as T | undefined;
  }

  /**
   * Check if plugin is registered
   */
  public has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Unregister a plugin
   */
  public unregister(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      return false;
    }

    try {
      plugin.destroy?.();
    } catch (error) {
      console.error(`Error destroying plugin '${name}':`, error);
    }

    return this.plugins.delete(name);
  }

  /**
   * Get all plugin names
   */
  public getPluginNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Get all plugins
   */
  public getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Notify all plugins of state change
   */
  public notifyUpdate(changes: StateChange): void {
    this.plugins.forEach(plugin => {
      try {
        plugin.update?.(changes);
      } catch (error) {
        console.error(`Error in plugin update for '${plugin.name}':`, error);
      }
    });
  }

  /**
   * Destroy all plugins
   */
  public destroy(): void {
    this.plugins.forEach((plugin, name) => {
      try {
        plugin.destroy?.();
      } catch (error) {
        console.error(`Error destroying plugin '${name}':`, error);
      }
    });

    this.plugins.clear();
  }

  /**
   * Register keybindings from plugin
   */
  private registerKeybindings(keybindings: KeyBinding[]): void {
    // Keybindings will be handled by keyboard extension
    // For now, just store them
    keybindings.forEach(_binding => {
      // TODO: Implement keybinding registration
      // This will be handled by a KeyboardExtension plugin
    });
  }
}
