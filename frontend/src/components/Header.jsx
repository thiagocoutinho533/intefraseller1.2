import React from "react";
import { Container, Button } from "react-bootstrap";
import { Bell, BoxArrowRight } from "react-bootstrap-icons";
import "./header.css";

const HEADER_HEIGHT = 64;

const Header = ({ onLogout, onNotifications }) => {
  return (
    <header
      className="app-header bg-dark text-light shadow-sm fixed-top"
      role="banner"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* Container full-width, mas o .header-inner centraliza e limita a largura,
          assim o título alinha com o container do conteúdo principal */}
      <Container fluid className="px-0 h-100">
        <div className="header-inner h-100 d-flex align-items-center">
          {/* Título (ALINHADO À ESQUERDA da área de conteúdo) */}
          <div className="admin-title-wrapper">
           
            <small className="text-muted d-none d-md-inline">Visão geral</small>
          </div>

          {/* Ações à direita */}
          <div className="ms-auto header-actions d-flex align-items-center gap-2">
            <Button
              variant="outline-light"
              size="sm"
              onClick={onNotifications}
              aria-label="Notificações"
              className="d-flex align-items-center py-1"
            >
              <Bell size={18} className="me-1" />
              <span className="d-none d-sm-inline">Notificações</span>
            </Button>

            <Button
              variant="outline-light"
              size="sm"
              onClick={onLogout}
              aria-label="Sair"
              className="d-flex align-items-center py-1"
            >
              <BoxArrowRight size={18} className="me-1" />
              <span className="d-none d-sm-inline">Sair</span>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;