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

const addToCart = async ({ sku }) => {
  await fetchAPI(`https://api.mercadolibre.com/items/${sku}`)
    .then((product) => {
      document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      }));
    });
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(botao);
  return section;
};

const fetchAPI = api => fetch(api).then(response => response.json());

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemClickListener = (event) => {
  event.target.remove();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


window.onload = async () => {
  await fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((json) => {
      json.results.forEach(item => document.getElementsByClassName('items')[0].appendChild(createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      })));
    });
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
};
