import React from "react";
import { Container } from "react-bootstrap";
import "./footer.css";

const FOOTER_HEIGHT = 56; // usado no CSS para padding-bottom da .content

const Footer = () => {
  return (
    <footer className="app-footer bg-dark text-light py-2" role="contentinfo">
      <Container className="px-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="text-center text-md-start mb-2 mb-md-0">
            <small className="d-block mb-0">
              &copy; {new Date().getFullYear()} Painel Administrativo - Todos os direitos reservados.
            </small>
          </div>

          <div className="text-center text-md-end">
            <small>
              Desenvolvido por{" "}
              <a
                href="https://integraseller.com.br"
                target="_blank"
                rel="noreferrer"
                className="text-light fw-bold"
              >
                IntegraSeller
              </a>
            </small>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;