module.exports = {
  apps : [{
    name: 'client',
    script: './src/App.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '34.198.80.136',
      ref  : 'origin/master',
      repo : 'https://github.com/Barathbk98/sharemarket-client.git',
      path : '/var/www/sharemarket-client',
      'post-deploy' : 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
