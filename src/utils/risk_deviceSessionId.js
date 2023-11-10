/**
 * https://www.checkout.com/docs/business-operations/prevent-fraud/integrate-with-risk-js
 */
export async function risk_publishRiskData() {
  return await new Promise((resolve) => {
    // Initialize Risk.js with your public key. You can generate public keys in the Dashboard.
    const risk = window.Risk.init(process.env.VUE_APP_Risk_Public_Key);
    // When the customer selects Pay, publish the device data and retrieve the deviceSessionId.
    resolve(risk.publishRiskData());
  });
}
