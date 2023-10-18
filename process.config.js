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
