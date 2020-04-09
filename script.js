const addElement = (className, callback, obj) =>
  document.getElementsByClassName(className)[0].appendChild(callback(obj));

const updateCart = () =>
  localStorage.setItem('Cart_items', document.getElementsByClassName('cart__items')[0].innerHTML);

function cartItemClickListener(event) {
  event.target.remove();
  updateCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async ({ sku }) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(res => res.json())
    .then(product =>
      addElement('cart__items', createCartItemElement, {
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      }),
    );
  await updateCart();
};

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // tentar salvar
  btnAddToCart.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(btnAddToCart);
  //
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

/* ____________________________ MY CODE ___________________________  */

/*
const addElement = (className, callback, obj) =>
  document.getElementsByClassName(className)[0].appendChild(callback(obj));
 */

window.onload = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then(data =>
      data.results.forEach(result =>
        addElement('items', createProductItemElement, {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        }),
      ),
    );
  const esvaziaCarrinho = document.getElementsByClassName('empty-cart')[0];
  esvaziaCarrinho.addEventListener('click', () => {
    const clearOl = document.getElementsByClassName('cart__items')[0];
    clearOl.innerHTML = '';
  });
};
