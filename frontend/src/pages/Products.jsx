import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { ProductDetail } from "../components/ProductDetail";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { baseUrl } from "../constants";

const breadcrumbs = [{ id: 1, name: "Men", href: "#" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Products = () => {
  const { user } = useContext(UserContext);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [openedProduct, setOpenedProduct] = useState({});

  const [filters, setFilters] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState("");

  // Handle checkbox change
  // const handleFilterChange = (sectionId, value) => {
  //   setSelectedOptions((prev) => ({
  //     ...prev,
  //     [sectionId]: value,
  //   }));
  // };

  const [currentFilter, setCurrentFilter] = useState({
    category: "",
    subcategory: [],
  });
  const getProducts = async () => {
    await fetch(
      `${baseUrl}/products/?bought=false&active=True&category=${
        currentFilter?.category || ""
      }&subcategory=${currentFilter?.subcategory?.join(",") || ""}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.log(err));
  };

  const getFilters = async () => {
    await fetch("http://localhost:8000/api/filters/")
      .then((res) => res.json())
      .then((data) => {
        setFilters(data);
      })
      .catch((err) => console.log(err));
  };

  const handleFilterChange = (e, label, value) => {
    const category = e.target.value.toLowerCase();
    if (e.target.checked) {
      setCurrentFilter({ ...currentFilter, category });
    } else {
      setCurrentFilter({ category: "", subcategory: [] });
    }
    if (selectedOptions === `${label}-${value}`) {
      setSelectedOptions("");
    } else setSelectedOptions(`${label}-${value}`);
  };

  const handleChangeSubcategory = (e) => {
    const subcategory = e.target.value.toLowerCase();
    if (e.target.checked && subcategory) {
      setCurrentFilter({
        ...currentFilter,
        subcategory: [...currentFilter.subcategory, subcategory],
      });
    } else {
      const sub = currentFilter.subcategory?.filter((i) => i !== subcategory);
      setCurrentFilter({ ...currentFilter, subcategory: sub });
    }
  };

  useEffect(() => {
    getProducts();
  }, [currentFilter]);

  useEffect(() => {
    getFilters();
  }, []);

  return (
    <div className="bg-white">
      <ProductDetail
        isNgo={user?.user?.is_ngo}
        open={open}
        setOpen={setOpen}
        product={openedProduct}
        getProducts={getProducts}
      />
      <div>
        {/* Mobile filter dialog */}
        <Transition show={mobileFiltersOpen}>
          <Dialog
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <TransitionChild
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div className="fixed inset-0 z-40 flex">
              <TransitionChild
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="relative -mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4">
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 pb-4 pt-4"
                      >
                        {({ open }) => (
                          <fieldset>
                            <legend className="w-full px-2">
                              <DisclosureButton className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                <span className="text-sm font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </DisclosureButton>
                            </legend>
                            <DisclosurePanel className="px-4 pb-2 pt-4">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value}>
                                    <div className="flex items-center">
                                      <input
                                        id={`${section.id}-${optionIdx}-mobile`}
                                        name={`${section.id}[]`}
                                        // defaultValue={option.value}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        onChange={handleFilterChange}
                                        value={option.label}
                                      />
                                      <label
                                        htmlFor={`${section.id}-${optionIdx}-mobile`}
                                        className="ml-3 text-sm text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                    <div className="mb-8 ml-8">
                                      {option.subcategories.map((sub, _) => (
                                        <div
                                          key={sub.value}
                                          className="flex items-center"
                                        >
                                          <input
                                            id={`${section.id}-${sub.name}`}
                                            name={`${section.id}[]`}
                                            // defaultValue={option.value}
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={handleChangeSubcategory}
                                            value={sub.label}
                                          />
                                          <label
                                            htmlFor={`${section.id}-${sub.name}`}
                                            className="ml-3 text-sm text-gray-600"
                                          >
                                            {sub.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </DisclosurePanel>
                          </fieldset>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        <div className="border-b border-gray-200">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <ol role="list" className="flex items-center space-x-4 py-4">
              {breadcrumbs.map((breadcrumb) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center">
                    <a
                      href={breadcrumb.href}
                      className="mr-4 text-sm font-medium text-gray-900"
                    >
                      {breadcrumb.name}
                    </a>
                    <svg
                      viewBox="0 0 6 20"
                      aria-hidden="true"
                      className="h-5 w-auto text-gray-300"
                    >
                      <path
                        d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </li>
              ))}
              <li className="text-sm">
                <a
                  href="#"
                  aria-current="page"
                  className="font-medium text-gray-500 hover:text-gray-600"
                >
                  New Arrivals
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
          <div className="border-b border-gray-200 pb-10 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>
          </div>

          <div className="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            <aside>
              <h2 className="sr-only">Filters</h2>

              <button
                type="button"
                className="inline-flex items-center lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="text-sm font-medium text-gray-700">
                  Filters
                </span>
                <PlusIcon
                  className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </button>

              <div className="hidden lg:block">
                <form className="space-y-10 divide-y divide-gray-200">
                  {filters.map((section, sectionIdx) => (
                    <div
                      key={section.name}
                      className={sectionIdx === 0 ? "" : "pt-10"}
                    >
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-900">
                          {section.name}
                        </legend>
                        <div className="space-y-3 pt-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value}>
                              <div className="flex items-center">
                                <input
                                  id={`${option.label}-${option.value}`}
                                  name={`${section.id}[]`}
                                  // defaultValue={option.value}
                                  type="checkbox"
                                  checked={
                                    selectedOptions ===
                                    `${option.label}-${option.value}`
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  // onChange={handleFilterChange}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      e,
                                      option.label,
                                      option.value
                                    )
                                  }
                                  value={option.label}
                                />
                                <label
                                  htmlFor={`${option.label}-${option.value}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                              <div className="mb-8 ml-8">
                                {option.subcategories.map((sub, _) => (
                                  <div
                                    key={sub.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`${option.label}-${sub.label}`}
                                      name={`${section.id}[]`}
                                      // defaultValue={option.value}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onChange={handleChangeSubcategory}
                                      value={sub.label}
                                    />
                                    <label
                                      htmlFor={`${option.label}-${sub.label}`}
                                      className="ml-3 text-sm text-gray-600"
                                    >
                                      {sub.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  ))}
                </form>
              </div>
            </aside>

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
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.name}
                        </a>
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
