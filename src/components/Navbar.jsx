import { ShoppingCart } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";

export default function Navbar({ onAbrirCarrito }) {
  const { totalUnidades } = useCarrito();

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Principal">
        <span className="navbar__marca">TIENDA PALMIRA</span>
        <button
          type="button"
          className="navbar__carrito"
          aria-label={`Abrir carrito (${totalUnidades} unidades)`}
          onClick={onAbrirCarrito}
        >
          <ShoppingCart size={26} aria-hidden="true" />
          {totalUnidades > 0 && (
            <span className="navbar__contador" data-testid="contador-carrito">
              {totalUnidades}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
