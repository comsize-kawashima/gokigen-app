import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

// 追加: シンプルなフォント
const simpleFont = `'Arial', 'Helvetica', sans-serif`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(email, password);
      router.push("/");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError((errorMsg || "ログインに失敗しました。") + " サインアップが完了していない場合は、まずサインアップしてください。");
    }
  };

  return (
    <Layout title="ログイン">
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 rounded-3xl shadow-2xl" style={{ fontFamily: simpleFont }}>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: simpleFont }}>ログイン</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
            ログイン
          </button>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-emerald-600 underline text-sm"
              onClick={() => router.push("/reset-password")}
            >
              パスワードを忘れた場合
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
