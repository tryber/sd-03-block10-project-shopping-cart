const API = url => fetch(url).then(response => response.json());

const createProductImageElement = (imageSource) => {
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

const cartItemClickListener = (event) => {
  event.target.remove();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addItem = async ({ sku }) => {
  const item = await API(`https://api.mercadolibre.com/items/${sku}`).then(
    data =>
      createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }),
  );
  await document.querySelector('.cart__items').appendChild(item);
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAddCart = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  buttonAddCart.addEventListener('click', () => {
    addItem({ sku });
  });
  section.appendChild(buttonAddCart);

  return section;
};

const getSkuFromProductItem = item =>
  item.querySelector('span.item__sku').innerText;

window.onload = async () => {
  const itemsSection = document.querySelector('.items');
  const items = document.querySelectorAll('.item__add');

  await API('https://api.mercadolibre.com/sites/MLB/search?q=$computador').then(
    data =>
      data.results.forEach(({ id, title, thumbnail }) => {
        itemsSection.appendChild(
          createProductItemElement({
            sku: id,
            name: title,
            image: thumbnail,
          }),
        );
      }),
  );

  items.forEach(item => item.addEventListener('click', cartItemClickListener));
};
