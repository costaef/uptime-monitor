let environments = {}

// Staging (default) environment
environments.staging = {
  port: 3000,
  name: 'staging',
}

environments.production = {
  port: 5000,
  name: 'production'
}

const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

export const environment = environments[currentEnv] ? environments[currentEnv] : environments.staging