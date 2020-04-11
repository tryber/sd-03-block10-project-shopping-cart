
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  await event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

async function carregarCarrinho({ sku }) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(dados => dados.json())
    .then(dados => document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(
      {
        sku: dados.id,
        name: dados.title,
        salePrice: dados.price,
      })))
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botaoAdd = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  botaoAdd.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(respo => respo.json())
      .then((product) => {
        const item = document.getElementsByClassName('cart__items')[0];
        item.appendChild(createCartItemElement({
          sku: product.id,
          name: product.title,
          salePrice: product.price,
        }));
      });
    localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  });
  section.appendChild(botaoAdd);
  return section;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resp => resp.json())
    .then((json) => {
      json.results.forEach((products) => {
        document.getElementsByClassName('items')[0]
          .appendChild(createProductItemElement(
            {
              sku: products.id,
              name: products.title,
              image: products.thumbnail,
            },
          ));
        document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart__items');
        document.querySelectorAll('li').forEach(items => items.addEventListener('click', cartItemClickListener));
      });
    });
};
