// Firebase SDK (compat mode)
const firebaseConfig = {
    apiKey: "AIzaSyCm3YlXDSs4V5TbvehbesZWAnDK8Yc9ehw",
    authDomain: "site1-75e42.firebaseapp.com",
    projectId: "site1-75e42",
    storageBucket: "site1-75e42.firebasestorage.app",
    messagingSenderId: "73503340773",
    appId: "1:73503340773:web:6ae4390f6624b09217fc0c",
    measurementId: "G-1GCCGY1X7D"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});

async function loadContent() {
    const poemListContainer = document.getElementById('poem-list');
    const featuredPoemsContainer = document.getElementById('featured-poems');
    const poemDetailContainer = document.getElementById('poem-detail');

    try {
        const snapshot = await db.collection("siirler").orderBy("date", "desc").get();
        const poems = [];
        snapshot.forEach(doc => {
            poems.push({ id: doc.id, ...doc.data() });
        });

        if (featuredPoemsContainer) renderFeaturedPoems(poems, featuredPoemsContainer);
        if (poemListContainer) renderAllPoems(poems, poemListContainer);
        if (poemDetailContainer) renderPoemDetail(poems, poemDetailContainer);
    } catch (error) {
        console.error('Hata:', error);
        if(poemListContainer) poemListContainer.innerHTML = "<p>Şiirler yüklenirken bir hata oluştu.</p>";
    }
}

function renderFeaturedPoems(poems, container) {
    const featured = poems.filter(p => p.featured).slice(0, 2);
    featured.forEach(poem => {
        container.appendChild(createPoemCard(poem, true)); // Öne çıkanlar için farklı stil
    });
}

function renderAllPoems(poems, container) {
    poems.forEach(poem => {
        container.appendChild(createPoemCard(poem, false));
    });
}

function createPoemCard(poem, isFeatured) {
    const card = document.createElement('article');
    card.className = 'poem-card fade-in';
    
    let imageHtml = "";
    if (poem.imageUrl) {
        imageHtml = `<img src="${poem.imageUrl}" alt="${poem.title}" class="poem-card-image">`;
    }

    card.innerHTML = `
        ${imageHtml}
        <div class="poem-card-content">
            <span class="date">${formatDate(poem.date)}</span>
            <h2>${poem.title}</h2>
            <p>${poem.excerpt}</p>
            <a href="siir.html?id=${poem.id}" class="read-more">Devamını Oku &rarr;</a>
        </div>
    `;
    return card;
}

async function renderPoemDetail(poems, container) {
    const urlParams = new URLSearchParams(window.location.search);
    const poemId = urlParams.get('id');
    const poem = poems.find(p => p.id === poemId);

    if (poem) {
        document.title = `${poem.title} - Gönülden Dökülenler`;
        
        let imageHtml = "";
        if (poem.imageUrl) {
            imageHtml = `<img src="${poem.imageUrl}" alt="${poem.title}" class="poem-detail-image">`;
        }

        container.innerHTML = `
            <div class="poem-detail-header fade-in">
                <span class="date">${formatDate(poem.date)}</span>
                <h1>${poem.title}</h1>
                <div class="poem-divider"></div>
            </div>
            ${imageHtml}
            <div class="poem-content fade-in" style="animation-delay: 0.3s">
                ${poem.content.replace(/\n/g, '<br>')}
            </div>
            <div class="poem-divider fade-in" style="animation-delay: 0.6s"></div>
            <div style="text-align: center" class="fade-in" style="animation-delay: 0.8s">
                <a href="siirler.html" class="read-more">&larr; Tüm Şiirlere Dön</a>
            </div>
        `;
    } else {
        container.innerHTML = `<h2>Şiir bulunamadı.</h2><a href="siirler.html">Tüm şiirlere dön</a>`;
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
}
