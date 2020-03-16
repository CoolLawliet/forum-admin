module.exports = {
    // 反向代理
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            // 配置跨域
            '/admin': {
                target: 'http://localhost:3000/admin',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/admin': ''
                }
            }
        },
        before: app => {}
    }
};
