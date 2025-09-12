import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import ChatBot from "../ChatBot/ChatBot";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <ChatBot />
    </div>
  );
};

export default Layout;