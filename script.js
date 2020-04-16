// const itens = element => {
//   sku: element.results.id,
//   name: element.results.title,
//   thumbnail: element.results.thumbnail,
// }
async function cartItemClickListener(event) {
  await event.target.remove();
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  btn.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(resolve => resolve.json())
      .then(((produts) => {
        const item = document.getElementsByClassName('cart__items')[0];
        item.appendChild(createCartItemElement({
          sku: produts.id,
          name: produts.title,
          salePrice: produts.price,
        }));
      }));
    localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  });
  section.appendChild(btn);
  return section;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(respostaRecebida => respostaRecebida.json())
    .then(essaRespostaBusca => essaRespostaBusca.results.forEach((produts) => {
      document.getElementsByClassName('items')[0].appendChild(createProductItemElement({
        sku: produts.id,
        name: produts.title,
        image: produts.thumbnail,
      }));
      document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart__items');
      document.querySelectorAll('li').forEach(e => e.addEventListener('click', cartItemClickListener));
      document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
        document.getElementsByClassName('cart__items')[0].innerHTML = '';
      });
    }));
};
