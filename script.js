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

const addItemToCart = ({ sku }) => {
  addLoading('cart__items');
  apiUrl(`https://api.mercadolibre.com/items/${sku}`)
    .then((product) => {
      appendElement('cart__items', createCartItemElement, {
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      });
      localStorage.setItem('cart_total', product.price + parseFloat(localStorage.getItem('cart_total')));
      removeLoading();
      updateCart();
    });
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddToCart.addEventListener('click', () => {
    addItemToCart({ sku });
  });
  section.appendChild(btnAddToCart);
  return section;
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
