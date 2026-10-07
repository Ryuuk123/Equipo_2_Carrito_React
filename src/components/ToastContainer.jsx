import { useEffect } from "react";
import { X } from "lucide-react";

function ToastItem({ toast, onCerrar }) {
  // Se cierra solo tras `duracion` ms.
  useEffect(() => {
    const t = setTimeout(() => onCerrar(toast.id), toast.duracion);
    return () => clearTimeout(t);
  }, [toast, onCerrar]);

  return (
    <div className="toast" role="status">
      <p className="toast__mensaje">{toast.mensaje}</p>
      {toast.accion && (
        <button
          type="button"
          className="btn btn--toast"
          onClick={() => {
            toast.accion.onClick();
            onCerrar(toast.id);
          }}
        >
          {toast.accion.etiqueta}
        </button>
      )}
      <button type="button" className="toast__cerrar" aria-label="Cerrar notificación" onClick={() => onCerrar(toast.id)}>
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onCerrar }) {
  return (
    <div className="toasts" role="region" aria-label="Notificaciones" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onCerrar={onCerrar} />
      ))}
    </div>
  );
}
