import React, { useState, useEffect } from "react";
import Product from "./Product/Product";
import "./Api.css";

const Api = () => {
  const [data, setData] = useState([]);
  const [addButton, setAddButton] = useState(false);
  const [errors, setErrors] = useState({});
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: "",
    sale: "",
    description: "",
    hasDelivery: "default",
  });

  console.log(data);

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(data);
    }
  };

  useEffect(() => {
    getPosts();
    handleSaveProduct();
  }, []);

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error: We have an error on deletion");
      }

      getPosts();
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProduct = (id, updatedProduct) => {
    const updatedData = data.map((product) =>
      product.id === id ? updatedProduct : product
    );
    setData(updatedData);
  };

  const handleToggle = () => setAddButton(!addButton);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "hasDelivery" ? value === "true" : value,
    });
  };

  const handleAddPost = async () => {
    const errorsFound = validate();
    setErrors(errorsFound);

    if (Object.keys(errorsFound).length > 0) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Error: Problems with posting data");
      }

      getPosts();
      return await response.json();
    } catch (error) {
      console.error(error.message);
    }
  };

  const validate = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z ]{2,30}$/;
    const idRegex = /^[0-9]+$/;

    if (!newProduct.id.trim()) {
      errors.id = "ID is required";
    } else if (!idRegex.test(newProduct.id)) {
      errors.id = "ID is not valid";
    }

    if (!newProduct.name.trim()) {
      errors.name = "Name is required";
    } else if (!nameRegex.test(newProduct.name)) {
      errors.name = "Name is not valid";
    }

    if (!newProduct.price.trim()) {
      errors.price = "Price is required";
    } else if (isNaN(newProduct.price) || +newProduct.price < 20) {
      errors.price = "Price must be higher than 20$";
    }

    if (!newProduct.description.trim()) {
      errors.description = "Description is required";
    }

    if (newProduct.hasDelivery === "default") {
      errors.hasDelivery = "Delivery option is required";
    }

    return errors;
  };

  return (
    <div>
      <div>
        <div className="first-button">
          <button className="btnn" onClick={handleToggle}>
            {!addButton ? "Add Product" : "Close Form"}
          </button>
        </div>
        {addButton && (
          <div className="input-kutia">
            <label>ID</label>
            <input
              value={newProduct.id}
              onChange={(e) => handleInput(e)}
              name="id"
            />
            {errors && <p className="error">{errors.id}</p>}
            <label>Name</label>
            <input
              value={newProduct.name}
              onChange={(e) => handleInput(e)}
              name="name"
            />
            {errors && <p className="error">{errors.name}</p>}
            <label>Price:</label>
            <input
              value={newProduct.price}
              onChange={(e) => handleInput(e)}
              name="price"
            />
            {errors.price && <p className="error">{errors.price}</p>}
            <label>Sale %</label>
            <input
              value={newProduct.sale}
              onChange={(e) => handleInput(e)}
              name="sale"
            />
            {errors.sale && <p className="error">{errors.sale}</p>}
            <label>Description</label>
            <input
              value={newProduct.description}
              onChange={(e) => handleInput(e)}
              name="description"
            />
            {errors.description && (
              <p className="error">{errors.description}</p>
            )}
            <label>Delivery</label>
            <select
              value={newProduct.hasDelivery}
              name="hasDelivery"
              onChange={(e) => handleInput(e)}
              required
            >
              <option value="default">Select Please</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
            {errors.hasDelivery && (
              <p className="error">{errors.hasDelivery}</p>
            )}
            <button className="butonadd" onClick={handleAddPost}>
              Add Product
            </button>
          </div>
        )}
      </div>
      <div className="produktetposht">
        {data.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            sale={product.sale}
            description={product.description}
            hasDelivery={product.hasDelivery}
            fshiePostin={() => handleDeletePost(product.id)}
            saveProduct={handleSaveProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default Api;
