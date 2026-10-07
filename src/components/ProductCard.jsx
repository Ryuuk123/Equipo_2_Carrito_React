import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import { formatoCOP } from "../utils/formato";
import CantidadInput from "./CantidadInput";

export default function ProductCard({ producto }) {
  const { agregar, disponible, limitarAStock } = useCarrito();
  const { mostrar } = useToast();
  const [cantidad, setCantidad] = useState(1);
  const libres = disponible(producto.id);

  const alCambiar = (n) => {
    const aplicada = limitarAStock(producto.id, n);
    setCantidad(aplicada);
    return aplicada;
  };

  const alAgregar = () => {
    agregar(producto.id, cantidad);
    setCantidad(1);
  };

  return (
    <article className="card" data-testid={`producto-${producto.id}`}>
      <h3 className="card__nombre">{producto.nombre}</h3>
      <p className="card__precio">{formatoCOP(producto.precio)}</p>
      <p className={`card__stock${libres === 0 ? " card__stock--agotado" : ""}`}>
        {libres === 0 ? "Sin unidades disponibles" : `Stock disponible: ${libres}`}
      </p>
      <div className="card__acciones">
        <CantidadInput
          value={cantidad}
          max={producto.stock}
          label={`Cantidad a agregar de ${producto.nombre}`}
          onChange={alCambiar}
          onMinimo={() => mostrar("La cantidad mínima es 1.")}
        />
        <button
          type="button"
          className="btn btn--primario"
          disabled={libres <= 0}
          aria-label={`Agregar ${producto.nombre} al carrito`}
          onClick={alAgregar}
        >
          Agregar
        </button>
      </div>
    </article>
  );
}
