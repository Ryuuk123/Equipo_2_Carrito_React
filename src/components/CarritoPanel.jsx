import { useEffect, useRef } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import { formatoCOP } from "../utils/formato";
import CantidadInput from "./CantidadInput";

export default function CarritoPanel({ abierto, onCerrar }) {
  const { lineas, totalUnidades, totalCompra, cambiarCantidad, aumentar, disminuir, avisarMinimo, eliminar } =
    useCarrito();
  const botonCerrar = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    botonCerrar.current?.focus();
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <>
      <div className="fondo" onClick={onCerrar} aria-hidden="true" />
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="titulo-carrito">
        <div className="panel__cabecera">
          <h2 id="titulo-carrito">Tu carrito</h2>
          <button ref={botonCerrar} type="button" className="icono-btn" aria-label="Cerrar carrito" onClick={onCerrar}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {lineas.length === 0 ? (
          <p className="panel__vacio">Tu carrito está vacío.</p>
        ) : (
          <ul className="lineas">
            {lineas.map((l) => (
              <li key={l.id} className="linea" data-testid={`linea-${l.id}`}>
                <div className="linea__info">
                  <strong>{l.nombre}</strong>
                  <span>{formatoCOP(l.precio)} c/u</span>
                </div>
                <div className="linea__controles">
                  <button
                    type="button"
                    className="icono-btn"
                    aria-label={`Disminuir cantidad de ${l.nombre}`}
                    onClick={() => disminuir(l.id)}
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <CantidadInput
                    value={l.cantidad}
                    max={l.stock}
                    label={`Cantidad en el carrito de ${l.nombre}`}
                    onChange={(n) => cambiarCantidad(l.id, n)}
                    onMinimo={() => avisarMinimo(l.id)}
                  />
                  <button
                    type="button"
                    className="icono-btn"
                    aria-label={`Aumentar cantidad de ${l.nombre}`}
                    onClick={() => aumentar(l.id)}
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icono-btn icono-btn--peligro"
                    aria-label={`Quitar ${l.nombre} del carrito`}
                    onClick={() => eliminar(l.id)}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
                <p className="linea__subtotal">
                  Subtotal: <strong data-testid={`subtotal-${l.id}`}>{formatoCOP(l.subtotal)}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}

        <dl className="totales">
          <div>
            <dt>Total de unidades</dt>
            <dd data-testid="total-unidades">{totalUnidades}</dd>
          </div>
          <div className="totales__compra">
            <dt>Total de la compra</dt>
            <dd data-testid="total-compra">{formatoCOP(totalCompra)}</dd>
          </div>
        </dl>
      </aside>
    </>
  );
}
