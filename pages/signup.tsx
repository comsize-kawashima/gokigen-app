import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/layout/Layout'

// 追加: ポップなフォント
const popFont = `'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif`;

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signUp(email, password, username)
      router.push('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'サインアップに失敗しました。')
    }
  }

  return (
    <Layout title="サインアップ">
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 rounded-3xl shadow-2xl" style={{ fontFamily: popFont }}>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: popFont }}>サインアップ</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              ユーザー名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 shadow-md transition"
          >
            サインアップ
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default SignUp 