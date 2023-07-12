module.exports = {
    apps: [
        {
            name: "nestjs-app",
            script: "dist/src/main.js",
            instances: 2,
            exec_mode: "cluster",
            autorestart: true,
            watch: true,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
