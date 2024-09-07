import { useContext } from "react";
import { baseUrl } from "../constants";
import { UserContext } from "../context/UserContext";
import { apiInstance } from "../utils/axios";

export const AddProduct = () => {
  const { user } = useContext(UserContext);

  const addProduct = async (data) => {
    // const body = JSON.stringify(data);
    // console.log(data.get("image"));

    return apiInstance
      .post("/products/", data)
      .then((res) => false)
      .catch((err) => true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("user", user?.user?.id);
    formData.set("active", true);
    console.log(Object.fromEntries(formData));

    const res = await addProduct(formData);
    if (res) {
      alert("some error occured");
    } else {
      e.target.reset();
      alert("Data added successfully");
    }
  };
  return (
    <form
      // encType="multipart/form-data"
      // method="POST"
      className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16"
      // action="http://localhost:8000/api/products/"
      onSubmit={handleFormSubmit}
    >
      <div className="">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              required
              name="name"
              id="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Add product description
          </label>
          <div className="mt-2">
            <textarea
              rows={4}
              required
              name="description"
              id="description"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Price
          </label>
          <div className="mt-2">
            <input
              required
              type="number"
              min={0}
              name="price"
              id="price"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Rs."
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Category
          </label>
          <div className="mt-2">
            <input
              type="text"
              required
              name="category"
              id="category"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Sub Category
          </label>
          <div className="mt-2">
            <input
              type="text"
              required
              name="subcategory"
              id="category"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Select product image
          </label>
          <input
            // required
            className="mt-1"
            type="file"
            name="image"
            id="image"
            accept="image/*"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add product
        </button>
      </div>
    </form>
  );
};
