const myObject = { method: 'GET', headers: new Headers() };

// window.onload = function onload() { };

function createProductImg(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// 5. Add the total value using total-price class.
const sum = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].textContent = Math.round([...cartItem].map(p => p.textContent
    .match(/([0-9.]){1,}$/))
    .reduce((acc, price) => acc + parseFloat(price), 0) * 100) / 100;
};

const cartUpdating = () => {
  localStorage.setItem('itemCart', document.getElementsByClassName('cart__items')[0].innerHTML);
  sum();
};

// const skuProduct = (item) => {
//   return item.querySelector('span.item__sku').innerText;
// }
// 3. Perform removal with cartItemClickListener(event)
function cartItemClickListener(event) {
  event.target.remove();
  cartUpdating();
}
// createCartItemElement() to create the HTML components for an item in the cart.
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `Id: ${sku} | Product: ${name} | Price: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addElementToCart = async ({ sku }) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(data => data.json())
  .then((product) => {
    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }));
    cartUpdating();
  });
};

function createProduct(el, className, innerText) {
  const product = document.createElement(el);
  product.className = className;
  product.innerText = innerText;
  return product;
}

// createProductItemElement function
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createProduct('span', 'item__sku', sku));
  section.appendChild(createProduct('span', 'item__title', name));
  section.appendChild(createProductImg(image));
  const btnAddCart = createProduct('button', 'item__add', 'Adicionar ao carrinho!');// 2.Each product has a button with the name "Adicionar ao carrinho!"
  btnAddCart.addEventListener('click', () => addElementToCart({ sku }));
  section.appendChild(btnAddCart);
  return section;
}

// element returned from the function createProductItemElement(product)
// 1. Product listing, endpoint "https://api.mercadolibre.com/sites/MLB/search?q=$QUERY"
async function apiCreateItem() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObject) // searching for the term computador
  .then(response => response.json())
  .then((data) => {
    const items = document.querySelector('.items');
// array results
    data.results.map(function (res) {
      return items.appendChild(createProductItemElement(
        {
          sku: res.id,
          name: res.title,
          image: res.thumbnail,
        },
        ));
    });
  });
  document.getElementsByClassName('loading')[0].remove();
}

// 6.Button to clear the shopping cart.
// 4. Load the shopping cart through localStorage when starting the page
window.onload = async function onload() {
  await apiCreateItem();
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    localStorage.setItem('itemCart', '');
    localStorage.setItem('cartTotalPrice', 0);
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    document.getElementsByClassName('total-price')[0].innerHTML = 0;
  });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('itemCart');
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  await sum();
};
