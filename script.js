window.onload = function onload() { buscaProdutos() };

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

// Cria a grade com os resultados da busca inicial
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCart = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho'));
  addToCart.addEventListener('click', () => adicionaProduto({ sku }));
  section.appendChild(addToCart);
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

const URL_Busca = (termo) => `https://api.mercadolibre.com/sites/MLB/search?q=${termo}`;
const URL_Produto = (itemID) => `https://api.mercadolibre.com/items/${itemID}`;

const buscaProdutos = () => {
  fetch(URL_Busca('Aspirador'), {method: 'GET'})
   .then(resposta => resposta.json()) // Obtem a resposta formatada em JSON
   .catch(erro => alert('Erro na obtenção da lista', erro)) // Trata erro caso ocorra
   .then(respjson => respjson.results) // Obtém os produtos do JSON num array
   .then(produtos => {
    produtos.forEach(prod => {  // Percorre o array e adiciona à página os valores (produtos)
      const paramLista = { sku: prod.id, name: prod.title, image: prod.thumbnail }
      document.querySelector('.items').appendChild(createProductItemElement(paramLista))
    })
  })
}

const adicionaProduto = ({ sku }) => {
  fetch(URL_Produto(sku))
    .then(resposta => resposta.json())
    .catch(erro => alert('Erro na obtenção da lista', erro))
    .then(respjson => {
      const paramProd = { sku: respjson.id, name: respjson.title, salePrice: respjson.price }
      document.querySelector('.cart__items').appendChild(createCartItemElement(paramProd))
    })
}
