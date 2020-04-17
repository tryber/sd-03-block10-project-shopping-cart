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

const cartTotal = async () => {
  const totalValueElement = document.querySelector('.cart__total');
  const cartItems = document.querySelectorAll('.cart__item');
  const totalValue =
    Math.round(
      [...cartItems]
        .map(element => element.innerText.match(/([0-9.]){1,}$/))
        .reduce(
          (accumulator, element) => accumulator + parseFloat(element),
          0,
        ) * 100,
    ) / 100;
  totalValueElement.innerHTML = Math.round(totalValue);
};

const saveCartItems = async () => {
  localStorage.setItem(
    'saved__cart__items',
    document.getElementsByClassName('cart__items')[0].innerHTML,
  );
  localStorage.setItem(
    'saved__total__cart__value',
    document.getElementsByClassName('cart__total')[0].innerHTML,
  );
  console.log(localStorage);
};

const cartItemClickListener = (event) => {
  event.target.remove();
  cartTotal();
  saveCartItems();
};

const updateSavedCartItems = async () => {
  document.getElementsByClassName(
    'cart__items',
  )[0].innerHTML = localStorage.getItem('saved__cart__items');
  document
    .getElementsByClassName('cart__items')[0]
    .addEventListener('click', cartItemClickListener);
  await cartTotal();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${Math.round(salePrice)}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement(
      'button',
      'item__add btn btn-primary btn-sm',
      'Adicionar ao carrinho!',
    ),
  );
  const itemSelector = section.querySelector('button.item__add');
  itemSelector.addEventListener('click', async () => {
    const API_ITEM_REQUEST = `https://api.mercadolibre.com/items/${sku}`;
    await fetch(API_ITEM_REQUEST)
      .then(response => response.json())
      .then((data) => {
        const cartProductList = document.querySelector('ol.cart__items');
        cartProductList.appendChild(
          createCartItemElement({
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          }),
        );
      })
      .catch(() => alert('Erro: Produto não listado'));
    cartTotal();
    saveCartItems();
  });
  return section;
};

const loadingElement = () => {
  const loadingText = createCustomElement(
    'span',
    'loading loading-lg text-uppercase text-center text-large',
    'loading...',
  );
  document.body.appendChild(loadingText);
};

const loadedData = () => {
  document.body.removeChild(document.querySelector('.loading'));
};

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

const emptyCart = () => {
  const emptyCarButton = document.querySelector('.empty-cart');
  emptyCarButton.addEventListener('click', () => {
    const cartList = document.querySelectorAll('li.cart__item');
    cartList.forEach(element => element.parentNode.removeChild(element));
    localStorage.clear();
    cartTotal();
    saveCartItems();
  });
};

window.onload = async () => {
  await getProductData();
  await updateSavedCartItems();
  emptyCart();
};
