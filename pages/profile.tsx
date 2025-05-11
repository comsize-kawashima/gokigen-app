import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import BottomNav from "@/components/navigation/BottomNav";
import { useRouter } from "next/router";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch("http://localhost:3001/api/user/find", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setProfile(data.user);
        } else {
          setError(data.error || "ユーザー情報の取得に失敗しました");
        }
      } catch (e) {
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
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 shadow text-gray-700">プロフィール</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {profile ? (
          <div className="bg-white p-6 rounded shadow text-gray-700">
            <p><span className="font-semibold">ユーザー名：</span>{profile.username}</p>
            <p><span className="font-semibold">メールアドレス：</span>{profile.email}</p>
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
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