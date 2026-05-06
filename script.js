let cart = [];

/* ================================
   OPEN / CLOSE CART SIDEBAR
   ================================ */
function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");

  const isOpen = sidebar.style.right === "0px";

  if (isOpen) {
    sidebar.style.right = "-400px";
    overlay.style.display = "none";
  } else {
    sidebar.style.right = "0px";
    overlay.style.display = "block";
  }
}

/* ================================
   ADD TO CART + ANIMASI BOUNCE
   ================================ */
function addToCart(name, price, image) {
  let item = cart.find(i => i.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }

  updateCart();

  // Bounce animation pada icon cart
  const cartIcon = document.querySelector(".cart-icon i");
  cartIcon.classList.add("bounce");
  setTimeout(() => cartIcon.classList.remove("bounce"), 600);
}

/* ================================
   UPDATE CART DISPLAY
   ================================ */
function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  const total = document.getElementById("cartTotal");

  cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p>Keranjang belanja kosong</p>
      </div>`;
    summary.style.display = "none";
    return;
  }

  summary.style.display = "block";

  cart.forEach((item, index) => {
    cartItems.innerHTML += `
    <div class="cart-item">
      <img src="${item.image}">
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>Rp ${item.price.toLocaleString()}</p>

        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>

      <i class="fas fa-trash delete-item" onclick="deleteItem(${index})"></i>
    </div>
    `;
  });

  total.textContent = "Rp " + cart
    .reduce((a, b) => a + b.price * b.qty, 0)
    .toLocaleString();
}

/* ================================
   CHANGE QTY
   ================================ */
function changeQty(i, amount) {
  cart[i].qty += amount;

  if (cart[i].qty <= 0) cart.splice(i, 1);

  updateCart();
}

/* ================================
   DELETE ITEM
   ================================ */
function deleteItem(i) {
  cart.splice(i, 1);
  updateCart();
}

/* ================================
   CHECKOUT WHATSAPP
   ================================ */
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;

  if (!name || !phone) {
    alert("Nama & Nomor WhatsApp wajib diisi.");
    return;
  }

  let text = `Halo, saya ingin memesan:\n`;

  cart.forEach(item => {
    text += `• ${item.name} x${item.qty} = Rp ${(
      item.price * item.qty
    ).toLocaleString()}\n`;
  });

  text += `\nTotal: Rp ${cart
    .reduce((a, b) => a + b.price * b.qty, 0)
    .toLocaleString()}`;

  text += `\n\nNama: ${name}`;
  text += `\nNo. WA: ${phone}`;

  let encoded = encodeURIComponent(text);
  window.open(`https://wa.me/62895610454357?text=${encoded}`);

  // confetti saat checkout
  startConfetti();
}

/* ================================
   MINI CONFETTI EFFECT
   ================================ */
function startConfetti() {
  for (let i = 0; i < 30; i++) {
    let conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.animationDuration = 1 + Math.random() * 1 + "s";
    document.body.appendChild(conf);

    setTimeout(() => conf.remove(), 2000);
  }
}

/* CONFETTI STYLE */
const style = document.createElement("style");
style.innerHTML = `
.confetti {
  position: fixed;
  width: 8px;
  height: 8px;
  background: hsl(${Math.random() * 360}, 80%, 60%);
  top: -10px;
  animation: fall linear forwards;
  z-index: 2000;
  border-radius: 2px;
}
@keyframes fall {
  to {
    transform: translateY(100vh) rotate(720deg);
  }
}
.bounce {
  animation: bounce 0.4s;
}
@keyframes bounce {
  0% { transform: scale(1) }
  50% { transform: scale(1.4) }
  100% { transform: scale(1) }
}`;
document.head.appendChild(style);
