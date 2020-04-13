const itemsSection = document.querySelector('.items');
const itemsCarrinho = document.querySelector('.cart__items');
const container = document.querySelector('.container');
const removeAll = document.querySelector('.empty-cart');
const carregando = document.querySelector('.loading');
const loader = document.createElement('div');
const loading = () => {
  loader.innerHTML = 'Carregando';
  loader.className = 'loading';
  container.appendChild(loader);
};
loading();
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => {
    li.remove();
    localStorage.removeItem(`${sku}`);
  });
  return li;
}
const addNoCarrinho = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then((dataJ) => {
    const buttonsShop = document.querySelectorAll('.item__add');
    const resultados = dataJ.results;
    buttonsShop.forEach((button, index) => {
      button.addEventListener('click', () => {
        const sku = resultados[index].id;
        const name = resultados[index].title;
        const salePrice = resultados[index].price;
        const produto = createCartItemElement({ sku, name, salePrice });
        itemsCarrinho.appendChild(produto);
        const storageJson = JSON.stringify({ sku, name, salePrice });
        localStorage.setItem(`${sku}`, storageJson);
        return dataJ;
      });
    });
  });
};
const listarProdutos = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(data => data.json())
  .then((dataJ) => {
    loader.remove();
    const resultados = dataJ.results;
    resultados.forEach((item) => {
      const id = item.id;
      const name = item.title;
      const image = item.thumbnail;
      itemsSection.appendChild(createProductItemElement({ id, name, image }));
    });
    return dataJ;
  })
  .catch(() => console.log('ERROR'));
};
listarProdutos();
addNoCarrinho();
removeAll.addEventListener('click', () => {
  const lis = document.querySelectorAll('li');
  lis.forEach((li) => {
    li.remove();
  });
  localStorage.clear();
});
window.onload = function onload() {
  const produtosJson = window.localStorage;
  for (let i = 0; i < produtosJson.length; i += 1) {
    const chave = produtosJson.key(i);
    const jsonProduto = window.localStorage.getItem(chave);
    const produtoObjeto = JSON.parse(jsonProduto);
    const sku = produtoObjeto.sku;
    const name = produtoObjeto.name;
    const salePrice = produtoObjeto.salePrice;
    itemsCarrinho.appendChild(createCartItemElement({ sku, name, salePrice }));
  }
};
