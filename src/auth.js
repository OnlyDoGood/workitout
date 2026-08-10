export const ADMIN_CREDENTIALS = {
  email: 'desmondodogwu306@gmail.com',
  phone: '08124289212',
  password: 'odogwu4u',
}

export function isAdminLoginValid({ username, password }) {
  return (
    (username === ADMIN_CREDENTIALS.email || username === ADMIN_CREDENTIALS.phone) &&
    password === ADMIN_CREDENTIALS.password
  )
}
