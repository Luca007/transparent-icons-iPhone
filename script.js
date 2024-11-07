        // Atualize as configurações do modelo para incluir o dock
        const modelConfigs = {
            iphone11: {
                small: {
                    iconSize: 66,
                    grid: { rows: 6, cols: 4 },
                    padding: { top: 92, side: 30 },
                    gap: { row: 25, col: 25 },
                    dock: {
                        iconSize: 66,
                        padding: { bottom: 28 },
                        gap: 25
                    }
                },
                large: {
                    iconSize: 80,
                    grid: { rows: 6, cols: 4 },
                    padding: { top: 120, side: 15 },
                    gap: { row: 15, col: 15 },
                    dock: {
                        iconSize: 80,
                        padding: { bottom: 20 },
                        gap: 15
                    }
                }
            },
            iphone11pro: {
                small: {
                    iconSize: 62.5,
                    grid: { rows: 6, cols: 4 },
                    padding: { top: 63.4, side: 28 },
                    gap: { row: 36.3, col: 28 },
                    dock: {
                        iconSize: 62.5,
                        padding: { bottom: 28 },
                        gap: 28
                    }
                },
                large: {
                    iconSize: 73.8,
                    grid: { rows: 6, cols: 4 },
                    padding: { top: 63.3, side: 17.65 },
                    gap: { row: 19.8, col: 19.9 },
                    dock: {
                        iconSize: 73.8,
                        padding: { bottom: 23 },
                        gap: 19.9
                    }
                }
            },
            iphone11promax: {
                small: {
                    iconSize: 60,
                    grid: { rows: 6, cols: 4 },
                    padding: { top: 150, side: 25 },
                    gap: { row: 12, col: 12 },
                    dock: {
                        iconSize: 60,
                        padding: { bottom: 10 },
                        gap: 12
                    }
                },
                large: {
                    iconSize: 80,
                    grid: { rows: 6, cols: 4 },
                    padding: { top: 130, side: 20 },
                    gap: { row: 18, col: 18 },
                    dock: {
                        iconSize: 80,
                        padding: { bottom: 15 },
                        gap: 18
                    }
                }
            }
        };
    
        let currentModel = 'iphone11pro';
        let currentSize = 'small';
        let uploadedImage = null;
        let dockApps = 4; // Número de apps no dock
        const selectedIcons = new Set();
        const selectedDockIcons = new Set();
    
        // Model and size selection
        document.querySelectorAll('.model-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.model-button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                currentModel = button.dataset.model;
                if (uploadedImage) {
                    updatePreview();
                }
            });
        });
    
        document.querySelectorAll('.size-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.size-button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                currentSize = button.dataset.size;
                if (uploadedImage) {
                    updatePreview();
                }
            });
        });
    
        // Dock apps selection using buttons
        document.querySelectorAll('.dock-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.dock-button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                dockApps = parseInt(button.dataset.dockApps);
                if (uploadedImage) {
                    updatePreview();
                }
            });
        });
    
        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const previewContainer = document.getElementById('previewContainer');
        const screenPreview = document.getElementById('screenPreview');
        const iconGrid = document.getElementById('iconGrid');
        const dockIconGrid = document.getElementById('dockIconGrid');
    
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(0,122,255,0.1)';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.backgroundColor = '';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = '';
            handleFile(e.dataTransfer.files[0]);
        });
    
        fileInput.addEventListener('change', (e) => {
            handleFile(e.target.files[0]);
        });
    
        function handleFile(file) {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImage = new Image();
                    uploadedImage.onload = () => {
                        updatePreview();
                        document.getElementById('downloadButton').style.display = 'none';
                        selectedIcons.clear();
                        selectedDockIcons.clear();
                    };
                    uploadedImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    
        function updatePreview() {
            previewContainer.style.display = 'block';
            screenPreview.src = uploadedImage.src;
    
            const config = modelConfigs[currentModel][currentSize];
            iconGrid.style.gridTemplateColumns = `repeat(${config.grid.cols}, ${config.iconSize}px)`;
            iconGrid.style.gridTemplateRows = `repeat(${config.grid.rows}, ${config.iconSize}px)`;
            iconGrid.innerHTML = '';
    
            // Ajuste a conversão de padding e gap para adicionar 'px' apenas ao definir o estilo
            iconGrid.style.padding = `${config.padding.top}px ${config.padding.side}px`;
            iconGrid.style.rowGap = `${config.gap.row}px`;
            iconGrid.style.columnGap = `${config.gap.col}px`;
    
            // Ajustar o tamanho da imagem de pré-visualização para caber no container
            screenPreview.style.maxWidth = '100%';
            screenPreview.style.height = 'auto';
    
            // Posicionar o iconGrid sobre a imagem
            iconGrid.style.position = 'absolute';
            iconGrid.style.top = '0';
            iconGrid.style.left = '0';
    
            // Atualizar a grade de ícones principais
            for (let i = 0; i < config.grid.rows * config.grid.cols; i++) {
                const iconPlaceholder = document.createElement('div');
                iconPlaceholder.className = 'icon-placeholder';
                iconPlaceholder.style.width = config.iconSize + 'px';
                iconPlaceholder.style.height = config.iconSize + 'px';
    
                if (selectedIcons.has(i)) {
                    iconPlaceholder.classList.add('selected');
                }
    
                iconPlaceholder.addEventListener('click', () => {
                    iconPlaceholder.classList.toggle('selected');
                    if (iconPlaceholder.classList.contains('selected')) {
                        selectedIcons.add(i);
                    } else {
                        selectedIcons.delete(i);
                    }
                    updateDownloadButtonVisibility();
                });
    
                iconGrid.appendChild(iconPlaceholder);
            }
    
            // Atualizar a grade de ícones do dock
            dockIconGrid.innerHTML = '';
            dockIconGrid.style.paddingBottom = `${config.dock.padding.bottom}px`;
            dockIconGrid.style.gap = `${config.dock.gap}px`;
    
            for (let i = 0; i < dockApps; i++) {
                const dockIconPlaceholder = document.createElement('div');
                dockIconPlaceholder.className = 'dock-icon-placeholder';
                dockIconPlaceholder.style.width = config.dock.iconSize + 'px';
                dockIconPlaceholder.style.height = config.dock.iconSize + 'px';
    
                if (selectedDockIcons.has(i)) {
                    dockIconPlaceholder.classList.add('selected');
                }
    
                dockIconPlaceholder.addEventListener('click', () => {
                    dockIconPlaceholder.classList.toggle('selected');
                    if (dockIconPlaceholder.classList.contains('selected')) {
                        selectedDockIcons.add(i);
                    } else {
                        selectedDockIcons.delete(i);
                    }
                    updateDownloadButtonVisibility();
                });
    
                dockIconGrid.appendChild(dockIconPlaceholder);
            }
        }
    
        function updateDownloadButtonVisibility() {
            const totalSelected = selectedIcons.size + selectedDockIcons.size;
            document.getElementById('downloadButton').style.display = totalSelected > 0 ? 'block' : 'none';
        }
    
        // Atualize a função de download
        document.getElementById('downloadButton').addEventListener('click', () => {
            if (selectedIcons.size === 0 && selectedDockIcons.size === 0) {
                alert('Selecione pelo menos um ícone para baixar');
                return;
            }
    
            const config = modelConfigs[currentModel][currentSize];
    
            // Calcular o fator de escala entre a imagem original e a pré-visualização
            const previewRect = screenPreview.getBoundingClientRect();
            const scaleX = uploadedImage.naturalWidth / previewRect.width;
            const scaleY = uploadedImage.naturalHeight / previewRect.height;
    
            // Download dos ícones principais
            selectedIcons.forEach(iconIndex => {
                // Calcular a posição do ícone na pré-visualização
                const col = iconIndex % config.grid.cols;
                const row = Math.floor(iconIndex / config.grid.cols);
    
                const iconPositionX = config.padding.side + col * (config.iconSize + config.gap.col);
                const iconPositionY = config.padding.top + row * (config.iconSize + config.gap.row);
    
                // Ajustar as coordenadas e tamanhos pelo fator de escala
                const x = iconPositionX * scaleX;
                const y = iconPositionY * scaleY;
                const iconSizeX = config.iconSize * scaleX;
                const iconSizeY = config.iconSize * scaleY;
    
                // Criar o canvas com o tamanho do ícone na imagem original
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(iconSizeX);
                canvas.height = Math.round(iconSizeY);
                const ctx = canvas.getContext('2d');
    
                // Desenhar o ícone cortado no canvas
                ctx.drawImage(uploadedImage, x, y, iconSizeX, iconSizeY, 0, 0, canvas.width, canvas.height);
    
                // Baixar o ícone gerado
                const link = document.createElement('a');
                link.download = `icon_${iconIndex + 1}_${currentSize}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
    
            // Download dos ícones do dock
            selectedDockIcons.forEach(dockIndex => {
                // Calcular a posição do ícone no dock
                const totalDockWidth = dockApps * config.dock.iconSize + (dockApps - 1) * config.dock.gap;
                const startX = (previewRect.width - totalDockWidth) / 2;
    
                const iconPositionX = startX + dockIndex * (config.dock.iconSize + config.dock.gap);
                const iconPositionY = previewRect.height - config.dock.iconSize - config.dock.padding.bottom;
    
                // Ajustar as coordenadas e tamanhos pelo fator de escala
                const x = iconPositionX * scaleX;
                const y = iconPositionY * scaleY;
                const iconSizeX = config.dock.iconSize * scaleX;
                const iconSizeY = config.dock.iconSize * scaleY;
    
                // Criar o canvas com o tamanho do ícone na imagem original
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(iconSizeX);
                canvas.height = Math.round(iconSizeY);
                const ctx = canvas.getContext('2d');
    
                // Desenhar o ícone cortado no canvas
                ctx.drawImage(uploadedImage, x, y, iconSizeX, iconSizeY, 0, 0, canvas.width, canvas.height);
    
                // Baixar o ícone gerado
                const link = document.createElement('a');
                link.download = `dock_icon_${dockIndex + 1}_${currentSize}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        });
    
        // Initialize with iPhone 11 Pro, small icons, and 4 dock apps selected
        document.querySelector('[data-model="iphone11pro"]').classList.add('active');
        document.querySelector('[data-size="small"]').classList.add('active');
        document.querySelector('[data-dock-apps="4"]').classList.add('active');
