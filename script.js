        let osszesMegoszlas = [];
        let diagram1, diagram2;

        window.onload = function() {
            const mentettAdatok = localStorage.getItem('kerdoivAdatok');
            if (mentettAdatok) {
                osszesMegoszlas = JSON.parse(mentettAdatok);
                diagramokFrissitese();
            }
        };

        document.querySelectorAll('.valasz').forEach(valasz => {
            valasz.addEventListener('click', function() {
                const kerdesDiv = this.closest('.valaszok');
                kerdesDiv.querySelectorAll('.valasz').forEach(v => v.classList.remove('kivalasztott'));
                this.classList.add('kivalasztott');
            });
        });

        function kerdoivBekuldes() {
            const kivalasztottak = document.querySelectorAll('.valasz.kivalasztott');
            if (kivalasztottak.length < 2) {
                alert('Kérjük, válaszoljon minden kérdésre!');
                return;
            }

            let aktualisMegoszlas = {
                1: 0,
                2: 0,
                visszajelzes: document.getElementById('visszajelzes').value
            };

            kivalasztottak.forEach(valasz => {
                const kerdesIndex = valasz.parentElement.dataset.kerdes;
                const ertek = parseInt(valasz.dataset.ertek);
                aktualisMegoszlas[kerdesIndex] = ertek;
            });

            osszesMegoszlas.push(aktualisMegoszlas);

            localStorage.setItem('kerdoivAdatok', JSON.stringify(osszesMegoszlas));

            diagramokFrissitese();
            eredmenyekMutat();
        }

        function kerdoivMutat() {
            document.getElementById('kerdoiv').style.display = 'block';
            document.getElementById('eredmenyek').style.display = 'none';
            document.querySelectorAll('.valasz.kivalasztott').forEach(v => v.classList.remove('kivalasztott'));
            document.getElementById('visszajelzes').value = '';
        }

        function eredmenyekMutat() {
            document.getElementById('kerdoiv').style.display = 'none';
            document.getElementById('eredmenyek').style.display = 'block';
        }

        function diagramokFrissitese() {
            const kitoltokSzama = osszesMegoszlas.length;
            document.getElementById('kitoltokSzama').textContent = kitoltokSzama;

            let valaszok = {
                1: [0, 0, 0, 0],
                2: [0, 0, 0, 0]
            };

            osszesMegoszlas.forEach(megoszlas => {
                valaszok[1][megoszlas[1] - 1]++;
                valaszok[2][megoszlas[2] - 1]++;
            });

            const ctx1 = document.getElementById('diagram1').getContext('2d');
            const ctx2 = document.getElementById('diagram2').getContext('2d');

            if (diagram1) diagram1.destroy();
            if (diagram2) diagram2.destroy();

            const diagramOpciok = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            };

            diagram1 = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Egyáltalán nem', 'Inkább nem', 'Inkább igen', 'Nagyon!'],
                    datasets: [{
                        label: 'Válaszok száma',
                        data: valaszok[1],
                        backgroundColor: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF']
                    }]
                },
                options: {
                    ...diagramOpciok,
                    plugins: {
                        ...diagramOpciok.plugins,
                        title: {
                            ...diagramOpciok.plugins.title,
                            text: 'Mennyire volt elégedett az ügyintézéssel?'
                        }
                    }
                }
            });

            diagram2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Egyáltalán nem', 'Inkább nem', 'Inkább igen', 'Nagyon!'],
                    datasets: [{
                        label: 'Válaszok száma',
                        data: valaszok[2],
                        backgroundColor: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF']
                    }]
                },
                options: {
                    ...diagramOpciok,
                    plugins: {
                        ...diagramOpciok.plugins,
                        title: {
                            ...diagramOpciok.plugins.title,
                            text: 'Megfelelőnek találta a bejelentésére adott válaszunkat, megoldásunkat?'
                        }
                    }
                }
            });
        }

        function osszesMegszuntet() {
            if (confirm('Biztosan törölni szeretné az összes adatot?')) {
                localStorage.removeItem('kerdoivAdatok');
                osszesMegoszlas = [];
                diagramokFrissitese();
                eredmenyekMutat();
            }
        }