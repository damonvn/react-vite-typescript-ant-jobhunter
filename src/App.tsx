import { useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LoginPage from '@/pages/auth/login';



export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div style={{ margin: "50px", textAlign: "center", fontSize: "40px", fontFamily: "sans-serif" }}>WELCOME TO HOMEPAGE</div>
    },
    {
      path: "/login",
      element: <LoginPage />
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}