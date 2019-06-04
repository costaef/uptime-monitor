import crypto from 'crypto'
import { environment } from '../config'

// Create a SHA256 hash
export const hash = (str) => {
  if (typeof(str) == 'string' && str.length > 0) {
    return crypto.createHmac('sha256', environment.hashingSecret).update(str).digest('hex')
  } else {
    return null
  }
}