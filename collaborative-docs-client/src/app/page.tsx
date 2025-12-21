"use client";

import { FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal, closeAuthModal } from "@/store/slices/modalSlice";
import AuthModal from "./components/Homepage/AuthModal";
import { RootState } from "@/store/store";
import { authApi, useGetMeQuery, useLogoutMutation } from "@/store/api/authApi";
import FullScreenLoader from "./components/FullScreenLoader";
import LoggedInHero from "./components/Homepage/HeroSection/LoggedInHero";
import LoggedOutHero from "./components/Homepage/HeroSection/LoggedOutHero";

export default function Home() {
  const dispatch = useDispatch();
  const { data: me, isLoading } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const { isAuthModalOpen, authModalType } = useSelector(
    (state: RootState) => state.modal
  );
  const handleLogout = async () => {
    await logout().unwrap();

    dispatch(authApi.util.resetApiState());
  };

  if (isLoading) return <FullScreenLoader />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      <nav className="relative z-50 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg">
              <FaFileAlt className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">
              Nexus<span className="text-emerald-400">Docs</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {me?.user ? (
              <>
                <span className="text-sm text-gray-300">
                  Hi, <span className="font-semibold">{me.user.username}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg border border-red-400/40 text-red-400 hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal("signup"))}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-semibold"
              >
                Get Started Free
              </button>
            )}
          </div>
        </div>
      </nav>
      {me?.user ? (
        <LoggedInHero username={me.user.username} />
      ) : (
        <LoggedOutHero />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        type={authModalType}
        onClose={() => dispatch(closeAuthModal())}
      />
    </div>
  );
}
