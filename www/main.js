import './style.css';
import {
  auth, registerCustomer, login, registerSeller,
  loadApprovedProducts, signOut, onAuthStateChanged
} from './firebase.js';

let products = [
  {id:'1',name:'Classic Shirt',category:'Clothing',price:699,emoji:'👕'},
  {id:'2',name:'Sneakers',category:'Shoes',price:1299,emoji:'👟'},
  {id:'3',name:'Sunglasses',category:'Eyewear',price:499,emoji:'🕶️'},
  {id:'4',name:'Wrist Watch',category:'Watches',price:999,emoji:'⌚'},
  {id:'5',name:'Leather Belt',category:'Accessories',price:399,emoji:'🧷'}
];

let cart = [];
let user = null;
let category = 'All';

const app = document.querySelector('#app');
const money = n => '₹' + Number(n).toLocaleString('en-IN');

function render() {
  app.innerHTML = `
    <header>
      <h2>🟢 ZyroMart</h2>
      <button id="account">${user ? 'Account' : 'Login'}</button>
      <button id="cart">🛒 Cart (${cart.length})</button>
    </header>

    <main>
      <section class="hero">
        <h1>Good finds. Great prices.</h1>
        <p>Shop clothes, shoes, watches and more.</p>
      </section>

      <section class="section">
        <h2>Categories</h2>
        <div class="chips">
          ${['All','Clothing','Shoes','Eyewear','Watches','Accessories'].map(c =>
            `<button data-cat="${c}">${c}</button>`
          ).join('')}
        </div>
      </section>

      <section class="section">
        <h2>Popular Products</h2>
        <div class="productgrid">
          ${products.filter(p => category === 'All' || p.category === category).map(p => `
            <article class="product">
              <div class="productpic">${p.emoji}</div>
              <div class="productinfo">
                <b>${p.name}</b>
                <div class="prices"><strong>${money(p.price)}</strong></div>
                <button class="add" data-add="${p.id}">Add to Cart</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    </main>
  `;

  document.querySelector('#account').onclick = account;
  document.querySelector('#cart').onclick = showCart;

  document.querySelectorAll('[data-cat]').forEach(b => {
    b.onclick = () => {
      category = b.dataset.cat;
      render();
    };
  });

  document.querySelectorAll('[data-add]').forEach(b => {
    b.onclick = () => {
      const p = products.find(x => x.id === b.dataset.add);
      cart.push(p);
      render();
    };
  });
}

function showCart() {
  app.innerHTML = `
    <main class="page">
      <h1>My Cart</h1>
      ${cart.map(p => `<p>${p.name} — ${money(p.price)}</p>`).join('')}
      <h3>Total: ${money(cart.reduce((s,p) => s+p.price,0))}</h3>
      <p>Online checkout अभी चालू नहीं है।</p>
      <button class="primary" onclick="location.reload()">Continue Shopping</button>
    </main>
  `;
}

function account() {
  if (user) {
    app.innerHTML = `
      <main class="page">
        <h1>My Account</h1>
        <p>${user.email}</p>
        <button class="primary" id="logout">Logout</button>
      </main>`;
    document.querySelector('#logout').onclick = async () => {
      await signOut(auth);
    };
    return;
  }

  app.innerHTML = `
    <main class="page">
      <h1>Login / Sign Up</h1>
      <form id="signupForm" class="form">
        <input name="name" placeholder="Your Name" required>
        <input name="email" type="email" placeholder="Email" required>
        <input name="phone" placeholder="Phone Number">
        <input name="password" type="password" placeholder="Password (6 characters minimum)" minlength="6" required>
        <button class="primary">Create Account</button>
      </form>
      <form id="loginForm" class="form">
        <h2>Already registered? Login</h2>
        <input name="email" type="email" placeholder="Email" required>
        <input name="password" type="password" placeholder="Password" required>
        <button class="primary">Login</button>
      </form>
      <p id="message"></p>
    </main>`;

  document.querySelector('#signupForm').onsubmit = async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await registerCustomer({
        name:f.get('name'), email:f.get('email'),
        phone:f.get('phone'), password:f.get('password')
      });
    } catch(err) {
      document.querySelector('#message').textContent = err.message;
    }
  };

  document.querySelector('#loginForm').onsubmit = async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      await login(f.get('email'),f.get('password'));
    } catch(err) {
      document.querySelector('#message').textContent = err.message;
    }
  };
}

onAuthStateChanged(auth, u => {
  user = u;
  render();
});

loadApprovedProducts().then(list => {
  if (list.length) products = list;
  render();
}).catch(() => {});

render();
