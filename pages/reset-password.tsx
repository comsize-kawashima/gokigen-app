import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "リセットに失敗しました");
      setMessage("パスワードリセット用のメールを送信しました。メールをご確認ください。");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "リセットに失敗しました");
    }
  };

  return (
    <Layout title="パスワードリセット">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4">パスワードリセット</h2>
          {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
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
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition"
          >
            リセットメール送信
          </button>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-emerald-600 underline text-sm"
              onClick={() => router.push("/login")}
            >
              ログイン画面に戻る
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword; 