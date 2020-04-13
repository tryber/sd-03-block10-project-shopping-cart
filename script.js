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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

const allProdu = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const a = document.querySelector('.items');
    data.results.forEach((procura) => {
      const all = {
        sku: procura.id,
        name: procura.title,
        image: procura.thumbnail,
      };
      const product = createProductItemElement(all);
      a.appendChild(product);
    });
  })
  .then(botao());

function montaObj(data) {
  const objCart = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const li = createCartItemElement(objCart);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}


const clickIds = (event) => {
  const section = event.target.parentNode;
  const priElement = section.firstChild.innerText;
  fetchId(priElement);
};

function botao() {
  const item = document.querySelectorAll('.item__add');
  item.forEach((param) => {
    param.addEventListener('click', clickIds);
  });
};

allProdu;

const fetchId = ({ id }) => {
  const API = `https://api.mercadolibre.com/items/${id}`;
  fetch(API)
    .then(response => response.json())
    .then(data => montaObj(data));
};



/* .then(function () {
  const allBotao = document.querySelectorAll('.item__add');
  const botao = allBotao.forEach(() => {
    allBotao.forEach((addEventListener) => {
      const teste = fetch(`https://api.mercadolibre.com/items/${}`)
      createCartItemElement();
      console.log(teste)
    })
  })
}) */