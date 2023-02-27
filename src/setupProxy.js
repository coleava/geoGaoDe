const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'https://apis.map.qq.com/ws/place/v1',
			changeOrigin: true,
			ws: true,
		})
	);
};
