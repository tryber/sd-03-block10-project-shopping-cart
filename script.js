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
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function sumPrice() {
  const totalPrice = document.querySelector('.total-price');
  const itens = document.querySelectorAll('.cart__item');
  totalPrice.innerHTML = Math.round([...itens].map(item => item.innerHTML.match(/[\d.\d]+$/))
    .reduce((acc, add) => acc + parseFloat(add), 0) * 100) / 100;
}
async function updateStorage() {
  const price = document.querySelector('.total-price').innerHTML;
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
  localStorage.setItem('total-price', price);
}
function cartItemClickListener(event) {
  document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  updateStorage();
  sumPrice();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
}
async function getDetailsToCart(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respToJson = await response.json();
  const sku = respToJson.id;
  const name = respToJson.title;
  const salePrice = respToJson.price;
  return { sku, name, salePrice };
}
const addListenerToButtons = () => document.querySelectorAll('.item').forEach(async (e) => {
  const sku = await getSkuFromProductItem(e);
  const getDetails = await getDetailsToCart(sku);
  e.lastChild.addEventListener('click', () => {
    createCartItemElement(getDetails);
    sumPrice();
    updateStorage();
  });
});
async function getResponse() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const respToJson = await response.json();
  const treatedResp = respToJson.results;
  treatedResp.forEach((e) => {
    const sku = e.id;
    const name = e.title;
    const image = e.thumbnail;
    document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
  });
  addListenerToButtons();
}
function emptyCart() {
  document.querySelector('.cart__items').innerHTML = '';
  sumPrice();
  updateStorage();
}
function loadOnCart() {
  const lastCart = localStorage.getItem('cart');
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = lastCart;
  const items = document.querySelectorAll('.cart__item');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('total-price');
  items.forEach(item => item.addEventListener('click', cartItemClickListener));
}
window.onload = function onload() {
  getResponse()
    .then(() => document.querySelector('.loading').remove())
    .catch(error => console.error(error));
  loadOnCart();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
};
window.onunload = function onunload() {
  sumPrice();
  updateStorage();
};
