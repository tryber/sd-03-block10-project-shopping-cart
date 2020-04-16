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
  if (!cartItems.length) totalValueElement.innerHTML = 0;
  totalValueElement.innerHTML = totalValue;
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

const cartItemClickListener = async (event) => {
  event.target.remove();
  await cartTotal();
  await saveCartItems();
};

const updateSavedCartItems = async () => {
  document.getElementsByClassName(
    'cart__items',
  )[0].innerHTML = localStorage.getItem('saved__cart__items');
  document
    .getElementsByClassName('cart__items')[0]
    .addEventListener('click', cartItemClickListener);
  cartTotal();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductItemElement = async ({ sku, name, image }) => {
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
            salePrice: data.price.toFixed(2),
          }),
        );
      })
      .catch(() => alert('Erro: Produto não listado'));
    await cartTotal();
    await saveCartItems();
  });
  return section;
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

const emptyCart = async () => {
  const emptyCarButton = document.querySelector('.empty-cart');
  emptyCarButton.addEventListener('click', () => {
    const cartList = document.querySelectorAll('li.cart__item');
    if (cartList.length !== 0) {
      cartList.forEach(element => element.parentNode.removeChild(element));
    }
  });
  await cartTotal();
  await saveCartItems();
};

window.onload = async () => {
  await getProductData();
  await updateSavedCartItems();
  await emptyCart();
  await cartTotal();
};
