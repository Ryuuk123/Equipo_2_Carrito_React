import { useEffect, useState } from "react";

/**
 * Campo de cantidad reutilizable: solo enteros positivos.
 * - onChange(n) recibe n >= 1 y puede devolver la cantidad realmente aplicada (p. ej. corregida al stock).
 * - onMinimo() se llama cuando el usuario escribe 0 (el valor anterior se conserva).
 */
export default function CantidadInput({ value, max, onChange, onMinimo, label }) {
  const [texto, setTexto] = useState(String(value));

  useEffect(() => {
    setTexto(String(value));
  }, [value]);

  // Bloquea cualquier carácter que no sea dígito (e, E, +, -, ., , y demás).
  const handleKeyDown = (e) => {
    const esCaracter = e.key.length === 1;
    const conAtajo = e.ctrlKey || e.metaKey || e.altKey;
    if (esCaracter && !/^\d$/.test(e.key) && !conAtajo) e.preventDefault();
  };

  // Solo se acepta lo pegado si son únicamente dígitos.
  const handlePaste = (e) => {
    const pegado = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pegado)) e.preventDefault();
  };

  const handleChange = (e) => {
    const limpio = e.target.value.replace(/\D/g, "");
    if (limpio === "") {
      setTexto(""); // permite borrar para escribir otro número
      return;
    }
    const n = parseInt(limpio, 10);
    if (n < 1) {
      onMinimo?.(); // conserva el valor anterior
      return;
    }
    const aplicada = onChange(n);
    setTexto(String(aplicada ?? n));
  };

  const handleBlur = () => {
    if (texto === "") setTexto(String(value));
  };

  return (
    <input
      className="cantidad-input"
      type="number"
      inputMode="numeric"
      min={1}
      max={max}
      step={1}
      value={texto}
      aria-label={label}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onChange={handleChange}
      onBlur={handleBlur}
      onWheel={(e) => e.currentTarget.blur()}
    />
  );
}
