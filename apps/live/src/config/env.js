export const EnvConfig = {
  coreUrl: process.env.REACT_APP_CORE_URL,
  agoraAppId: process.env.REACT_APP_AGORA_APP_ID,
  gtmId: process.env.REACT_APP_GTM_ID,
  hostedUrl: process.env.REACT_APP_HOSTED_URL
    ? process.env.REACT_APP_HOSTED_URL
    : 'http://localhost:3000',
}
