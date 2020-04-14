let totCart = 0;
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
function loadingText(enable) {
  if (enable) {
    const textoLoading = createCustomElement('div', 'loading', '');
    textoLoading.innerHTML = 'Carregando...<br><img src="aguarde.gif"></img>';
    document.getElementsByClassName('items')[0].appendChild(textoLoading);
  } else {
    document.getElementsByClassName('loading')[0].remove();
  }
}

// Faz a soma do total dos ítens do carrinho ao mesmo tempo que armazena a lista no localStorage
async function getTotalValue(valor, operador) {
  const itensCarrinho = document.getElementsByClassName('cart__items')[0].innerHTML;
  if (operador === 'add') {
    totCart += valor;
  } else {
    totCart -= valor;
  }
  document.getElementsByClassName('total-price')[0].innerText = `Total: R$ ${totCart.toFixed(2)}`;
  localStorage.setItem('cartItems', itensCarrinho);
}

// Apaga o ítem do carrinho e recalcula o valor total dos ítens
function cartItemClickListener(event) {
  (event.target).parentNode.removeChild(event.target);
  getTotalValue((event.target).innerText.match(/[^$]*$/), 'sub');
  // Procura por tudo que vier depois do $, que corresponde ao preço do produto
}

// Usada para inserir as imagens nos respectivos produtos
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Coloca o item selecionado na lista do carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Obtém os dados do produto selecionado na grade pela segunda URL usando async/await
async function add2Cart({ sku }) {
  try {
    const resposta = await fetch(urlProduto(sku));
    const respjson = await resposta.json();
    const paramProd = { sku: respjson.id, name: respjson.title, salePrice: respjson.price };
    document.querySelector('.cart__items').appendChild(createCartItemElement(paramProd));
    getTotalValue(paramProd.salePrice, 'add');
  } catch (erro) {
    alert('Erro na obtenção das informações do produto: ', erro);
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
  addToCart.addEventListener('click', () => add2Cart({ sku }));
  section.appendChild(addToCart);
  return section;
}

// Gera a grade com os resultados da busca na primeira URL (no topo) usando a promise de fetch()
// Pode ser feita usando async/await como na de adicionar ao carrinho.
async function getProducts() {
  document.querySelector('.items').innerHTML = '';
  loadingText(true);
  // const campoBusca = document.querySelector('#input-search').value;
  // A linha aabaixo é necessária para passar nos requisitos, mas desabilita a caixa de pesquisa.
  const campoBusca = 'computador';
  fetch(urlBusca(campoBusca), { method: 'GET' })
    .then(resposta => resposta.json())
    .catch(erro => alert('Erro na obtenção da lista', erro))
    .then(respjson => respjson.results) // Obtém os produtos do JSON num array
    .then((produtos) => {
      produtos.forEach((prod) => {  // Percorre o array e adiciona à página os valores (produtos)
        const paramLista = { sku: prod.id, name: prod.title, image: prod.thumbnail };
        document.querySelector('.items').appendChild(createProductItemElement(paramLista));
      });
      loadingText(false);
    });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Limpa o carrinho e o localStorage
function emptyCart() {
  totCart = 0;
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
      getTotalValue(parseFloat((item).innerText.match(/[^$]*$/)), 'add');
    });
  }
  getProducts();
};
