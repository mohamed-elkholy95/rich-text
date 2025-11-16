/**
 * AutoLink extension
 *
 * Reference: old text/src/js/extensions/auto-link.js
 * Automatically converts URLs to clickable links
 */

import { Extension } from './Extension';
import { isKey, keyCode } from '../utils/browser';
import { getClosestTag } from '../utils/dom';

// Reference: auto-link.js lines 10-30
const KNOWN_TLDS =
  'com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|' +
  'xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|' +
  'bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|' +
  'fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|' +
  'is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|' +
  'mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|' +
  'pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|' +
  'tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw';

// Gruber URL Regexp optimized for JS
// Reference: auto-link.js lines 21-26
const LINK_REGEXP_TEXT =
  '(' +
  '((?:(https?://|ftps?://|nntp://)|www\\d{0,3}[.]|[a-z0-9.\\-]+[.](' +
  KNOWN_TLDS +
  ')\\/)\\S+(?:[^\\s`!\\[\\]{};:\'\".,?\\u00AB\\u00BB\\u201C\\u201D\\u2018\\u2019]))' +
  ')|(([a-z0-9\\-]+\\.)?[a-z0-9\\-]+\\.(' +
  KNOWN_TLDS +
  '))';

const LINK_REGEXP = new RegExp(LINK_REGEXP_TEXT, 'gi');

/**
 * Check if node is not inside an anchor tag
 * Reference: auto-link.js nodeIsNotInsideAnchorTag()
 */
function nodeIsNotInsideAnchorTag(node: Node): boolean {
  return !getClosestTag(node, 'a');
}

/**
 * AutoLink Extension
 *
 * Automatically detects and converts URLs to links when user types
 * Reference: old text/src/js/extensions/auto-link.js
 */
export class AutoLinkExtension extends Extension {
  private disableEventHandling = false;
  private performLinkingTimeout?: number;

  constructor() {
    super('autoLink');
  }

  /**
   * Initialize auto-link
   * Reference: auto-link.js init()
   */
  protected override onCreate(): void {
    this.disableEventHandling = false;

    // Listen for keypress events
    this.on('keydown', this.onKeypress.bind(this));
    this.on('blur', this.onBlur.bind(this));

    // Disable browser's built-in AutoUrlDetect
    // Reference: auto-link.js line 44
    try {
      document.execCommand('AutoUrlDetect', false, 'false');
    } catch {
      // Ignore if not supported
    }
  }

  /**
   * Handle blur event
   * Reference: auto-link.js onBlur()
   */
  private onBlur(_event: FocusEvent, element?: Element): void {
    if (element) {
      this.performLinking(element);
    }
  }

  /**
   * Handle keypress event
   * Reference: auto-link.js onKeypress()
   */
  private onKeypress(event: KeyboardEvent): void {
    if (this.disableEventHandling) {
      return;
    }

    // Perform linking on space or enter
    // Reference: auto-link.js lines 74-92
    if (isKey(event, [keyCode.SPACE, keyCode.ENTER])) {
      clearTimeout(this.performLinkingTimeout);

      // Use timeout to perform linking after keypress completes
      this.performLinkingTimeout = window.setTimeout(() => {
        try {
          this.saveSelection();
          const target = event.target as Element;

          if (this.performLinking(target)) {
            // Restore selection
            this.restoreSelection();
          }
        } catch (e) {
          console.error('Failed to perform linking', e);
          this.disableEventHandling = true;
        }
      }, 0);
    }
  }

  /**
   * Perform linking on element
   * Reference: auto-link.js performLinking()
   *
   * Returns true if any links were created
   */
  private performLinking(element: Element): boolean {
    if (!element) return false;

    let linksCreated = false;

    // Find text nodes to scan for URLs
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: node => {
        // Skip nodes inside anchor tags
        if (!nodeIsNotInsideAnchorTag(node)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes: Text[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Process each text node
    textNodes.forEach(textNode => {
      if (this.createLinksInTextNode(textNode)) {
        linksCreated = true;
      }
    });

    return linksCreated;
  }

  /**
   * Create links in a text node
   * Returns true if any links were created
   */
  private createLinksInTextNode(textNode: Text): boolean {
    const text = textNode.textContent || '';
    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;

    // Find all URL matches
    LINK_REGEXP.lastIndex = 0;
    while ((match = LINK_REGEXP.exec(text))) {
      matches.push(match);
    }

    if (matches.length === 0) {
      return false;
    }

    // Process matches in reverse order to maintain indices
    matches.reverse().forEach(m => {
      const url = m[0];
      const index = m.index;

      // Split text node at match boundaries
      const beforeText = text.substring(0, index);
      const afterText = text.substring(index + url.length);

      // Create link element
      const anchor = document.createElement('a');
      anchor.href = this.normalizeUrl(url);
      anchor.textContent = url;

      // Replace text node with before + link + after
      const parent = textNode.parentNode;
      if (!parent) return;

      if (beforeText) {
        parent.insertBefore(document.createTextNode(beforeText), textNode);
      }

      parent.insertBefore(anchor, textNode);

      if (afterText) {
        parent.insertBefore(document.createTextNode(afterText), textNode);
      }

      parent.removeChild(textNode);
    });

    return true;
  }

  /**
   * Normalize URL (add protocol if missing)
   */
  private normalizeUrl(url: string): string {
    // If URL starts with protocol, return as-is
    if (/^(https?|ftps?|nntp):\/\//i.test(url)) {
      return url;
    }

    // If URL starts with www, add http://
    if (/^www\./i.test(url)) {
      return 'http://' + url;
    }

    // Otherwise assume http://
    return 'http://' + url;
  }

  /**
   * Cleanup
   * Reference: auto-link.js destroy()
   */
  protected override onDestroy(): void {
    clearTimeout(this.performLinkingTimeout);

    // Re-enable browser's AutoUrlDetect
    try {
      if (document.queryCommandSupported('AutoUrlDetect')) {
        document.execCommand('AutoUrlDetect', false, 'true');
      }
    } catch {
      // Ignore if not supported
    }
  }
}
