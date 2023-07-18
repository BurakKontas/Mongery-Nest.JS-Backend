module.exports = {
    apps: [
        {
            name: "nestjs-app",
            script: "dist/src/main.js",
            instances: 1,
            exec_mode: "cluster",
            autorestart: true,
            watch: true,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
                HTTPS: "true",
                SSL_CRT_FILE: "../certs/certificate.crt",
                SSL_KEY_FILE: "../certs/private.key",
            },
        },
    ],
};
