import { PRODUCTOS } from "../data/productos";
import ProductCard from "./ProductCard";

export default function Catalogo() {
  return (
    <section aria-labelledby="titulo-catalogo">
      <h2 id="titulo-catalogo" className="titulo-seccion">
        Productos típicos de la región
      </h2>
      <div className="grid">
        {PRODUCTOS.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </section>
  );
}
