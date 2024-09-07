import React, { useContext, useEffect, useState } from "react";
import { apiInstance } from "../utils/axios";
import { ModalContext } from "../context/ModelContext";
import { Modal } from "../components/Modal";
import { Progress } from "../components/Progress";
import { baseUrl } from "../constants";

export const Tracking = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const { open, setOpen } = useContext(ModalContext);
  const [productJourney, setProductJourney] = useState([]);

  useEffect(() => {
    apiInstance
      .get("/products/")
      .then((res) => setProducts(res.data));
  }, []);

  const fetchProductJourney = (id) => {
    apiInstance
      .get(`${baseUrl}/product-journeys/?product=${id}`)
      .then((res) => setProductJourney(res.data));
  };

  return (
    <section
      aria-labelledby="product-heading"
      className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
    >
      <Modal title={"New Model"}>
        <Progress productJourney={productJourney} />
      </Modal>
      <h2 id="product-heading" className="sr-only">
        Products
      </h2>

      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            onClick={async () => {
              // setCurrentProduct(product);
              await fetchProductJourney(product?.id);
              setOpen(true);
            }}
          >
            <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
              <img
                src={product.image}
                alt={product.image}
                className="h-full w-full object-cover object-center sm:h-full sm:w-full"
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-900">
                <a
                  onClick={() => {
                    // setOpenedProduct(product);
                    setOpen(true);
                  }}
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </a>
              </h3>
              <p className="text-sm text-gray-500">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
