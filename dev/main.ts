// Import your SDK here
import * as VerifiedInc from "@sdk/index";

function main() {
  // Your development code here
  const sdk = new VerifiedInc.Client({
    publicKey: "test-key",
    onReady: handleReadySDK,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  function handleReadySDK() {
    console.log(sdk.ready);
    sdk.show(document.body);
    sdk.show(document.body);
  }

  function handleSuccess(
    oneClickSuccessData: VerifiedInc.OneClickResponseData
  ) {
    console.log("VerifiedInc Client SDK success:", oneClickSuccessData);
  }

  function handleError(error: VerifiedInc.OneClickError) {}
}

main();
