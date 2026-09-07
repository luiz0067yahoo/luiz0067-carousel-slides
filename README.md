# luiz0067 Carousel Slides 🎠

[![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue.svg?logo=wordpress)](https://wordpress.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952b3.svg?logo=bootstrap)](https://getbootstrap.com)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-6.5.2-528DD7.svg?logo=fontawesome)](https://fontawesome.com)
[![License: GPL v2+](https://img.shields.io/badge/License-GPL%20v2%2B-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

Plugin WordPress moderno e intuitivo que adiciona um bloco nativo do **Gutenberg** para criação e gerenciamento de carrosséis de imagens responsivos com **Bootstrap 5** e ícones **Font Awesome 6**.

---

![Screenshot do luiz0067 Carousel Slides](screenshot.png)

---

## 🚀 Principais Recursos

- **100% WYSIWYG (Fidelidade Visual)**: O que você visualiza e edita no editor de blocos é exatamente o que é renderizado no preview e no frontend do site.
- **Barra de Ações Rápida sobre o Slide**:
  - ➕ **Adicionar**: Insere novos slides diretamente da Biblioteca de Mídia.
  - ✏️ **Editar**: Troca a imagem do slide ativo com um clique.
  - ▾ **Ajuste de Imagem individual (`object-fit`)**: Escolha entre `cover`, `contain`, `fill`, `scale-down` e `none` para cada slide.
  - ▾ **Posição da Imagem individual (`object-position`)**: Controle 9 pontos focais (`top left`, `center center`, `bottom right`, etc.) para cada slide.
  - ❌ **Excluir**: Remove o slide ativo com segurança.
- **Legenda Elegante Sobreposta no Rodapé**:
  - Título e descrição centralizados sobre a imagem.
  - Gradiente translúcido escuro de fundo garantindo alto contraste e leitura em qualquer foto.
  - Margem inferior inteligente de 40px, evitando sobreposição com os indicadores do carrossel.
- **Controles e Navegação**:
  - Setas circulares de navegação (`<` e `>`) translúcidas e destacadas no editor e no frontend.
  - Indicadores (bolinhas/barras) inferiores com animação de escala no slide ativo.
  - Badge de contagem (`Slide X - Y`).
- **Isolamento de Foco e Digitação Natural**:
  - Sem sobreposição de camadas ou perda de foco.
  - Edição de títulos (até 50 caracteres) e descrições (até 100 caracteres) sem travamento de cursor.
- **Compatibilidade Global**:
  - Totalmente compatível com **Block Themes** (Full Site Editing - FSE) e **Classic Themes**.
  - Carregamento de scripts e estilos via `enqueue_block_assets` e `add_editor_style()`.

---

## 📂 Estrutura do Projeto

```text
luiz0067-carousel-slides/
├── assets/                                           # Bibliotecas locais (Bootstrap 5.3.8 e Font Awesome 6)
├── js/
│   └── blocks/
│       └── slide-show.js                             # Registro do bloco Gutenberg, edição e renderização
├── languages/                                        # Arquivos de tradução i18n
├── plugin/
│   └── blocks.php                                    # Registro nativo no PHP via register_block_type
├── style.css                                         # Estilos customizados e regras de fidelidade visual
├── luiz0067-carousel-slides.php                      # Arquivo principal do plugin
├── readme.txt                                        # Metadados e documentação para o repositório WordPress
├── README.md                                         # Documentação do projeto
└── screenshot.png                                    # Captura de tela do bloco
```

---

## 📦 Instalação

1. Baixe ou clone este repositório para o diretório de plugins do seu WordPress:
   ```bash
   cd wp-content/plugins/
   git clone https://github.com/luiz0067yahoo/luiz0067-carousel-slides.git
   ```
2. No painel de administração do WordPress, vá em **Plugins > Plugins Instalados**.
3. Localize **luiz0067 Carousel Slides** e clique em **Ativar**.

---

## 🛠️ Como Utilizar

1. Abra ou crie qualquer Post ou Página no **Editor de Blocos (Gutenberg)**.
2. Clique no botão de adicionar bloco (`+`) e procure por **luiz0067 Carousel Slides** (categoria *Mídia*).
3. Selecione as imagens desejadas na **Biblioteca de Mídia do WordPress**.
4. Use a barra de controles sobre o slide para:
   - Trocar a imagem, adicionar mais fotos ou excluir o slide.
   - Ajustar o enquadramento (`object-fit`) e o alinhamento (`object-position`).
   - Digitar o título e a descrição diretamente sobre o slide.
5. Salve ou publique o post e visualize o carrossel interativo e responsivo no seu site!

---

## 🎨 Opções de Ajuste de Imagem

| Ajuste (`object-fit`) | Comportamento |
| :--- | :--- |
| **Cover** *(padrão)* | Cobre toda a área do slide, cortando excessos se necessário sem distorcer. |
| **Contain** | Exibe a imagem completa sem cortes, preservando a proporção original. |
| **Fill** | Estica e preenche 100% da área do slide. |
| **Scale-down** | Reduz a imagem se ela for maior que o container; caso contrário, mantém o tamanho original. |
| **None** | Exibe a imagem em tamanho real sem redimensionamento. |

---

## 👨‍💻 Autor

- **Luiz Fernando Brogliatto Ferreira**
- WordPress.org: [@luiz0067](https://profiles.wordpress.org/luiz0067/)
- GitHub: [@luiz0067yahoo](https://github.com/luiz0067yahoo)

---

## 📄 Licença

Este projeto está licenciado sob a licença **GPL-2.0-or-later** — consulte o arquivo de licença para mais detalhes.
