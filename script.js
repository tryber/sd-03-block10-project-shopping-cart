let valorCarrinho = 0;
const urlBusca = termo => `https://api.mercadolibre.com/sites/MLB/search?q=${termo}`;
const urlProduto = itemID => `https://api.mercadolibre.com/items/${itemID}`;

// Usada para gerar elementos dinamicamente pela página
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Texto de carregamento apresentado entre o fetch e a grade
function loadingText(mode) {
  if (mode === true) {
    const textoLoading = createCustomElement('div', 'loading', '');
    textoLoading.innerHTML = 'Carregando...<br><img src="aguarde.gif"></img>';
    document.getElementsByClassName('items')[0].appendChild(textoLoading);
  } else {
    document.getElementsByClassName('loading')[0].remove();
  }
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

// Gera a grade com os resultados da busca na primeira URL (no topo)
async function buscaProdutos() {
  document.querySelector('.items').innerHTML = '';
  loadingText(true);
  const campoBusca = document.querySelector('#input-search').value;
  await fetch(urlBusca(campoBusca), { method: 'GET' })
    .then(resposta => resposta.json()) // Obtem a resposta formatada em JSON
    .catch(erro => alert('Erro na obtenção da lista', erro)) // Trata erro caso ocorra
    .then(respjson => respjson.results) // Obtém os produtos do JSON num array
    .then((produtos) => {
      produtos.forEach((prod) => {  // Percorre o array e adiciona à página os valores (produtos)
        const paramLista = { sku: prod.id, name: prod.title, image: prod.thumbnail };
        document.querySelector('.items').appendChild(createProductItemElement(paramLista));
      });
      loadingText(false);
    });
}

// Usada para inserir as imagens nos respectivos produtos
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Obtém os dados do produto selecionado na grade pela segunda URL (no topo)
async function adicionaProduto ({ sku }) {
  await fetch(urlProduto(sku))
    .then(resposta => resposta.json())
    .catch(erro => alert('Erro na obtenção da lista', erro))
    .then((respjson) => {
      const paramProd = { sku: respjson.id, name: respjson.title, salePrice: respjson.price };
      document.querySelector('.cart__items').appendChild(createCartItemElement(paramProd));
      calculaTotal(paramProd.salePrice, 'add');
    });
}

// Faz a soma do total dos ítens do carrinho ao mesmo tempo que armazena a lista no localStorage
async function calculaTotal(valor, operador) {
  const itensCarrinho = document.getElementsByClassName('cart__items')[0].innerHTML;
  operador === 'add' ? valorCarrinho += valor : valorCarrinho -= valor;
  document.getElementsByClassName('total-price')[0].innerText = `Total: R$ ${valorCarrinho}`;
  localStorage.setItem('cartItems', itensCarrinho);
}

// Coloca o item selecionado na lista do carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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
  document.getElementsByClassName('total-price')[0].innerHTML = 'Total: R$ 0,00';
  localStorage.clear();
}

/* Funções executadas no carregamento da página. Carrega os itens do localStorage, joga na lista
e recalcula o total. Apenas usando a tag ol com os childNodes retorna uma lista iterável. Por fim,
faz a busca*/
window.onload = function onload() {
  const itensCarrinho = document.getElementsByClassName('cart__items')[0];
  itensCarrinho.innerHTML = localStorage.getItem('cartItems');
  if (itensCarrinho.childElementCount) {
    document.getElementsByTagName('ol')[0].childNodes.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
      calculaTotal(parseFloat((item).innerText.match(/[^$]*$/)), 'add');
    });
  }
  buscaProdutos('Computador');
};
