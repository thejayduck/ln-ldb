module.exports = {
    env: {
        MONGO_HOST: process.env.MONGO_HOST,
        MONGO_PASSWORD: process.env.MONGO_PASSWORD,
        MONGO_USER: process.env.MONGO_USER,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
    },
    i18n: {
        locales: ['en-US'],
        defaultLocale: 'en-US',
    },
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.plugins.push(
                new webpack.IgnorePlugin({
                    checkResource(resource, _context) {
                        // ??
                        if (resource.includes("mongoose")) {
                            return true;
                        }
                        return false;
                    },
                }),
            );
        }

        return config;
    },
}