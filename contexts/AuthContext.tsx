import { createContext, useContext, useEffect, useState } from 'react'

// 型定義は必要に応じて修正
interface AuthContextType {
  user: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // JWTがlocalStorageにあればユーザー情報を取得
    const token = localStorage.getItem('token')
    if (token) {
      // 必要ならトークンをデコードしてユーザー情報をセット
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'ログインに失敗しました')
    localStorage.setItem('token', data.token)
    setUser({ token: data.token })
  }

  const signUp = async (email: string, password: string, username: string) => {
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'サインアップに失敗しました')
    // サインアップ後に自動ログインする場合は下記を有効化
    // localStorage.setItem('token', data.token);
    // setUser({ token: data.token });
  }

  const signOut = async () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 