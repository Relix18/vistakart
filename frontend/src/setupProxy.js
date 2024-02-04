import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: "http://192.168.1.11:4000",
      changeOrigin: true,
    })
  );
};
