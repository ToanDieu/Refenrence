const config = {
  TSE_API: process.env.TSE_API,
  PUSHER_KEY: process.env.PUSHER_KEY,
  AUTH0_AUD: process.env.AUTH0_AUD,
  AUTH0_REDIRECT: process.env.AUTH0_REDIRECT,
  AUTH0_CLIENTID: process.env.AUTH0_CLIENTID,
  TSE_SERVE_DOMAIN: process.env.TSE_SERVE_DOMAIN,
  TSE_DEFAULT_LANG: process.env.TSE_DEFAULT_LANG,
  TSE_WEB_VERSION: process.env.TSE_WEB_VERSION,
  TSE_ENV_LABEL: process.env.TSE_ENV_LABEL
};

export default config;
