function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const addElement = (className, callback, obj) =>
  document.getElementsByClassName(className)[0].appendChild(callback(obj));

const sumAll = async () => {
  const allItems = document.getElementsByClassName('cart__item');
  const totalPriceDisplay = document.querySelector('.total-price');
  totalPriceDisplay.textContent =
    Math.round(
      [...allItems]
        .map(e => e.textContent.match(/([0-9.]){1,}$/))
        .reduce((acc, price) => acc + parseFloat(price), 0)
        .toFixed(2) * 100,
    ) / 100;
};

/* Códigos referentes ao carrinho */

const updateCart = () =>
  localStorage.setItem('Cart_items', document.getElementsByClassName('cart__items')[0].innerHTML);

function cartItemClickListener(event) {
  event.target.remove();
  updateCart();
  sumAll();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addLoading = () => {
  document
    .getElementsByClassName('container')[0]
    .appendChild(createCustomElement('p', 'loading', 'loading...'));
};

const removeLoading = () => {
  document.getElementsByClassName('loading')[0].remove();
};

const addToCart = async ({ sku }) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(res => res.json())
    .then(
      product =>
        addElement('cart__items', createCartItemElement, {
          sku: product.id,
          name: product.title,
          salePrice: product.price,
        }),
    );
  updateCart();
  sumAll();
};

/* Código referente à criação dos Elementos dos produtos */

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // Mudando aqui para que todo elemento criado tenha setado um tipo - button -
  // com classname - item__add - com texto Adicionar ao carrinho!
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // Depois, adicionando um evento de click, para adicionar ao carrinho o ID da mercadoria clicada.
  addToCartButton.addEventListener('click', () => {
    addToCart({ sku });
  });
  // Depois, falamos pra section apender esse novo item - addToCartButton -
  section.appendChild(addToCartButton);
  return section;
}

/* ______________________________________________________  */

const emptyCart = () => {
  const esvaziaCarrinho = document.getElementsByClassName('empty-cart')[0];
  esvaziaCarrinho.addEventListener('click', () => {
    const clearOl = document.getElementsByClassName('cart__items')[0];
    clearOl.innerHTML = '';
    updateCart();
    sumAll();
  });
};

window.onload = async () => {
  addLoading();
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then(
      data =>
        data.results.forEach(result =>
          addElement('items', createProductItemElement, {
            sku: result.id,
            name: result.title,
            image: result.thumbnail,
          }),
          removeLoading(),
        ),
      emptyCart(),
    );
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Cart_items');
  document
    .querySelectorAll('li')
    .forEach(li => li.addEventListener('click', cartItemClickListener));
  await sumAll();
};
