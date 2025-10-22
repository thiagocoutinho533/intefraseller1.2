import React from "react";
import Siderbar from "./components/Siderbar"; // seu componente Siderbar (com s)
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <>
      <Siderbar />
      <Header />
      {/* IMPORTANTE: main deve ter className="content" */}
      <main className="content bg-white min-vh-100">
        <Dashboard />
      </main>
      <Footer />
    </>
  );
}