import { Client, OneClickResponseData, OneClickError } from "@sdk/index";

function main() {
  const sdk = new Client({
    publicKey: "pub_test-key",
    onReady: handleReadySDK,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  function handleReadySDK() {
    console.log("sdk ready");
    sdk.show(document.body);
  }

  function handleSuccess(oneClickSuccessData: OneClickResponseData) {
    console.log("VerifiedInc Client SDK success:", oneClickSuccessData);
  }

  function handleError(error: OneClickError) {
    console.error(error);
  }
}

main();
