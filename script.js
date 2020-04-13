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

const header = { method: 'GET', headers: { 'Accept': 'application/json' } };

async function CreateItemAPI() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', header)
  .then(response => response.json())
  .then((data) => {
    const items = document.querySelector('.items');

    data.results.map(function (result) {
      return items.appendChild(createProductItemElement(
        {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        },
        ));
    });
  });
  document.getElementsByClassName('loading')[0].remove();
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

window.onload = async function onload() {
  await CreateItemAPI();
}
