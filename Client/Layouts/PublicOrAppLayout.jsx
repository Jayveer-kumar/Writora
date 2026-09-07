import { Outlet } from "react-router-dom";
import useAuthStore from "../Store/authStore";
import AppLayout from "./Applayout/Applayout";
import GuestLayout from "./GuestLayout/GuestLayout";

export default function PublicOrAppLayout() {
  const token = useAuthStore((state) => state.token);
  return token ? <AppLayout /> : <GuestLayout allowGuestView />;
}