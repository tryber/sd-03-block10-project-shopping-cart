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
function sumPrice(salePrice) {
  const totalPrice = document.querySelector('.total-price');
  const sum = Math.round((JSON.parse(totalPrice.innerHTML) + salePrice) * 100) / 100;
  totalPrice.innerHTML = sum;
}
function createStorage() {
  const price = document.querySelector('.total-price').innerHTML;
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
  localStorage.setItem('total-price', price);
}
async function cartItemClickListener(event) {
  const price = event.target.innerText.match(/([0-9.]){1,}$/)[0];
  await sumPrice(-price);
  event.target.remove();
  createStorage();
}
async function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  await sumPrice(salePrice);
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  createStorage();
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
  e.lastChild.addEventListener('click', async () => {
    await createCartItemElement(getDetails);
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
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.total-price').innerText = 0;
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
  });
}
async function loadOnCart() {
  const storage = localStorage.getItem('cart');
  const populateCart = async () => {
    const cartList = document.querySelector('.cart__items');
    cartList.innerHTML = storage;
    const items = [...document.getElementsByClassName('cart__item')];
    items.forEach(async e => e.addEventListener('click', cartItemClickListener));
    document.querySelector('.total-price').innerHTML = localStorage.getItem('total-price');
  };
  return await storage ? populateCart(storage) : localStorage.clear();
}
getResponse()
  .then(() => document.querySelector('.loading').remove())
  .catch(error => console.error(error));
window.onload = async function onload() {
  loadOnCart();
  emptyCart();
};
