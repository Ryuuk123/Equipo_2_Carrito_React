import { useCallback, useState } from "react";
import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";
import Catalogo from "./components/Catalogo";
import CarritoPanel from "./components/CarritoPanel";

export default function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const cerrarCarrito = useCallback(() => setCarritoAbierto(false), []);

  return (
    <ToastProvider>
      <CarritoProvider>
        <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />
        <main className="contenido">
          <Catalogo />
        </main>
        <CarritoPanel abierto={carritoAbierto} onCerrar={cerrarCarrito} />
      </CarritoProvider>
    </ToastProvider>
  );
}
