const productList = document.getElementById('list-products');
const cartContainer = document.getElementById('cartwrapper');
const finalPrice = document.getElementById('totalProducts');
const finish = document.getElementById('finish');

const renderizarCarrito = (carrito) => {
    while (cartContainer.firstChild) {
        cartContainer.removeChild(cartContainer.firstChild);
    }
    while (finalPrice.firstChild) {
        finalPrice.removeChild(finalPrice.firstChild);
    }
    if (!carrito.products.length) {
        finish.classList.add('disabled-button');
        finish.setAttribute('disabled', true);
        finish.textContent = 'Tu carrito está vacio';
    } else {
        finish.classList.remove('disabled-button');
        finish.removeAttribute('disabled');
        finish.textContent = 'Finalizar compra';
    }

    const finalPriceText = document.createTextNode(carrito.subtotal);
    finalPrice.appendChild(finalPriceText);

    if (!carrito.products.length) {
        const msjCarritoVacio = document.createElement('div');
        msjCarritoVacio.classList.add('emptyProductMsj');
        const msjCarritoVacioText = document.createTextNode('No seleccionaste ningún producto');
        msjCarritoVacio.appendChild(msjCarritoVacioText);
        cartContainer.appendChild(msjCarritoVacio);
        return
    }
    carrito.products.forEach((product) => {
        const DatabaseProduct = database.products.find((p) => p.ID === product.ID);

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const cartItemContent = document.createElement('div');
        cartItemContent.classList.add('cart-item-content');
        const itemPrice = document.createElement('div');

        const productName = document.createElement('p');
        const productNameText = document.createTextNode(DatabaseProduct.name);
        productName.classList.add('nombreprod')
        productName.appendChild(productNameText);

        const price = document.createElement('p');
        const priceText = document.createTextNode(`$${DatabaseProduct.price} x ${product.quantity}`);
        price.classList.add('precioprod');
        price.appendChild(priceText);

        const containerButton = document.createElement('div');

        const botonDisminuir = document.createElement('button');
        const botonTextDisminuir = document.createTextNode('-');
        botonDisminuir.classList.add('buttonsigno');
        botonDisminuir.appendChild(botonTextDisminuir);

        botonDisminuir.addEventListener('click', (e) => carrito.removeProducts(product.ID));

        const botonAumentar = document.createElement('button');
        const botonTextAumentar = document.createTextNode('+');
        botonAumentar.classList.add('buttonsigno');
        botonAumentar.appendChild(botonTextAumentar);
        botonAumentar.addEventListener('click', (e) => carrito.addProduct(product.ID));

        containerButton.appendChild(botonDisminuir);
        containerButton.appendChild(botonAumentar);

        cartItemContent.appendChild(productName);

        itemPrice.appendChild(price);

        cartItem.appendChild(cartItemContent);
        cartItem.appendChild(itemPrice);
        cartItem.appendChild(containerButton);

        cartContainer.appendChild(cartItem);

    });
};

const renderizarProductos = (carrito) => {
    while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
    }

    database.products.forEach((product) => {
        const item = document.createElement('div');

        const image = document.createElement('img');
        image.setAttribute('src', product.image);

        const name = document.createElement('p');
        const textname = document.createTextNode(product.name);
        name.classList.add('nameprod')
        name.appendChild(textname);

        const ingredientes = document.createElement('p');
        const textingredientes = document.createTextNode(product.ingredientes);
        ingredientes.classList.add('caracteristicas')
        ingredientes.appendChild(textingredientes);

        const price = document.createElement('p');
        const textprice = document.createTextNode(`$${product.price} - stock: ${product.stock}`);
        price.classList.add('priceprod')
        price.appendChild(textprice);

        const button = document.createElement('button');
        const textbutton = document.createTextNode('Agregar al carrito');

        if (product.stock === 0) {
            button.classList.add('disabled-button');
            button.setAttribute('disabled', true);
            textbutton.textContent = 'Sin stock';
        }

        button.appendChild(textbutton);

        button.addEventListener('click', (e) => {
            carrito.addProduct(product.ID, 1);

            console.log(carrito);
        });

        item.appendChild(image);
        item.appendChild(name);
        item.appendChild(ingredientes);
        item.appendChild(price);
        item.appendChild(button);
        productList.appendChild(item);
    });
};

