import { Iframe } from '@sdk/client/iframe/iframe';

/**
 * Handles the resizing of an iframe's height based on its container's dimensions.
 * The width is managed through CSS properties in the iframe element itself.
 */
export class ViewportResizeEvent {
  private readonly iframe: Iframe;

  /**
   * Creates a new ViewportResizeEvent instance.
   * @param iframe - The iframe instance to manage resize events for
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
    this.iframe.element.style.height = `${boundingRect.height}px`;
  }
}
