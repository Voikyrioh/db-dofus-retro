export interface AuthUser {
  username: string
  email: string
  role: 'admin' | 'user'
}
