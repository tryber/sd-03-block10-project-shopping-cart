const apiSearchUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const apiSearchItemUrl = 'https://api.mercadolibre.com/items/';
const query = 'computador';

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const cartItemClickListener = event => document.querySelector('.cart__items').removeChild(event.target);

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  const itemSelector = section.querySelector('button.item__add');
  itemSelector.addEventListener('click', async () => {
    await fetch(apiSearchItemUrl + sku)
      .then(response => response.json())
      .then((data) => {
        const cartList = document.querySelector('ol.cart__items');
        cartList.appendChild(
          createCartItemElement({
            sku: data.id,
            name: data.title,
            salePrice: data.price.toFixed(2),
          }),
        );
      })
      .catch(() => alert('Erro: Produto não listado'));
  });

  return section;
};

const getSkuFromProductItem = () => {};

const getProductData = async () => {
  fetch(apiSearchUrl + query)
    .then(data => data.json())
    .then(obj =>
      obj.results.forEach(item =>
        document.getElementsByClassName('items')[0].appendChild(
          createProductItemElement({
            sku: item.id,
            name: item.title,
            image: item.thumbnail,
          }),
        ),
      ),
    );
};

window.onload = async function onload() {
  await getProductData();
};
