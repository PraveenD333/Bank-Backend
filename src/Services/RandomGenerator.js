import crypto from 'crypto'

export const generateAccountNumber = () => {
    const accountNumber = crypto.randomBytes(4).toString('hex').toUpperCase()
    return `ACC${accountNumber}`
}

export const generateIdempotanceKey = () => {
    const idempotanceKey = crypto.randomUUID().toUpperCase()
    return idempotanceKey
}