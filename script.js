let cards = JSON.parse(localStorage.getItem('cards')) || [];

function openForm() {
  document.getElementById('formContainer').classList.toggle('hidden');
}

function saveCard() {
  const fileInput = document.getElementById('imgInput');
  const reader = new FileReader();
  reader.onload = function () {
    const newCard = {
      img: reader.result,
      name: document.getElementById('nameInput').value,
      id: document.getElementById('idInput').value,
      category: document.getElementById('categoryInput').value,
      expiry: document.getElementById('expiryInput').value
    };
    cards.push(newCard);
    localStorage.setItem('cards', JSON.stringify(cards));
    displayCards();
  };
  if (fileInput.files[0]) {
    reader.readAsDataURL(fileInput.files[0]);
  }
}

function displayCards(filter = 'الكل') {
  const container = document.getElementById('cardsContainer');
  if (!container) return;
  container.innerHTML = '';
  const today = new Date().toISOString().split('T')[0];

  cards.forEach(card => {
    const isExpired = today > card.expiry;
    if (filter !== 'الكل' && filter !== card.category && !(filter === 'منتهي' && isExpired)) return;

    let remaining = Math.ceil((new Date(card.expiry) - new Date()) / (1000*60*60*24));
    if (remaining < 0) remaining = 0;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card' + (isExpired ? ' expired' : '');
    cardDiv.innerHTML = `
      <img src="${card.img}" alt="">
      <h3>${card.name}</h3>
      <p>هوية: ${card.id}</p>
      <p>الفئة: ${card.category}</p>
      <p>ينتهي: ${card.expiry}</p>
      <p>${isExpired ? "انتهى التأمين" : "متبقي " + remaining + " يوم"}</p>
    `;
    container.appendChild(cardDiv);
  });
}

function filterCards(cat) {
  displayCards(cat);
}

function clearData() {
  if (confirm("متأكد من حذف جميع البيانات؟")) {
    localStorage.removeItem('cards');
    cards = [];
    displayCards();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayCards();
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const val = searchInput.value.toLowerCase();
      const container = document.getElementById('cardsContainer');
      container.querySelectorAll('.card').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(val) ? '' : 'none';
      });
    });
  }
});