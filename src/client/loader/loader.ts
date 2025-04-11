// CSS for circular spinner animation (Material UI style)
const styles = `
  .sdk-loader-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .sdk-circular-progress {
    display: inline-block;
    width: 40px;
    height: 40px;
    color: #0dbc3d;
    position: relative;
  }

  .sdk-circular-progress-indeterminate {
    animation: sdk-circular-rotate 1.4s ease-in-out infinite;
  }

  .sdk-circular-progress-svg {
    display: block;
  }

  .sdk-circular-progress-circle {
    stroke: currentColor;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0;
    animation: sdk-circular-dash 1.4s ease-in-out infinite;
  }

  .sdk-circular-progress-circle-indeterminate {
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0px;
  }

  @keyframes sdk-circular-rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes sdk-circular-dash {
    0% {
      stroke-dasharray: 1px, 200px;
      stroke-dashoffset: 0px;
    }
    50% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -15px;
    }
    100% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -125px;
    }
  }
`;

export class Loader {
  private svgLoader: SVGElement | null = null;
  private loaderContainer: HTMLElement | null = null;

  make(parent: HTMLElement) {
    // Create container span for circular progress
    const progressContainer = document.createElement('span');
    progressContainer.classList.add('sdk-circular-progress', 'sdk-circular-progress-indeterminate');
    progressContainer.setAttribute('role', 'progressbar');
    progressContainer.style.width = '40px';
    progressContainer.style.height = '40px';

    // Create SVG element for circular spinner
    this.svgLoader = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgLoader.classList.add('sdk-circular-progress-svg');
    this.svgLoader.setAttribute('viewBox', '22 22 44 44');

    // Create circle element for spinner
    const spinnerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    spinnerCircle.classList.add(
      'sdk-circular-progress-circle',
      'sdk-circular-progress-circle-indeterminate'
    );
    spinnerCircle.setAttribute('cx', '44');
    spinnerCircle.setAttribute('cy', '44');
    spinnerCircle.setAttribute('r', '20.2');
    spinnerCircle.setAttribute('fill', 'none');
    spinnerCircle.setAttribute('stroke-width', '3.6');

    // Add circle to SVG and SVG to container
    this.svgLoader.appendChild(spinnerCircle);
    progressContainer.appendChild(this.svgLoader);

    // Create loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('sdk-loader-container');

    // Add style element and components to container
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    loaderContainer.appendChild(styleElement);

    loaderContainer.appendChild(progressContainer);
    parent.appendChild(loaderContainer);

    this.loaderContainer = loaderContainer;
  }

  dispose() {
    if (this.loaderContainer) {
      this.loaderContainer?.remove();
    }
  }
}
