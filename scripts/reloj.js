(function () {
        /********** MENU PERFIL **********/
        const perfilBtn = document.getElementById('perfil-btn');
        const iconoPerfil = document.getElementById('icono-perfil');
        const dropdown = document.getElementById('dropdown-menu');
        const perfilContainer = document.getElementById('perfil-container');

        function toggleMenu() {
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            perfilBtn.setAttribute('aria-expanded', String(!isOpen));
            dropdown.setAttribute('aria-hidden', String(isOpen));
        }
        perfilBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
        iconoPerfil && iconoPerfil.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });

        // Cerrar si se hace click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.perfil-container')) {
                dropdown.style.display = 'none';
                perfilBtn.setAttribute('aria-expanded', 'false');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        });

        /********** TEMPORIZADOR + VIDEO **********/
        const startBtn = document.getElementById('start');
        const pauseBtn = document.getElementById('pause');
        const resetBtn = document.getElementById('reset');
        const display = document.getElementById('timer');
        const video = document.getElementById('video-fondo');

        // Configuración inicial
        let timeLeft = 25 * 60; // segundos
        let timer = null;
        let isRunning = false;

        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            display.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        }
        updateDisplay();

        function startTimer() {
            console.log('startTimer llamado');
            if (isRunning) return;
            isRunning = true;

            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timer);
                    timer = null;
                    isRunning = false;
                    alert('¡Pomodoro completado!');
                }
            }, 1000);

            let musica = document.getElementById("musica-pomodoro");
            musica.play();
        }

        function pauseTimer() {
            console.log('pauseTimer llamado');
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            isRunning = false;

            let musica = document.getElementById("musica-pomodoro");
            musica.pause();
        }

        function resetTimer() {
            console.log('resetTimer llamado');
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            isRunning = false;
            timeLeft = 25 * 60;
            updateDisplay();

            let musica = document.getElementById("musica-pomodoro");
            musica.pause();
            musica.currentTime = 0;
        }

        // Event listeners
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        // DEBUG helpers: imprime estado al abrir consola
        window.__FIXTIME_DEBUG = {
            getState: () => ({ isRunning, timeLeft, videoClassList: video.className })
        };

    })();
