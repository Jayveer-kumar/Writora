// Hooks/useRequireAuth.js
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../Store/authStore";

export default function useRequireAuth() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();

  return (callback) => {
    if (!token) {
      navigate(`/auth?currentAction=login&redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    callback();
  };
}