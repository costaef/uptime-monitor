let environments = {}

// Staging (default) environment
environments.staging = {
  http: 3000,
  https: 3001,
  name: 'staging',
}

environments.production = {
  http: 5000,
  https: 5001,
  name: 'production'
}

const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

export const environment = environments[currentEnv] ? environments[currentEnv] : environments.staging