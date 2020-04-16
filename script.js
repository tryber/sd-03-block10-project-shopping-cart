let total =0;
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click' , () => addItemToCart(sku));

  return section;
}

async function addItemToCart(sku){
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resp => resp.json())
    .then(products => document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(updateList(products))));
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  let newtotal = localStorage.getItem('cart_total') - event.target.salePrice;
  await event.target.remove();
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  document.getElementsByClassName('total_value').innerHTML = `Total $ ${newtotal}`;
  localStorage.setItem('cart_total', newtotal);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  let total = localStorage.getItem('cart_total').value;
  total += salePrice;
  li.className = 'cart__items';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClassName('total_value').innerHTML = `Total $ ${total}`;
  localStorage.setItem('cart_total', total);
  return li;
}

const updateList = (dados) => ({
  sku: dados.id,
  name: dados.title,
  image: dados.thumbnail,
  salePrice: dados.price,
})

window.onload = function onload() { 
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') 
    .then(res => res.json())
    .then(json => json.results.forEach(products => document.getElementsByClassName('items')[0]
        .appendChild(createProductItemElement(updateList(products)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart__items');
  document.querySelectorAll('li').forEach(list => list.addEventListener('click', cartItemClickListener)); 
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  });
  if (localStorage.getItem('cart_total') === undefined) {
    localStorage.setItem('cart_total', 0);
  }
  //const btnEmptyCart = document.getElementsByClassName('empty-cart')[0];

  //btnEmptyCart.addEventListener('click' , () => {
  //  document.getElementsByClassName('cart_items')[0].innerHTML = '';
  //});
};
