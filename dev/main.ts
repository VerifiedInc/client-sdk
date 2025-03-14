import { Client, SuccessEventResponseData, OneClickError } from '@sdk/index';

function main() {
  const sdk = new Client({
    environment: 'local',
    sessionKey: 'TEST_SESSION_KEY_A_HERE',
    onSuccess: handleSuccess,
    onError: handleError,
  });

  function handleSuccess(data: SuccessEventResponseData) {
    console.log('Verified Client SDK success:', data);
  }

  function handleError(error: OneClickError) {
    console.error(error.reason, error.additionalData);
  }

  document.getElementById('show-sdk')?.addEventListener('click', () => {
    if (!sdk.ready) return;
    sdk.show(document.getElementById('sdk-container') as HTMLElement);
  });

  document.getElementById('remove-sdk')?.addEventListener('click', () => {
    if (!sdk.ready) return;
    sdk.destroy();
  });

  // Show the SDK
  sdk.show(document.getElementById('sdk-container') as HTMLElement);
}

main();
