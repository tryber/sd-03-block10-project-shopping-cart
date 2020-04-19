window.onload = function onload() { };

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getProductData = async () => {
  const productsList = document.querySelector('.items');
  const queryKey = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${queryKey}`;
  loadingElement();
  await fetch(API_URL)
    .then(response => response.json())
    .then(data =>
      data.results.forEach(({ id, title, thumbnail }) =>
        productsList.appendChild(
          createProductItemElement({ sku: id, name: title, image: thumbnail }),
        ),
      ),
    )
    .then(() => loadedData())
    .catch(() => alert('Erro: Produtos não listados'));
};

const getSkuFromProductItem = (item) => {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemClickListener = (event) => {
  // coloque seu código aqui
}

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
