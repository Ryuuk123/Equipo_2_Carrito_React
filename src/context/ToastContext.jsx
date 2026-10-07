import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import ToastContainer from "../components/ToastContainer";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const contador = useRef(0);

  const cerrar = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Si ya hay un toast con el mismo mensaje, se reemplaza (evita apilar repetidos).
  const mostrar = useCallback((mensaje, { accion = null, duracion = 5000 } = {}) => {
    contador.current += 1;
    const id = contador.current;
    setToasts((prev) =>
      [...prev.filter((t) => t.mensaje !== mensaje), { id, mensaje, accion, duracion }].slice(-4)
    );
    return id;
  }, []);

  const valor = useMemo(() => ({ mostrar, cerrar }), [mostrar, cerrar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <ToastContainer toasts={toasts} onCerrar={cerrar} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