document.addEventListener('DOMContentLoaded', (e) => {
    const carritoExistente = localStorage.getItem('cart');

    const carrito = carritoExistente ? new Cart(JSON.parse(carritoExistente)) : new Cart({ owner: '' });

    localStorage.setItem('cart', JSON.stringify(carrito));

    renderizarCarrito(carrito);
    renderizarProductos(carrito);

    finish.addEventListener('click', () => {
        carrito.endShopSpree();
    });
});

// INPUT SEARCH

const conteinerSearch = document.getElementById('containerSearch');
const cardSearch = document.createElement('div');
conteinerSearch.appendChild(cardSearch);

const renderSearch = document.createElement('div');
cardSearch.appendChild(renderSearch);

const imageSearch = document.createElement('img');
renderSearch.appendChild(imageSearch);

const infoSearch = document.createElement('div');
cardSearch.appendChild(infoSearch);

const nameSearch = document.createElement('p');
const ingredientesSearch = document.createElement('p');
const precioSearch = document.createElement('p');

infoSearch.appendChild(nameSearch);
infoSearch.appendChild(ingredientesSearch);
infoSearch.appendChild(precioSearch);

const tomarValor = () => {
    const value = document.getElementById('search').value;
    const Prodname = value.toLowerCase();

    if (cardSearch.firstChild) {
        cardSearch.classList.add(`visible`);
        renderSearch.classList.add('render');
        infoSearch.classList.add('infosearch');
        nameSearch.classList.add('nameprod');
        precioSearch.classList.add('priceprod');
    } else {
        cardSearch.classList.remove(`visible`);
    };

    if (!Prodname) {
        nameSearch.textContent = "Campo vacio";
        ingredientesSearch.textContent = 'Ingresa un nombre valido';
        precioSearch.textContent = "";
        imageSearch.removeAttribute('src', Prodname.image);
        return;
    }


    const Prodselect = database.products.find((p) => p.name == Prodname);

    if (!Prodselect) {
        nameSearch.textContent = "Nombre no encontrado";
        ingredientesSearch.textContent = 'Ingresa un nombre valido';
        imageSearch.removeAttribute('src');
        precioSearch.textContent = "";
    } else {
        imageSearch.setAttribute('src', `${Prodselect.image}`);
        imageSearch.innerHTML = `${Prodselect.image}`;
        nameSearch.textContent = `${Prodselect.name}`;
        ingredientesSearch.innerHTML = `Los ingredientes son:${Prodselect.ingredientes}`
        precioSearch.textContent = `El valor es de $ ${Prodselect.price}`
    }
};

const limpiarCart = () => {
    while (conteinerSearch.firstChild) {
        conteinerSearch.removeChild(conteinerSearch.firstChild);
        renderSearch.removeChild(renderSearch.firstChild);
    }

};

const buttonSearch = document.getElementById('buttonSearch');
const formsearch = document.getElementById('form');

formsearch.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.reset();
});

buttonSearch.addEventListener('click', tomarValor, limpiarCart);


// RENDERIZAR UN FORM

const cardperro = document.getElementById('cardsorteo');
const buttonForm = document.getElementById('FormSubmit');

const userprod = document.createElement('div');
cardperro.appendChild(userprod);

const gracias = document.createElement('p');
const username = document.createElement('p');
const userMensaje = document.createElement('p');

userprod.appendChild(gracias);
userprod.appendChild(username);
userprod.appendChild(userMensaje);


const participar = () => {
    const FormNombre = document.getElementById('FormNombre').value;
    const FormMensaje = document.getElementById('FormMensaje').value;

    if (cardperro.firstChild) {
        userprod.classList.add('mostrar');
    } else {
        userprod.classList.remove('mostrar');
    }
    gracias.innerHTML = `¡GRACIAS POR PARTICIPAR!`
    username.innerHTML = `PRODUCTOS A GANAR:<span> ${FormNombre}</span>`;
    userMensaje.innerHTML = `JUGUETES, PIPETAS, ALIMENTO Y MAASSS: <span> ${FormMensaje}</span>`;
};

const formsorteo = document.getElementById('formsorteo');

formsorteo.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.reset();
});

buttonForm.addEventListener('click', participar);