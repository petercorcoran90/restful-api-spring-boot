const $ = (selector) => document.querySelector(selector);

const getData = function () {
    fetch('/products', {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((error) => {
            console.log('Fetch error getting data: ', error);
        });
};

const validateProductFields = (name, description, price, quantity) => {
    let isValid = true;

    if (name === "") {
        $("#error_product_name").textContent = "This field is required.";
        isValid = false;
    } else {
        $("#error_product_name").textContent = "";
    }

    if (description === "") {
        $("#error_product_description").textContent = "This field is required.";
        isValid = false;
    } else {
        $("#error_product_description").textContent = "";
    }

    if (price === "") {
        $("#error_product_price").textContent = "This field is required.";
        isValid = false;
    } else if (isNaN(price) || parseFloat(price) <= 0) {
        $("#error_product_price").textContent = "Price must be a positive number.";
        isValid = false;
    } else {
        $("#error_product_price").textContent = "";
    }

    if (quantity === "") {
        $("#error_product_quantity").textContent = "This field is required.";
        isValid = false;
    } else if (isNaN(quantity) || parseInt(quantity) <= 0) {
        $("#error_product_quantity").textContent = "Quantity must be a positive integer.";
        isValid = false;
    } else {
        $("#error_product_quantity").textContent = "";
    }

    return isValid;
};


const addProduct = function () {
    const name = $("#product_name").value;
    const description = $("#product_description").value;
    const price = $("#product_price").value;
    const quantity = $("#product_quantity").value;

    if (validateProductFields(name, description, price, quantity)) {
        const product = {
            name: name,
            description: description,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        };

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(product)
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Product added successfully.");
                    fetchProducts();
                    clearProductForm();
                } else {
                    console.error("Error adding product.");
                }
            })
            .catch((error) => console.error("Error: ", error));
    }
};


const editProduct = function () {
    const id = prompt("Enter the ID of the product you want to edit:");

    if (!id) {
        console.log("No ID provided.");
        return;
    }

    const name = $("#product_name").value;
    const description = $("#product_description").value;
    const price = $("#product_price").value;
    const quantity = $("#product_quantity").value;

    if (validateProductFields(name, description, price, quantity)) {
        const product = {
            name: name,
            description: description,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        };

        const url = '/products/' + id;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(product)
        })
            .then((response) => {
                fetchProducts();
                clearProductForm();
                console.log("Status: " + response.status);
            });
    }
};

const deleteProduct = function () {
    const id = prompt("Enter the ID of the product you want to delete:");

    if (!id) {
        console.log("No ID provided.");
        return;
    }

    const url = '/products/' + id;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
    })
        .then((response) => {
            fetchProducts();
            console.log("Status: " + response.status);
        });
};

const display = (productsToDisplay) => {
    let html = `<thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>`;
    if (productsToDisplay.length > 0) {
        for (let product of productsToDisplay) {
            html += `<tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td>${product.description}</td>
                            <td>${"€" + product.price.toFixed(2)}</td>
                            <td>${product.quantity}</td>
                        </tr>`;
        }
    } else {
        html += `<tr>
                    <td colspan="5">No products found.</td>
                </tr>`;
    }
    html += `</tbody>`;
    $("#products_table").innerHTML = html;
};

const fetchProducts = function () {
    fetch('/products', {
        headers: { 'Accept': 'application/json' }
    })
        .then((response) => response.json())
        .then((data) => {
            products = data;
            display(products);
        })
        .catch((error) => console.log('Error fetching products: ', error));
};

let isSearchActive = false; // Flag to track search state

const searchProductByName = function () {
    const searchButton = $("#search_btn");

    if (isSearchActive) {
        display(products);
        searchButton.textContent = "Search";
        isSearchActive = false;
        return;
    }

    const searchValue = prompt("Enter the product name to search for:");

    if (!searchValue || searchValue === "") {
        console.log("Search input is empty. Displaying all products.");
        display(products);
        return;
    }

    // Perform the search
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase() === searchValue.toLowerCase()
    );

    display(filteredProducts);

    searchButton.textContent = "Back";
    isSearchActive = true;
};

const clearProductForm = function () {
    $("#product_name").value = "";
    $("#product_description").value = "";
    $("#product_price").value = "";
    $("#product_quantity").value = "";
    $("#product_name").focus();
};

document.addEventListener('DOMContentLoaded', () => {
    $("#create_btn").addEventListener("click", addProduct);
    $("#update_btn").addEventListener("click", editProduct);
    $("#delete_btn").addEventListener("click", deleteProduct);
    $("#search_btn").addEventListener("click", searchProductByName);
    $("#product_name").focus();
    fetchProducts();
});

