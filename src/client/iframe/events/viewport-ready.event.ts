import { Iframe } from '@sdk/client/iframe/iframe';

/**
 * Handles the iframe's ready state.
 */
export class ViewportReadyEvent {
  private readonly iframe: Iframe;

  /**
   * Creates a new ViewportReadyEvent instance.
   * @param iframe - The iframe instance to manage ready events for
   */
  constructor(iframe: Iframe) {
    this.iframe = iframe;
  }

  /**
   * Updates the iframe's height to match the provided bounding rectangle.
   * The width is handled through CSS and remains responsive.
   * @param boundingRect - The DOMRect containing the new dimensions
   */
  public handle(boundingRect: DOMRect): void {
    if (!this.iframe.element) return;
    this.iframe.element.style.display = 'block';
    this.iframe.element.style.height = `${boundingRect.height}px`;
  }
}
