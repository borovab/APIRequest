import React, { useEffect, useState } from "react";
import "./Product.css";

const Product = ({
  id,
  name,
  price,
  description,
  hasDelivery,
  sale,
  fshiePostin,
  saveProduct,
}) => {
  const [changed, setChanged] = useState(true);
  const [errors, setErrors] = useState({});

  const [editProduct, setEditProduct] = useState({
    id: id,
    name: name,
    price: price,
    sale: sale,
    description: description,
    hasDelivery: hasDelivery,
  });

  const handleEdit = async (id, editProduct) => {
    const errorsFound = validate();
    setErrors(errorsFound);

    if (Object.keys(errorsFound).length > 0) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editProduct),
      });

      if (!response.ok) {
        throw new Error("Error: Problems with updating data");
      }

      saveProduct(id, editProduct);
      handleEditToggle();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditToggle = () => setChanged(!changed);

  const validate = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z ]{2,30}$/;

    if (!editProduct.name.trim()) {
      errors.name = "Name is required";
    } else if (!nameRegex.test(editProduct.name)) {
      errors.name = "Name is not valid";
    }

    if (!editProduct.price.trim()) {
      errors.price = "Price is required";
    } else if (isNaN(editProduct.price) || +editProduct.price < 20) {
      errors.price = "Price must be higher than 20$";
    }

    if (!editProduct.description.trim()) {
      errors.description = "Description is required";
    }

    if (editProduct.hasDelivery === "default") {
      errors.hasDelivery = "Delivery option is required";
    }

    return errors;
  };

  useEffect(() => {
    console.log(editProduct);
    console.log(changed);
  });

  const merreInputin = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: name === "hasDelivery" ? value === "true" : value,
    });
  };

  const delStyle = {
    color: "white",
    padding: "5px",
    borderRadius: "5px",
    fontSize: "16px",
    background: hasDelivery ? "green" : "tomato",
  };

  const priceStyle = {
    textDecoration: sale !== "" ? "line-through" : null,
    textDecorationColor: "red",
  };

  return (
    <div className="productStyle">
      <span className="id">ID : {id}</span>
      <span>Product: {name}</span>
      {!changed && (
        <input
          onChange={(e) => merreInputin(e)}
          placeholder="Set new product name"
          name="name"
          value={editProduct.name}
        />
      )}
      {errors && <p className="error">{errors.name}</p>}
      <div>
        Price: <span style={priceStyle}>${price}</span>{" "}
        {sale !== "" ? ` ${price - (+price * sale) / 100}$` : null}{" "}
      </div>
      {!changed && (
        <input
          onChange={(e) => merreInputin(e)}
          placeholder="Set new product price"
          name="price"
          value={editProduct.price}
        />
      )}
      {errors && <p className="error">{errors.price}</p>}
      {!changed && (
        <input
          onChange={(e) => merreInputin(e)}
          placeholder="Set new product sale"
          name="sale"
          value={editProduct.sale}
        />
      )}
      {errors && <p className="error">{errors.sale}</p>}
      <span>Description: {description}</span>
      {!changed && (
        <input
          onChange={(e) => merreInputin(e)}
          placeholder="Set new product description"
          name="description"
          value={editProduct.description}
        />
      )}
      {errors && <p className="error">{errors.description}</p>}
      <div>
        Delivery:{" "}
        {hasDelivery ? (
          <span style={delStyle}>AVAILABLE</span>
        ) : (
          <span style={delStyle}>NOT AVAILABLE</span>
        )}
      </div>
      {!changed && (
        <select
          value={editProduct.hasDelivery}
          onChange={(e) => merreInputin(e)}
          name="hasDelivery"
        >
          <option value="default">Select Please</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      )}
      {errors && <p className="error">{errors.hasDelivery}</p>}
      <button className="clseditbtn" onClick={handleEditToggle}>
        {!changed ? "Close Form" : "Edit Product"}
      </button>
      {!changed && (
        <button className="savebtn" onClick={() => handleEdit(id, editProduct)}>
          Save Product
        </button>
      )}
      <button className="deletebtn" onClick={() => fshiePostin(id)}>
        Delete Product
      </button>
    </div>
  );
};

export default Product;
