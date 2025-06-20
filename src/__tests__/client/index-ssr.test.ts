/**
 * This environment set to node because we are testing the client SDK in a Node.js environment to capture when the window object is not defined.
 * @jest-environment node
 */

describe('VerifiedClientSdk Global Namespace on SSR', () => {
  it('should create Verified namespace on window when it does not exist', () => {
    // Act
    // Import the module to trigger the code that attaches to window
    const VerifiedModule = require('@sdk/client');

    // Assert
    expect(VerifiedModule.VerifiedClientSdk).toBeDefined();
    expect(VerifiedModule.default.Client).toBeDefined();
  });
});
