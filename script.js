// const itens = element => {
//   sku: results.id,
//   name: results.title,
//   thumbnail: results.thumbnail,

// }

async function cartItemClickListener(event) {
  const novoTotal = Math.round((Number(localStorage.getItem('Total'))
   - parseFloat(event.target.innerHTML.match(/([0-9.]){1,}$/))) * 100) / 100;
  await event.target.remove();
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  document.getElementsByClassName('total-price')[0].innerHTML = `${novoTotal}`;
  localStorage.setItem('Total', novoTotal);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  let total = Number(localStorage.getItem('Total'));
  total = Math.round((total + salePrice) * 100) / 100;
  li.className = 'item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClassName('total-price')[0].innerHTML = `${total}`;
  localStorage.setItem('Total', total);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  btn.addEventListener('click', async () => {
    await fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(resolve => resolve.json())
      .then(((produts) => {
        const item = document.getElementsByClassName('cart__items')[0];
        item.appendChild(createCartItemElement({
          sku: produts.id,
          name: produts.title,
          salePrice: produts.price,
        }));
      }));
    await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  });
  section.appendChild(btn);
  return section;
}

window.onload = function onload() {
  // const loading = document.getElementsByClassName('loading')[0];
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
        localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
        localStorage.setItem('Total', 0);
        document.getElementsByClassName('total-price')[0].innerHTML = '0';
      });
    }));
  if (!localStorage.getItem('Total')) {
    localStorage.setItem('Total', 0);
  }
  document.getElementsByClassName('total-price')[0].innerHTML = this.localStorage.getItem('total');
  // loading.innerHTML = '';
};
