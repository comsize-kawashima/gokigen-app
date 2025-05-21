import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import BottomNav from "@/components/navigation/BottomNav";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 追加: ポップなフォント
const popFont = `'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif`;

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/find`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setProfile(data.user);
        } else {
          setError(data.error || "ユーザー情報の取得に失敗しました");
        }
      } catch {
        setError("ユーザー情報の取得に失敗しました");
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Layout title="プロフィール">
      <div className="max-w-md mx-auto px-4 py-6 bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 rounded-3xl shadow-2xl" style={{ fontFamily: popFont }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-700" style={{ fontFamily: popFont }}>プロフィール</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {profile ? (
          <div className="bg-white p-6 rounded-3xl shadow-lg text-gray-700">
            <p><span className="font-semibold">ユーザー名：</span>{profile.username}</p>
            <p><span className="font-semibold">メールアドレス：</span>{profile.email}</p>
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 shadow-md transition"
            >
              ログアウト
            </button>
          </div>
        ) : (
          !error && <p>読み込み中...</p>
        )}
        <BottomNav />
      </div>
    </Layout>
  );
};

export default Profile; 