function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const salvar = () => localStorage.setItem('Cart_items', document.querySelector('.cart__items').innerHTML);

function cartItemClickListener(event) {
  event.target.remove();
  salvar();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addElementCart = async (id) => {
  const listaAddCart = document.querySelector('.cart__items');
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();

  listaAddCart.appendChild(createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  }));
  salvar();
};

const cleanCart = () => {
  const listaAddCart = document.querySelector('.cart__items');
  listaAddCart.innerHTML = '';
  salvar();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', () => addElementCart(sku));
  section.appendChild(btnAddCart);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = async () => {
  const listaDeitens = document.querySelector('.items');
  const carItem = document.querySelector('.cart__items');
  const btnCleanCar = document.querySelector('.empty-cart');
  const loading = document.querySelector('.loading');

  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(response => response.json())
  .then((data) => {
    const results = data.results;
    results.forEach(({ id, title, thumbnail }) => {
      listaDeitens.appendChild(createProductItemElement({
        sku: id,
        name: title,
        image: thumbnail,
      }));
    });
    loading.remove();
    return data;
  })
  .catch(() => console.warn('ERROR Listar listarProdutos'));
  btnCleanCar.addEventListener('click', cleanCart);
  carItem.innerHTML = localStorage.getItem('Cart_items');
};
