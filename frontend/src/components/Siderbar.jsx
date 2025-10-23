import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  List,
  Speedometer2,
  Cart3,
  Wallet2,
  Gear,
  ChevronLeft
} from "react-bootstrap-icons";



const SIDEBAR_WIDTH = 220;
const COLLAPSED_WIDTH = 72;

export default function Siderbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("siderbar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("siderbar-collapsed", collapsed ? "true" : "false");

    document.body.classList.add("has-siderbar");
    if (collapsed) document.body.classList.add("siderbar-collapsed");
    else document.body.classList.remove("siderbar-collapsed");

    return () => {
      document.body.classList.remove("has-siderbar");
      document.body.classList.remove("siderbar-collapsed");
    };
  }, [collapsed]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 992) setShowOffcanvas(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2 ${isActive ? "active bg-secondary text-white" : "text-light"}`;

  const SiderbarContent = (
    <>
      <div className="siderbar-top d-flex align-items-center px-3 border-bottom border-secondary" style={{ height: 64 }}>
        <img src="/logo.svg" alt="Logo" height="28" className="me-2" />
        <span className="fw-semibold brand-text">IntegraSeller</span>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary ms-auto d-none d-lg-inline-flex align-items-center collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-pressed={collapsed}
          aria-label={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
        >
          <ChevronLeft size={16} className={collapsed ? "rotated" : ""} />
        </button>
      </div>

      <nav className="mt-3 px-2">
        <ul className="nav nav-pills flex-column gap-1">
          <li className="nav-item">
            <NavLink to="/dashboard" className={navLinkClass}>
              <Speedometer2 size={18} />
              <span className="nav-label">Dashboard</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/vendas" className={navLinkClass}>
              <Cart3 size={18} />
              <span className="nav-label">Vendas</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/financeiro" className={navLinkClass}>
              <Wallet2 size={18} />
              <span className="nav-label">Financeiro</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/configuracoes" className={navLinkClass}>
              <Gear size={18} />
              <span className="nav-label">Configurações</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="btn btn-dark position-fixed top-0 start-0 m-2 d-lg-none z-top"
        aria-label="Abrir menu"
        onClick={() => setShowOffcanvas(true)}
      >
        <List size={20} />
      </button>

      <aside
        className={`siderbar position-fixed top-0 start-0 h-100 bg-dark text-light shadow d-none d-lg-flex flex-column ${collapsed ? "collapsed" : ""}`}
        style={{
          width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          zIndex: 1030
        }}
      >
        {SiderbarContent}
      </aside>

      <div
        className={`offcanvas offcanvas-start ${showOffcanvas ? "show" : ""}`}
        tabIndex={-1}
        role="dialog"
        aria-hidden={!showOffcanvas}
        style={{
          visibility: showOffcanvas ? "visible" : "hidden",
          zIndex: 1040
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button type="button" className="btn-close text-reset" aria-label="Fechar" onClick={() => setShowOffcanvas(false)} />
        </div>
        <div className="offcanvas-body p-0">
          <div className="bg-dark text-light h-100">
            {SiderbarContent}
          </div>
        </div>
      </div>

      {showOffcanvas && <div className="offcanvas-backdrop fade show" onClick={() => setShowOffcanvas(false)} />}
    </>
  );
}

export { Siderbar };