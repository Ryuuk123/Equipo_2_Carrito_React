import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTOS } from "../data/productos";
import { useToast } from "./ToastContext";

export const MSG_MAX = "Este es el máximo de producto disponible en stock";
const CLAVE_STORAGE = "tienda-palmira-carrito";

const buscarProducto = (id) => PRODUCTOS.find((p) => p.id === id);

// Lee el carrito guardado y descarta datos inválidos o fuera de stock.
function cargarCarrito() {
  try {
    const crudo = JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? "[]");
    if (!Array.isArray(crudo)) return [];
    return crudo
      .map(({ id, cantidad }) => {
        const p = buscarProducto(id);
        if (!p || !Number.isInteger(cantidad) || cantidad < 1) return null;
        return { id, cantidad: Math.min(cantidad, p.stock) };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const { mostrar } = useToast();
  const [items, setItems] = useState(cargarCarrito);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [items]);

  const cantidadDe = (id) => items.find((i) => i.id === id)?.cantidad ?? 0;
  const disponible = (id) => buscarProducto(id).stock - cantidadDe(id);

  // Corrige al stock máximo y avisa con toast. Devuelve la cantidad aplicada.
  const limitarAStock = (id, n) => {
    const { stock } = buscarProducto(id);
    if (n > stock) {
      mostrar(MSG_MAX);
      return stock;
    }
    return n;
  };

  const fijarCantidad = (id, n) =>
    setItems((prev) =>
      prev.some((i) => i.id === id)
        ? prev.map((i) => (i.id === id ? { ...i, cantidad: n } : i))
        : [...prev, { id, cantidad: n }]
    );

  // Suma a la línea existente (nunca duplica líneas).
  const agregar = (id, cantidad) => fijarCantidad(id, limitarAStock(id, cantidadDe(id) + cantidad));

  const cambiarCantidad = (id, n) => {
    const aplicada = limitarAStock(id, n);
    fijarCantidad(id, aplicada);
    return aplicada;
  };

  const eliminar = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const avisarMinimo = (id) =>
    mostrar(`Esta es la cantidad mínima (1). ¿Deseas eliminar «${buscarProducto(id).nombre}» del carrito?`, {
      accion: { etiqueta: "Sí, eliminar", onClick: () => eliminar(id) },
      duracion: 8000,
    });

  const aumentar = (id) => cambiarCantidad(id, cantidadDe(id) + 1);
  const disminuir = (id) => (cantidadDe(id) <= 1 ? avisarMinimo(id) : cambiarCantidad(id, cantidadDe(id) - 1));

  const lineas = useMemo(
    () =>
      items.map(({ id, cantidad }) => {
        const p = buscarProducto(id);
        return { ...p, cantidad, subtotal: p.precio * cantidad };
      }),
    [items]
  );
  const totalUnidades = lineas.reduce((s, l) => s + l.cantidad, 0);
  const totalCompra = lineas.reduce((s, l) => s + l.subtotal, 0);

  const valor = {
    lineas,
    totalUnidades,
    totalCompra,
    disponible,
    limitarAStock,
    agregar,
    cambiarCantidad,
    aumentar,
    disminuir,
    avisarMinimo,
    eliminar,
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}
