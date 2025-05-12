import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src="/assets/catolica-logo.svg"
              alt="Logo da Católica"
              className="h-12 mr-3"
              style={{
                filter:
                  "invert(22%) sepia(12%) saturate(6308%) hue-rotate(327deg) brightness(83%) contrast(85%)",
              }}
            />
            <span className="text-primary-600 font-medium">
              Universidade Católica
            </span>
          </div>

          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} - Trabalho de Programação Linear -
            Todos os direitos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
