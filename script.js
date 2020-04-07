window.onload = function onload() { 
  fetchInMercadoLivre('computador')
    .then((data) => {
      const response = data.json();
      // console.log(response);
      return response;
    }).then((data) => {
      return data.results;
    })
    .then((results) => {
      // console.log(results);
      results.forEach((elem) => {
        document.getElementById('items-container')
        .appendChild(createProductItemElement(elem));
      });
      return results[0];
    })
    // .catch(() => console.log('deu algo errado'));
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

function createProductItemElement({ id: sku, title: name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  if (image !== undefined) section.appendChild(createProductImageElement(image));
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

function fetchInMercadoLivre(elem) {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${elem}`;
  const request = {
    method: 'GET',
    Headers: { 'Accept': 'application/JSON' },
  };
  
  return fetch(URL, request);
}

// module.exports = {
//   fetchInMercadoLivre,
// };
