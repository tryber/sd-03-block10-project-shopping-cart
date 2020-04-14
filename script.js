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

const addToCart = async () => {
  const itemSection = document.querySelector('section.item');
  const itemID = getSkuFromProductItem(itemSection);
  const API_ITEM_REQUEST = `https://api.mercadolibre.com/items/${itemID}`;
  await fetch(API_ITEM_REQUEST)
    .then(response => response.json())
    .then(data => {
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
};

function createProductItemElement({ sku, name, image }) {
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
    const API_ITEM_REQUEST = `https://api.mercadolibre.com/items/${sku}`;
    await fetch(API_ITEM_REQUEST)
      .then(response => response.json())
      .then(data => {
        console.log(API_ITEM_REQUEST);
        console.log(sku);
        console.log(data);
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
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductData = async () => {
  const productsList = document.querySelector('.items');
  const queryKey = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${queryKey}`;
  await fetch(API_URL)
    .then(response => response.json())
    .then(data =>
      data.results.forEach(({ id, title, thumbnail }) =>
        productsList.appendChild(
          createProductItemElement({ sku: id, name: title, image: thumbnail }),
        ),
      ),
    )
    .catch(() => alert('Erro: Produtos não listados'));
};

window.onload = async () => {
  await getProductData();
};
