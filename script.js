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

const valorTotal = () => {
  const cartItems = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].textContent = Math.round([...cartItems].map(e => e.textContent
    .match(/([0-9.]){1,}$/))
    .reduce((acc, price) => acc + parseFloat(price), 0) * 100) / 100;
  localStorage.setItem('Cart', document.getElementsByClassName('cart__items')[0].innerHTML);
};

const cartItemClickListener = (event) => {
  event.target.remove();
  valorTotal();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPI = api => fetch(api).then(response => response.json());

const append = (aClass, func, objects) => document
  .getElementsByClassName(aClass)[0]
  .appendChild(func(objects));


const addToCart = async ({ sku }) => {
  await fetchAPI(`https://api.mercadolibre.com/items/${sku}`)
    .then(product => append('cart__items', createCartItemElement, {
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }));
  valorTotal();
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
};

const removeLoading = () => {
  document.getElementsByClassName('loading')[0].remove();
};

window.onload = async () => {
  await fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((json) => {
      json.results.forEach(item => append('items', createProductItemElement, {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }));
      removeLoading();
    });

  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    valorTotal();
  });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Cart');
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  valorTotal();
};
