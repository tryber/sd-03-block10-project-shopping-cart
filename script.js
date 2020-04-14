const apiSearchUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const query = 'computador';

const createProductImageElement = imageSource => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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

  return section;
};

const getSkuFromProductItem = item => {
  return item.querySelector('span.item__sku').innerText;
};

const cartItemClickListener = event => {
  document.querySelector('.cart__items').removeChild(event.target);
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

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
