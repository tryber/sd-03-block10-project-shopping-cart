// const itens = element => {
//   sku: element.results.id,
//   name: element.results.title,
//   thumbnail: element.results.thumbnail,
// }

window.onload = function onload() {
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
    .then(respostaRecebida => respostaRecebida.json())
    .then(essaRespostaBusca => essaRespostaBusca.results.forEach(produts => {
      document.getElementsByClassName('items')[0].appendChild(createProductItemElement({
         sku: produts.id,
         name: produts.title,
         image: produts.thumbnail,
         )}
      )))
    }
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    fetch("https://api.mercadolibre.com/items/$ItemID")
      .then(resolve => resolve.json())
      .then(arquivo => arquivo.results.forEach(e => {
        document.getElementsByClassName('cart')[0]
        .appendChild(createCartItemElement(e.id))
      })
   )}  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
localStorage.setItem()

function cartItemClickListener(event) {
  const k = document.querySelectorAll('li');
  k.EventTarget.addEventListener('click', () => removeItem(event));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
