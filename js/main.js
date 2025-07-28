document.addEventListener('DOMContentLoaded', () => {
    const pictogramGrid = document.getElementById('pictogram-grid');
    const synth = window.speechSynthesis;


    function populateCategories() {
        const categories = [...new Set(pictograms.map(p => p.category))];
        const categorySelector = document.getElementById('category-selector');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelector.appendChild(option);
        });
    }

    function loadPictograms(category = 'all') {
        pictogramGrid.innerHTML = '';
        const filteredPictograms = category === 'all'
            ? pictograms
            : pictograms.filter(p => p.category === category);

        filteredPictograms.forEach(pictogram => {
            const pictoElement = document.createElement('div');
            pictoElement.classList.add('col-4', 'col-md-3', 'mb-3');
            pictoElement.draggable = true;
            pictoElement.dataset.id = pictogram.id;
            pictoElement.innerHTML = `
                <div class="pictogram card text-center">
                    <div class="card-body">
                        <i class="iconify-icon" data-icon="${pictogram.icon}" data-width="60" data-height="60"></i>
                        <p class="card-text mt-2">${pictogram.text}</p>
                    </div>
                </div>
            `;
            pictoElement.addEventListener('click', () => {
                addPictogramToPhrase(pictogram);
                speak(pictogram.text);
                animatePictogram(pictoElement);
            });
            pictoElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', pictogram.id);
            });
            pictogramGrid.appendChild(pictoElement);
        });
    }

    document.getElementById('category-selector').addEventListener('change', (e) => {
        loadPictograms(e.target.value);
    });

    function addPictogramToPhrase(pictogram) {
        const phraseBuilder = document.getElementById('phrase-builder');
        const pictoElement = document.createElement('div');
        pictoElement.classList.add('pictogram', 'd-inline-block', 'm-1', 'text-center');
        pictoElement.dataset.id = pictogram.id;
        pictoElement.innerHTML = `
            <i class="iconify-icon" data-icon="${pictogram.icon}" data-width="40" data-height="40"></i>
            <p>${pictogram.text}</p>
        `;
        phraseBuilder.appendChild(pictoElement);
        phraseBuilder.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            phraseBuilder.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
    }

    const phraseBuilder = document.getElementById('phrase-builder');
    phraseBuilder.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    phraseBuilder.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const pictogram = pictograms.find(p => p.id == id);
        if (pictogram) {
            addPictogramToPhrase(pictogram);
        }
    });

    document.getElementById('play-phrase').addEventListener('click', () => {
        const phraseBuilder = document.getElementById('phrase-builder');
        const pictos = phraseBuilder.querySelectorAll('.pictogram');
        if (pictos.length > 0) {
            let phrase = '';
            pictos.forEach(picto => {
                const id = picto.dataset.id;
                const pictogram = pictograms.find(p => p.id == id);
                if (pictogram) {
                    phrase += pictogram.text + ' ';
                }
            });
            speak(phrase.trim());
            showReward();
        }
    });

    function showReward() {
        const rewardModal = new bootstrap.Modal(document.getElementById('rewardModal'));
        rewardModal.show();
        setTimeout(() => {
            rewardModal.hide();
        }, 2000);
    }

    document.getElementById('clear-phrase').addEventListener('click', () => {
        const phraseBuilder = document.getElementById('phrase-builder');
        phraseBuilder.innerHTML = '';
    });

    let utterThis = new SpeechSynthesisUtterance();
    utterThis.lang = 'es-ES';

    function speak(text) {
        if (synth.speaking) {
            console.error('SpeechSynthesis.speaking');
            return;
        }
        utterThis.text = text;
        synth.speak(utterThis);
    }

    function animatePictogram(element) {
        element.style.transform = 'scale(1.1)';
        element.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = 'none';
        }, 300);
    }

    const translations = {
        es: {
            title: 'Sistema de Pictogramas Interactivo',
            pictogramsTitle: 'Pictogramas',
            phraseBuilderTitle: 'Construye tu frase',
            playPhraseButton: 'Reproducir Frase',
            clearButton: 'Limpiar',
            savePhraseButton: 'Guardar Frase',
            exportPhraseButton: 'Exportar a Imagen',
            savedPhrasesTitle: 'Frases Guardadas',
            usageHistoryTitle: 'Historial de Uso',
            rewardModalTitle: '¡Muy bien!',
            rewardModalText: '¡Has formado una frase!',
            pinModalTitle: 'Introduce el PIN',
            pinSubmitButton: 'Aceptar',
            settingsModalTitle: 'Ajustes',
            managePictogramsTitle: 'Gestionar Pictogramas',
            managePictogramsText: 'Aquí podrás añadir, editar o eliminar pictogramas.',
            languageSettingsTitle: 'Configuración de Idioma',
        },
        en: {
            title: 'Interactive Pictogram System',
            pictogramsTitle: 'Pictograms',
            phraseBuilderTitle: 'Build your phrase',
            playPhraseButton: 'Play Phrase',
            clearButton: 'Clear',
            savePhraseButton: 'Save Phrase',
            exportPhraseButton: 'Export to Image',
            savedPhrasesTitle: 'Saved Phrases',
            usageHistoryTitle: 'Usage History',
            rewardModalTitle: 'Well done!',
            rewardModalText: 'You have formed a phrase!',
            pinModalTitle: 'Enter PIN',
            pinSubmitButton: 'Accept',
            settingsModalTitle: 'Settings',
            managePictogramsTitle: 'Manage Pictograms',
            managePictogramsText: 'Here you can add, edit or delete pictograms.',
            languageSettingsTitle: 'Language Settings',
        }
    };

    function updateUI(lang) {
        document.querySelector('h1').textContent = translations[lang].title;
        document.querySelector('.col-md-8 h2').textContent = translations[lang].pictogramsTitle;
        document.querySelector('.col-md-4 .mb-4 h2').textContent = translations[lang].phraseBuilderTitle;
        document.getElementById('play-phrase').textContent = translations[lang].playPhraseButton;
        document.getElementById('clear-phrase').textContent = translations[lang].clearButton;
        document.getElementById('save-phrase').textContent = translations[lang].savePhraseButton;
        document.getElementById('export-phrase').textContent = translations[lang].exportPhraseButton;
        document.querySelector('.col-md-4 div:last-child h2:first-of-type').textContent = translations[lang].savedPhrasesTitle;
        document.querySelector('.col-md-4 div:last-child h2:last-of-type').textContent = translations[lang].usageHistoryTitle;
        document.getElementById('rewardModalLabel').textContent = translations[lang].rewardModalTitle;
        document.querySelector('#rewardModal .modal-body p').textContent = translations[lang].rewardModalText;
        document.getElementById('pinModalLabel').textContent = translations[lang].pinModalTitle;
        document.getElementById('pin-submit').textContent = translations[lang].pinSubmitButton;
        document.getElementById('settingsModalLabel').textContent = translations[lang].settingsModalTitle;
        document.querySelector('#settingsModal h4').textContent = translations[lang].managePictogramsTitle;
        document.querySelector('#settingsModal p').textContent = translations[lang].managePictogramsText;
        document.querySelector('#settingsModal h4:last-of-type').textContent = translations[lang].languageSettingsTitle;
    }

    document.getElementById('language-selector').addEventListener('change', (e) => {
        const lang = e.target.value;
        updateUI(lang);
        utterThis.lang = lang === 'es' ? 'es-ES' : 'en-US';
    });

    document.getElementById('dark-mode-switch').addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
    });

    document.getElementById('high-contrast-switch').addEventListener('change', (e) => {
        document.body.classList.toggle('high-contrast', e.target.checked);
    });

    document.getElementById('font-size-slider').addEventListener('input', (e) => {
        document.body.style.fontSize = `${e.target.value}px`;
        localStorage.setItem('fontSize', e.target.value);
    });

    document.getElementById('dark-mode-switch').addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        localStorage.setItem('darkMode', e.target.checked);
    });

    document.getElementById('high-contrast-switch').addEventListener('change', (e) => {
        document.body.classList.toggle('high-contrast', e.target.checked);
        localStorage.setItem('highContrast', e.target.checked);
    });

    document.getElementById('language-selector').addEventListener('change', (e) => {
        const lang = e.target.value;
        updateUI(lang);
        utterThis.lang = lang === 'es' ? 'es-ES' : 'en-US';
        localStorage.setItem('language', lang);
    });

    document.getElementById('export-phrase').addEventListener('click', () => {
        const phraseBuilder = document.getElementById('phrase-builder');
        html2canvas(phraseBuilder).then(canvas => {
            const link = document.createElement('a');
            link.download = 'frase.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    let savedPhrases = JSON.parse(localStorage.getItem('savedPhrases')) || [];
    let history = JSON.parse(localStorage.getItem('history')) || [];

    function renderSavedPhrases() {
        const savedPhrasesList = document.getElementById('saved-phrases');
        savedPhrasesList.innerHTML = '';
        savedPhrases.forEach((phrase, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = phrase.text;
            li.addEventListener('click', () => {
                const phraseBuilder = document.getElementById('phrase-builder');
                phraseBuilder.innerHTML = '';
                phrase.pictograms.forEach(pictoId => {
                    const pictogram = pictograms.find(p => p.id == pictoId);
                    if (pictogram) {
                        addPictogramToPhrase(pictogram);
                    }
                });
            });
            savedPhrasesList.appendChild(li);
        });
    }

    function renderHistory() {
        const historyList = document.getElementById('history');
        historyList.innerHTML = '';
        history.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `${item.phrase} - ${new Date(item.date).toLocaleString()}`;
            historyList.appendChild(li);
        });
    }

    document.getElementById('save-phrase').addEventListener('click', () => {
        const phraseBuilder = document.getElementById('phrase-builder');
        const pictos = phraseBuilder.querySelectorAll('.pictogram');
        if (pictos.length > 0) {
            const phrase = {
                text: Array.from(pictos).map(p => p.querySelector('img').alt).join(' '),
                pictograms: Array.from(pictos).map(p => p.dataset.id)
            };
            savedPhrases.push(phrase);
            localStorage.setItem('savedPhrases', JSON.stringify(savedPhrases));
            renderSavedPhrases();
        }
    });

    document.getElementById('play-phrase').addEventListener('click', () => {
        const phraseBuilder = document.getElementById('phrase-builder');
        const pictos = phraseBuilder.querySelectorAll('.pictogram');
        if (pictos.length > 0) {
            let phrase = '';
            pictos.forEach(picto => {
                const id = picto.dataset.id;
                const pictogram = pictograms.find(p => p.id == id);
                if (pictogram) {
                    phrase += pictogram.text + ' ';
                }
            });
            speak(phrase.trim());
            showReward();
            history.unshift({ phrase: phrase.trim(), date: new Date() });
            localStorage.setItem('history', JSON.stringify(history));
            renderHistory();
        }
    });

    function loadSettings() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const highContrast = localStorage.getItem('highContrast') === 'true';
        const fontSize = localStorage.getItem('fontSize');
        const language = localStorage.getItem('language');

        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('dark-mode-switch').checked = true;
        }
        if (highContrast) {
            document.body.classList.add('high-contrast');
            document.getElementById('high-contrast-switch').checked = true;
        }
        if (fontSize) {
            document.body.style.fontSize = `${fontSize}px`;
            document.getElementById('font-size-slider').value = fontSize;
        }
        if (language) {
            updateUI(language);
            document.getElementById('language-selector').value = language;
            utterThis.lang = language === 'es' ? 'es-ES' : 'en-US';
        }
    }

    populateCategories();
    loadPictograms();
    renderSavedPhrases();
    renderHistory();
    loadSettings();

});
