let valorCarrinho = 0;

// Funções executadas no carregamento da página
window.onload = function onload() {
  const itensCarrinho = document.getElementsByClassName('cart__items')[0];
  itensCarrinho.innerHTML = localStorage.getItem('cartItems');
  if (itensCarrinho.childElementCount) {
    document.querySelector('.total-price').innerHTML = localStorage.getItem('cartTotal');
    document.getElementsByName('li').forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  buscaProdutos();
};

// Usada para inserir as imagens nos respectivos produtos
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Usada para gerar elementos dinamicamente pela página
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

// Obtém os dados do produto selecionado na grade pela segunda URL acima
const adicionaProduto = ({ sku }) => {
  fetch(URL_Produto(sku))
    .then(resposta => resposta.json())
    .catch(erro => alert('Erro na obtenção da lista', erro))
    .then(respjson => {
      const paramProd = { sku: respjson.id, name: respjson.title, salePrice: respjson.price }
      document.querySelector('.cart__items').appendChild(createCartItemElement(paramProd));
      calculaTotal(paramProd.salePrice, 'add');
    })
}

// Faz a soma do total dos ítens do carrinho ao mesmo tempo que gerencia o localStorage
async function calculaTotal (valor, operador) {
  let itensCarrinho = document.getElementsByClassName('cart__items')[0].innerHTML;
  operador == 'add' ?
  valorCarrinho += valor :
  valorCarrinho -= valor;
  document.getElementsByClassName('total-price')[0].innerText = `Total: R$ ${valorCarrinho}`;
  let totalCarrinho = document.getElementsByClassName('total-price')[0].innerHTML;
  localStorage.setItem('cartItems', itensCarrinho);
  localStorage.setItem('cartTotal', totalCarrinho);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Coloca o item selecionado na lista do carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Apaga o ítem do carrinho e recalcula o valor total dos ítens
function cartItemClickListener(event) {
  (event.target).parentNode.removeChild(event.target);
  calculaTotal((event.target).innerText.match(/[^$]*$/), 'sub');
  // Procura por tudo que vier depois do $, que corresponde ao preço do produto
}

// Limpa o carrinho e o localStorage
function emptyCart() {
  document.getElementsByClassName('cart__items')[0].innerHTML = '';
  document.getElementsByClassName('total-price')[0].innerHTML = '';
  localStorage.clear();
}

function loadingText(mode) {
  if (mode == true) {
    const textoLoading = createCustomElement('div','loading','Aguarde...');
    textoLoading.innerHTML = '<img src="aguarde.gif"></img>'
    document.getElementsByClassName('items')[0].appendChild(textoLoading);
  }
  else
    document.getElementsByClassName('loading').removeChild;
}

const URL_Busca = (termo) => `https://api.mercadolibre.com/sites/MLB/search?q=${termo}`;
const URL_Produto = (itemID) => `https://api.mercadolibre.com/items/${itemID}`;

// Gera a grade com os resultados da busca na primeira URL acima
const buscaProdutos = () => {
  loadingText(true);
  fetch(URL_Busca('Drone'), {method: 'GET'})
   .then(resposta => resposta.json()) // Obtem a resposta formatada em JSON
   .catch(erro => alert('Erro na obtenção da lista', erro)) // Trata erro caso ocorra
   .then(respjson => respjson.results) // Obtém os produtos do JSON num array
   .then(produtos => {
    produtos.forEach(prod => {  // Percorre o array e adiciona à página os valores (produtos)
      const paramLista = { sku: prod.id, name: prod.title, image: prod.thumbnail }
      document.querySelector('.items').appendChild(createProductItemElement(paramLista));
      loadingText(false);
    })
  })
}
