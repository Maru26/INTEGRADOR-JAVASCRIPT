//MENU HAMBURGUESA

const Dogs = document.querySelector('.grilla');
const listanav = document.querySelector('.listanav');

const mobileMenu = () => {
    Dogs.classList.toggle('active');
    listanav.classList.toggle('active');
}
Dogs.addEventListener('click', mobileMenu);


const navLink = document.querySelectorAll('.navlink');
const closeMenu = () => {
    Dogs.classList.remove('active');
    listanav.classList.remove('active');
}
navLink.forEach(n => n.addEventListener('click', closeMenu));


//RENDERIZAR PRODUCTOS DE JS EN HTML


class Database {
    constructor({ products = [], users = [] }) {
        this.users = users;
        this.products = products;
    }

    addProduct(...products) {
        this.products.push(...products);
        localStorage.setItem(`database`, JSON.stringify(this));
    }

    addUser(user) {
        this.users.push(user);
        localStorage.setItem(`database`, JSON.stringify(this));
    }
};

class Cart {
    constructor({
        ID = Date.now().toString(36) + Math.random().toString(36).substring(2),
        products = [],
        subtotal = 0,
        owner,
    }) {
        this.ID = ID;
        this.products = products;
        this.owner = owner;
        this.subtotal = subtotal;
    }

    endShopSpree() {
        alert(`EL TOTAL ES $ ${this.subtotal}`);
        this.products = [];
        this.subtotal = 0;

        localStorage.removeItem('cart');
        renderizarCarrito(this);
        location.reload();

    }
    addProduct(ID, quantity = 1) {
        const product = database.products.find((product) => product.ID === ID);

        if (product.stock >= quantity) {
            const price = quantity * product.price;

            this.subtotal = this.subtotal + price;
            product.stock = product.stock - quantity;

            const productInCart = this.products.find((p) => p.ID === ID);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                this.products.push({ ID, quantity });
            }
            localStorage.setItem('cart', JSON.stringify(this));
            renderizarProductos(this);
            renderizarCarrito(this);
            localStorage.setItem('database', JSON.stringify(database));
        } else {
            alert('SIN STOCK');
        }
    }
    removeProducts(ID) {
        const product = this.products.find((p) => p.ID === ID);
        const productdb = database.products.find((p) => p.ID === ID);

        if (!product) {
            return alert('EL PRODUCTO NO EXISTE');
        }
        productdb.stock++;
        this.subtotal = this.subtotal - productdb.price;

        if (product.quantity > 1) {
            product.quantity--;
        } else {
            this.products = this.products.filter((product) => product.ID !== ID);
        }
        localStorage.setItem('cart', JSON.stringify(this));
        localStorage.setItem('database', JSON.stringify(database));

        renderizarProductos(this);
        renderizarCarrito(this);
    }
};

class Product {
    static currentID = 1;
    constructor({ price, stock = 0, name, ingredientes, image }) {
        this.ID = Product.currentID;
        this.price = price;
        this.stock = stock;
        this.name = name;
        this.ingredientes = ingredientes;
        this.image = image;

        Product.currentID++;
    }
    update({ price, stock, name = this.name, ingredientes = this.ingredientes, image = this.image }) {
        this.price = price || this.price;
        this.stock = stock || this.stock;
        this.name = name;
        this.ingredientes = ingredientes;
        this.image = image;
    }
};

const totalfull = new Product({
    price: 250,
    stock: 32,
    name: 'totalfull',
    ingredientes: ['Fenbendazol', 'Praziquantel', 'Pirantel', 'Pamoato'],
    image: src = './Imgs/totalfull.png',
});
const royalcanin = new Product({
    price: 630,
    stock: 29,
    name: 'Royalcanin',
    ingredientes: ['Vitaminas', 'Maíz', 'Carne vacuna'],
    image: src = './Imgs/royalcaninp.jpg'
});

const infinity = new Product({
    price: 525,
    stock: 17,
    name: 'Infinity',
    ingredientes: ['Vitaminas A', 'Selenio', 'Hierro', 'Biotina'],
    image: src = './Imgs/infinity.jpg',
});

const pipeta = new Product({
    price: 150,
    stock: 20,
    name: 'Pipeta',
    ingredientes: ['Suero fisiológico', 'Metopreno', 'Fipronil', 'Piriprol', 'Aceite de menta', 'Aceite de citronela'],
    image: src = './Imgs/pipeta.jpg',
});

const collares = new Product({
    price: 200,
    stock: 43,
    name: 'Collares',
    ingredientes: ['Metal', 'Plástico', 'Goma', 'Madera', 'Soga', 'Nylon'],
    image: src = './Imgs/pretales.jpeg',
});

const juguetes = new Product({
    price: 300,
    stock: 88,
    name: 'Juguetes',
    ingredientes: ['Goma espuma', 'Plástico', 'Goma', 'Cuero', 'Madera', 'Nylon'],
    image: src = './Imgs/juguetes.jpg',
});


const dbExistente = localStorage.getItem('database');

const database = dbExistente ? new Database(JSON.parse(dbExistente)) : new Database({});

if (!dbExistente) {
    database.addProduct(totalfull, royalcanin, infinity, pipeta, collares, juguetes);
};