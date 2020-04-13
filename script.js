function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const salvarLocalStorage = (novoObjeto) => {
  const pegaBanana = localStorage.getItem('banana');
  const transformandoBanana = JSON.parse(pegaBanana);
  const objetoLocalStorage = transformandoBanana;
  objetoLocalStorage.push(novoObjeto);
  const transformandoEmString = JSON.stringify(objetoLocalStorage);
  localStorage.setItem('banana', transformandoEmString);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const clickedElement = event.target;
  console.log(clickedElement);
  const elementoOl = document.querySelector('.cart__items');
  elementoOl.removeChild(clickedElement);
}

const removerLocalStorage = (sku) => {
  const pegaBanana = localStorage.getItem('banana');
  const transformandoBanana = JSON.parse(pegaBanana);
  const filtroSKU = transformandoBanana.filter((item) => {
    if (item.sku !== sku) {
      return true;
    }
    return false;
  });
  const transformandoEmString = JSON.stringify(filtroSKU);
  localStorage.setItem('banana', transformandoEmString);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`;
  li.onclick = (event) => {
    cartItemClickListener(event);
    removerLocalStorage(sku);
  };
  return li;
}

function adicionaNoCarrinho(sku) {
  const API_URL_CARRINHO = `https://api.mercadolibre.com/items/${sku}`;
  const myObjectCarrinho = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(API_URL_CARRINHO, myObjectCarrinho)
      .then(response => response.json())
      .then((data) => {
        const novoObjeto = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        salvarLocalStorage(novoObjeto);
        const atribuindoObjetosMapeados = createCartItemElement(novoObjeto);
        const elementoPaiOl = document.getElementsByClassName('cart__items');
        elementoPaiOl[0].appendChild(atribuindoObjetosMapeados);
      }).catch((error) => {
        console.log('A solicitação para adicionar no carrinho foi rejeitada.', error);
      });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.onclick = () => {
    adicionaNoCarrinho(sku);
  };
  section.appendChild(button);

  return section;
}

function objetoResumido(produto) {
  return {
    sku: produto.id,
    name: produto.title,
    image: produto.thumbnail,
  };
}
window.onload = function onload() {
  if (localStorage.getItem('banana') == null) {
    localStorage.setItem('banana', '[]');
  }
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(API_URL, myObject)
    .then(response => response.json())
    .then((data) => {
      const objetosMapeados = data.results.map(objetoResumido);
      const elementosCriados = objetosMapeados.map(createProductItemElement);
      const elementoItems = document.getElementsByClassName('items');
      elementosCriados.forEach(elementoCriado => elementoItems[0].appendChild(elementoCriado));
    })
    .catch((error) => {
      console.log('A solicitação foi rejeitada.', error);
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
