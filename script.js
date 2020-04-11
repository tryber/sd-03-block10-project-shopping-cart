window.onload = function onload() { };
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

function cartItemClickListener(event) {
  this.addEventListener('click', this.remove());
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const itemsSection = document.querySelector('.items');
const itemsCarrinho = document.querySelector('.cart__items');
const addNoCarrinho = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then((dataJ) => {
    const buttonsShop = document.querySelectorAll('.item__add');
    const resultados = dataJ.results;
    buttonsShop.forEach((button, index) => {
      button.addEventListener('click', () => {
        const sku = resultados[index].id;
        const name = resultados[index].title;
        const salePrice = resultados[index].price;
        itemsCarrinho.appendChild(createCartItemElement({ sku, name, salePrice }));
        return dataJ;
      });
    });
  });
};
const listarProdutos = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then((dataJ) => {
    const resultados = dataJ.results;
    resultados.forEach((item) => {
      const id = item.id;
      const name = item.title;
      const image = item.thumbnail;
      itemsSection.appendChild(createProductItemElement({ id, name, image }));
    });
    return dataJ;
  })
  .catch(() => console.log('ERROR'));
};
listarProdutos();
addNoCarrinho();
