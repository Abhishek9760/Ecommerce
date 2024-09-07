import { Profiler, useContext, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import { apiInstance } from "../utils/axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const ProductDetail = ({
  open,
  setOpen,
  product,
  isOwn,
  deleteProduct,
  isNgo,
  getProducts,
}) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const donateProduct = (e) => {
    const formData = new FormData(e.target);
    formData.set("product_id", product?.id);

    apiInstance
      .post("/products/donate/", formData, {
          headers: { Authorization: `Bearer ${user?.token}` },
        })
      .then((res) => alert("Product is donated"))
      .catch((err) => alert("Some error has occured"));
  };

  const claimProduct = () => {
    if (user?.user?.id) {
      const data = { bought_by: user?.user?.id, product_id: product?.id };
      apiInstance
        .post("/products/claim/", data, {
          headers: { Authorization: `Bearer ${user?.token}` },
        })
        .then((res) => {
          getProducts();
          setOpen(false);
        })
        .catch((err) => alert("Some error has occured"));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await donateProduct(e);
    // setOpen(false);
    // const id = product?.id;
    // const formData = new FormData(e.target);
    // const quantity = formData.get("quantity");
    // const newProd = { id, quantity, product };

    // await addToCart(newProd);
  };

  const addProdToCart = async () => {
    const id = product?.id;
    const newProd = { id, product };
    await addToCart(newProd);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                  <img
                    alt={product.image}
                    src={product.image}
                    className="object-cover object-center"
                  />
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                    {product.name}
                  </h2>

                  <section
                    aria-labelledby="information-heading"
                    className="mt-2"
                  >
                    <h3 id="information-heading" className="sr-only">
                      Product information
                    </h3>

                    <p className="text-2xl text-gray-900">{product.price}</p>
                  </section>

                  <section aria-labelledby="options-heading" className="mt-10">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>

                    <form onSubmit={handleFormSubmit}>
                      {product?.bought && user?.user.is_ngo &&  (
                        <>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Full Name
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                              <input
                                required
                                id="name"
                                name="name"
                                placeholder="Full Name"
                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Phone number
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                              <input
                                required
                                id="phone"
                                name="phone"
                                placeholder="+91xxxxxxxxxx"
                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Address
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                              <textarea
                                required
                                id="address"
                                name="address"
                                placeholder="Address"
                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {!isOwn ? (
                        !isNgo ? (
                          <button
                            // type="submit"
                            onClick={addProdToCart}
                            type="button"
                            className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Add to bag
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={claimProduct}
                          >
                            Claim
                          </button>
                        )
                      ) : !product?.bought ? (
                        <button
                          type="button"
                          onClick={() => deleteProduct(product?.id)}
                          className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                      ) : user?.user.is_ngo ? (
                        <button
                          type="submit"
                          className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Donate
                        </button>
                      ): <button
                          type="submit"
                          className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Select Ngo to Donate
                        </button>}
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
