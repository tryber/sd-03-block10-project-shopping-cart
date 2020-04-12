function produtoParaProdutoResumido(produto) {
  return {
    sku: produto.id,
    name: produto.title,
    image: produto.thumbnail
  }
}
window.onload = function onload() { 
  if (localStorage.getItem("banana") == null) {
    localStorage.setItem("banana", "[]");
  }
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=computador`
  const myObject = {
    method: 'GET',
    headers: {'Accept': 'application/json'}
  }
  fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((data) => {
      const objetosMapeados = data.results.map(produtoParaProdutoResumido);
      const elementosCriados = objetosMapeados.map(createProductItemElement);
      const elementoItems = document.getElementsByClassName('items');
      elementosCriados.forEach((elementoCriado) => elementoItems[0].appendChild(elementoCriado));
      
    })
    .catch((error) => {
      console.log("A solicitação foi rejeitada.", error);
    })
};

function adicionaNoCarrinho(sku) {
  const API_URL_CARRINHO = `https://api.mercadolibre.com/items/${sku}`;
    const myObjectCarrinho = {
      method: 'GET',
      headers: {'Accept': 'application/json'}
    }
    fetch(API_URL_CARRINHO, myObjectCarrinho)
      .then((response) => response.json())
      .then((data) => { //informações do produto acessados pelo id específico retornando sku, name e salePrice
        const novoObjeto = {
          sku: data.id,
          name: data.title,
          salePrice: data.price
        }
        salvarLocalStorage(novoObjeto);
        const atribuindoObjetosMapeados = createCartItemElement(novoObjeto); //atribuindo os valores ao elemento li
        let elementoPaiOl = document.getElementsByClassName('cart__items');
        let p = elementoPaiOl[0].appendChild(atribuindoObjetosMapeados);// atribuindo li ao ol
        console.log('p',p);
      }).catch((error) => {
        console.log("A solicitação para adicionar no carrinho foi rejeitada.", error);
      })
};

const salvarLocalStorage = (novoObjeto) => {
  const pegaBanana = localStorage.getItem('banana');
  const transformandoBanana = JSON.parse(pegaBanana);
  const objetoLocalStorage = transformandoBanana;
  objetoLocalStorage.push(novoObjeto);
  let transformandoEmString = JSON.stringify(objetoLocalStorage);
  localStorage.setItem('banana', transformandoEmString);
  console.log(localStorage);
}

const removerLocalStorage = (sku) => {
  const pegaBanana = localStorage.getItem('banana');
  const transformandoBanana = JSON.parse(pegaBanana);
  let transformandoEmString = JSON.stringify(objetoLocalStorage);
  localStorage.setItem('banana', transformandoEmString);
  console.log(localStorage);
  console.log('r',transformandoEmString);
  console.log('q',transformandoEmString);
}

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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.onclick = () => {
    adicionaNoCarrinho(sku);
  }
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

//REMOVE ELEMENTOS DA LISTA
function cartItemClickListener(event) {
  const clickedElement = event.target;
  console.log(clickedElement);
  const elementoOl = document.querySelector('.cart__items');
  elementoOl.removeChild(clickedElement);
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`;
  //remove da lista o elemento clicado.
  li.onclick = (event) => {
    cartItemClickListener(event);
  }
  return li;
}

//LocalStorage
//1 - gravar o novoObjeto no localStorage
//2 - apagar o novoObjeto do localStarage
//3 - salavar o novoObjeto no localStorage

//salavar no localStorage
  // li.addEventListener('click', salvarNoLocalStorage);
  // li.onchange = (parametro) => {
  //   salvarNoLocalStorage(parametro);
  // }