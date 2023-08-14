// define app by environment
const appDefs = [
    {
        // node_args: [],
        name: 'api',
        script: './src/start.js',
        env: {
            NODE_ENV: 'production',
        },
        instances: 'max',
        exec_mode: 'cluster',
        max_memory_restart: '1G',
        node_args: '--expose-gc --max-old-space-size=1024',
    },
    {
        // node_args: ['--inspect', '--debug=0.0.0.0:7000'],
        name: 'api-qas',
        script: './src/start.js',
        env: {
            NODE_ENV: 'preprod',
        },
        instances: 1,
        max_memory_restart: '512M',
        node_args: '--expose-gc --max-old-space-size=512',
        exec_mode: 'cluster',
    },
    {
        // node_args: ['--inspect', '--debug=0.0.0.0:7000'],
        name: 'api',
        script: './src/start.js',
        env: {
            NODE_ENV: 'staging',
        },
        instances: 1,
        max_memory_restart: '512M',
        node_args: '--expose-gc --max-old-space-size=512',
        exec_mode: 'cluster',
    },
    {
        name: 'cronjob',
        script: './src/cronjob.js',
        env: {
            NODE_ENV: 'production',
        },
        instances: 1,
        exec_mode: 'fork',
        max_memory_restart: '1G',
        node_args: '--expose-gc --max-old-space-size=1024',
    },
    {
        name: 'cronjob-qas',
        script: './src/cronjob.js',
        env: {
            NODE_ENV: 'preprod',
        },
        instances: 1,
        exec_mode: 'fork',
        max_memory_restart: '512M',
        node_args: '--expose-gc --max-old-space-size=512',
    },
    {
        name: 'cronjob',
        script: './src/cronjob.js',
        env: {
            NODE_ENV: 'staging',
        },
        instances: 1,
        exec_mode: 'fork',
        max_memory_restart: '512M',
        node_args: '--expose-gc --max-old-space-size=512',
    },
]

console.log('PM2 Environment', process.env.NODE_ENV)

const apps = appDefs
    .filter(e => e.env.NODE_ENV === process.env.NODE_ENV)
    .map(appDef => ({
        ...appDef,
        name: appDef.name,
    }))

module.exports = {
    apps,
}
