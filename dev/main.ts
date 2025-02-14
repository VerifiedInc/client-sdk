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
    sdk.show(document.getElementById("sdk-container") as HTMLElement);
  }

  function handleSuccess(oneClickSuccessData: OneClickResponseData) {
    console.log("Verified Client SDK success:", oneClickSuccessData);
  }

  function handleError(error: OneClickError) {
    console.error(error.reason, error.additionalData);
  }

  document.getElementById("show-sdk")?.addEventListener("click", () => {
    if (!sdk.ready) return;
    sdk.show(document.getElementById("sdk-container") as HTMLElement);
  });

  document.getElementById("remove-sdk")?.addEventListener("click", () => {
    if (!sdk.ready) return;
    sdk.destroy();
  });
}

main();
