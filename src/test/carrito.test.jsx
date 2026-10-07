import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
import { MSG_MAX } from "../context/CarritoContext";
import { formatoCOP } from "../utils/formato";

const CAFE = "Café de Huila 500 g";
const PANELA = "Panela orgánica 1 kg";
const AREPA = "Arepa de choclo x6";
const CHOCOLATE = "Chocolate de mesa";

const inputCatalogo = (nombre) => screen.getByLabelText(`Cantidad a agregar de ${nombre}`);
const inputCarrito = (nombre) => screen.getByLabelText(`Cantidad en el carrito de ${nombre}`);
const botonAgregar = (nombre) => screen.getByRole("button", { name: `Agregar ${nombre} al carrito` });

const agregar = (nombre, cantidad) => {
  fireEvent.change(inputCatalogo(nombre), { target: { value: String(cantidad) } });
  fireEvent.click(botonAgregar(nombre));
};
const abrirCarrito = () => fireEvent.click(screen.getByRole("button", { name: /abrir carrito/i }));
const cambiar = (input, valor) => fireEvent.change(input, { target: { value: valor } });

beforeEach(() => {
  localStorage.clear();
  render(<App />);
});

describe("Casos de prueba del instructor", () => {
  it("1. Teclear e, E, +, -, . o , no escribe nada (catálogo y carrito)", () => {
    agregar(CAFE, 1);
    abrirCarrito();
    for (const input of [inputCatalogo(CAFE), inputCarrito(CAFE)]) {
      for (const key of ["e", "E", "+", "-", ".", ","]) {
        // fireEvent devuelve false cuando se llamó preventDefault
        expect(fireEvent.keyDown(input, { key })).toBe(false);
      }
      expect(fireEvent.keyDown(input, { key: "5" })).toBe(true);
      expect(fireEvent.keyDown(input, { key: "Backspace" })).toBe(true);
    }
  });

  it("2. Pegar -5, 3e2 o abc no se pega; solo dígitos", () => {
    const input = inputCatalogo(CAFE);
    for (const texto of ["-5", "3e2", "abc"]) {
      expect(fireEvent.paste(input, { clipboardData: { getData: () => texto } })).toBe(false);
    }
    expect(fireEvent.paste(input, { clipboardData: { getData: () => "123" } })).toBe(true);
  });

  it("3. Escribir 0 en la tarjeta conserva el valor y muestra toast de mínimo 1", () => {
    const input = inputCatalogo(CAFE);
    cambiar(input, "0");
    expect(input).toHaveValue(1);
    expect(screen.getByText(/cantidad mínima es 1/i)).toBeInTheDocument();
  });

  it("4. Escribir 0 en el carrito no cambia la cantidad y ofrece eliminar", () => {
    agregar(CAFE, 2);
    abrirCarrito();
    cambiar(inputCarrito(CAFE), "0");
    expect(inputCarrito(CAFE)).toHaveValue(2);
    expect(screen.getByText(/cantidad mínima/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sí, eliminar" })).toBeInTheDocument();
  });

  it("5. Escribir 999 con stock 8 corrige a 8 y muestra el toast de máximo", () => {
    const input = inputCatalogo(CAFE);
    cambiar(input, "999");
    expect(input).toHaveValue(8);
    expect(screen.getByText(MSG_MAX)).toBeInTheDocument();
  });

  it("6. Panela (stock 3): agregar 2 y luego 2 más deja 3 y muestra el toast", () => {
    agregar(PANELA, 2);
    agregar(PANELA, 2);
    abrirCarrito();
    expect(inputCarrito(PANELA)).toHaveValue(3);
    expect(screen.getByText(MSG_MAX)).toBeInTheDocument();
  });

  it("7. En el carrito, + con cantidad igual al stock no sube y muestra el toast", () => {
    agregar(PANELA, 3);
    abrirCarrito();
    fireEvent.click(screen.getByRole("button", { name: `Aumentar cantidad de ${PANELA}` }));
    expect(inputCarrito(PANELA)).toHaveValue(3);
    expect(screen.getByText(MSG_MAX)).toBeInTheDocument();
  });

  it("8. − con cantidad 1 muestra toast de mínimo; al confirmar elimina y recalcula", () => {
    agregar(CAFE, 1);
    agregar(AREPA, 1);
    abrirCarrito();
    expect(screen.getByTestId("total-compra")).toHaveTextContent(formatoCOP(28500 + 12000));

    fireEvent.click(screen.getByRole("button", { name: `Disminuir cantidad de ${AREPA}` }));
    expect(inputCarrito(AREPA)).toHaveValue(1);
    expect(screen.getByText(/cantidad mínima/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sí, eliminar" }));
    expect(screen.queryByTestId("linea-3")).not.toBeInTheDocument();
    expect(screen.getByTestId("total-compra")).toHaveTextContent(formatoCOP(28500));
  });

  it("9. Agregar dos veces el mismo producto deja una sola línea con cantidades sumadas", () => {
    agregar(CAFE, 1);
    agregar(CAFE, 1);
    abrirCarrito();
    const panel = within(screen.getByRole("dialog"));
    expect(panel.getAllByTestId(/^linea-/)).toHaveLength(1);
    expect(inputCarrito(CAFE)).toHaveValue(2);
  });

  it("10. Café ×2, Panela ×3 y Arepa ×1: subtotales y total correctos", () => {
    agregar(CAFE, 2);
    agregar(PANELA, 3);
    agregar(AREPA, 1);
    abrirCarrito();
    expect(screen.getByTestId("subtotal-1")).toHaveTextContent(formatoCOP(57000));
    expect(screen.getByTestId("subtotal-2")).toHaveTextContent(formatoCOP(29400));
    expect(screen.getByTestId("subtotal-3")).toHaveTextContent(formatoCOP(12000));
    expect(screen.getByTestId("total-compra")).toHaveTextContent(formatoCOP(98400));
    expect(screen.getByTestId("total-unidades")).toHaveTextContent("6");
  });

  it("11. Agregar todo el stock (Chocolate ×1) deshabilita el botón Agregar", () => {
    expect(botonAgregar(CHOCOLATE)).toBeEnabled();
    agregar(CHOCOLATE, 1);
    expect(botonAgregar(CHOCOLATE)).toBeDisabled();
  });

  it("12. El ícono del carrito está a la derecha de la navbar y el contador suma unidades", () => {
    expect(screen.queryByTestId("contador-carrito")).not.toBeInTheDocument();
    agregar(CAFE, 2);
    agregar(PANELA, 3);
    agregar(AREPA, 1);

    const nav = screen.getByRole("navigation");
    const boton = screen.getByRole("button", { name: /abrir carrito/i });
    expect(nav.lastElementChild).toBe(boton);
    expect(nav.firstElementChild).toHaveTextContent("TIENDA PALMIRA");
    expect(screen.getByTestId("contador-carrito")).toHaveTextContent("6");
  });
});
