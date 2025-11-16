/**
 * Event system
 * Migrated from: old text/src/js/events.js (572 lines)
 *
 * Simplified to use modern patterns while maintaining
 * backward compatibility with custom events
 */

import type { Editor } from './Editor';

export type EventListener = (...args: any[]) => void;

export interface EventMap {
  ready: [Editor];
  destroy: [Editor];
  change: [string];
  selectionChange: [Selection | null];
  focus: [FocusEvent];
  blur: [FocusEvent];
  input: [InputEvent];
  keydown: [KeyboardEvent];
  paste: [ClipboardEvent];
  addElement: [Element];
  removeElement: [Element];
  [key: string]: any[];
}

/**
 * Modern event emitter for editor events
 *
 * Reference: old text/src/js/events.js Events class
 * Modernized with TypeScript and cleaner API
 */
export class EventEmitter {
  private listeners: Map<string, Set<EventListener>>;
  private onceListeners: Map<string, Set<EventListener>>;

  constructor() {
    this.listeners = new Map();
    this.onceListeners = new Map();
  }

  /**
   * Subscribe to event
   * Reference: events.js subscribe (custom events)
   */
  public on<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): () => void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set());
    }

    this.listeners.get(event as string)!.add(listener);

    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  /**
   * Subscribe to event once
   */
  public once<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): void {
    if (!this.onceListeners.has(event as string)) {
      this.onceListeners.set(event as string, new Set());
    }

    this.onceListeners.get(event as string)!.add(listener);
  }

  /**
   * Unsubscribe from event
   * Reference: events.js unsubscribe
   */
  public off<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): void {
    this.listeners.get(event as string)?.delete(listener);
    this.onceListeners.get(event as string)?.delete(listener);
  }

  /**
   * Emit event
   * Reference: events.js trigger
   */
  public emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]): void {
    // Regular listeners
    const listeners = this.listeners.get(event as string);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(
            `Error in event listener for '${String(event)}':`,
            error
          );
        }
      });
    }

    // Once listeners
    const onceListeners = this.onceListeners.get(event as string);
    if (onceListeners) {
      onceListeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(
            `Error in once listener for '${String(event)}':`,
            error
          );
        }
      });
      this.onceListeners.delete(event as string);
    }
  }

  /**
   * Remove all listeners for event or all events
   */
  public removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
  }

  /**
   * Get listener count
   */
  public listenerCount(event: string): number {
    const regular = this.listeners.get(event)?.size || 0;
    const once = this.onceListeners.get(event)?.size || 0;
    return regular + once;
  }

  /**
   * Check if event has listeners
   */
  public hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0;
  }
}
