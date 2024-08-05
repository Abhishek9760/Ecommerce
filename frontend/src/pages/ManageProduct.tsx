import React, { useContext, useEffect, useState } from "react";
import { apiInstance } from "../utils/axios";
import { UserContext } from "../context/UserContext";
import { ProductDetail } from "../components/ProductDetail";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const { user, deleteProduct } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [openedProduct, setOpenedProduct] = useState({});

  const getProductsByUserId = () => {
    if (user?.user?.id) {
      apiInstance
        .get(`/products/?user=${user?.user?.id}`, {
          params: { userId: user?.user?.id },
        })
        .then((response) => setProducts(response?.data));
    }
  };

  useEffect(() => {
    getProductsByUserId();
  }, [user]);

  const deleteProductByProductId = (id) => {
    deleteProduct(id).then((res) => {
      setOpen(false);
      getProductsByUserId();
    });
  };

  return (
    <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <ProductDetail
        deleteProduct={deleteProductByProductId}
        isOwn={true}
        open={open}
        setOpen={setOpen}
        product={openedProduct}
      />
      <div className="border-b border-gray-200 pb-10 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          New Arrivals
        </h1>
        <p className="mt-4 text-base text-gray-500">
          Checkout out the latest release of Basic Tees, new and improved with
          four openings!
        </p>
      </div>
      <div className="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        <section
          aria-labelledby="product-heading"
          className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
        >
          <h2 id="product-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
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
                        setOpenedProduct(product);
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
      </div>
    </main>
  );
};

export default ManageProduct;
