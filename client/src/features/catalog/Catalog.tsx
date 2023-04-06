import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    agent.Catalog.list().then(products => setProducts(products))
  }, []);

  return (
    <>
      <ProductList products={products} />
    </>
  );
}

export default Catalog;
