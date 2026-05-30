# 🎹 Music Multi-Station 🚀

> 🔗 **Link do projeto:** [Acesse a Estação Musical Completa](https://jucianasoares.github.io/music-multi-station/)

Um simulador musical e estação de loops interativa e ultra-responsiva desenvolvida para a web. O projeto expande os conceitos de manipulação do DOM e áudio no ecossistema de Front-End, permitindo ao utilizador explorar diferentes instrumentos, gravar as suas próprias composições e personalizar a interface com múltiplos temas visuais dinâmicos.

---

## 🌟 Funcionalidades Principais

* **Estação Multiuso Integrada:** Alterna instantaneamente entre três modos de som:
    * 🎹 **Piano Tradicional:** Sons realistas de teclado via ficheiros de áudio `.wav`.
    * 🚀 **Sintetizador Espacial:** Geração de ondas sonoras dinâmicas do tipo *sawtooth* em tempo real através da Web Audio API do navegador.
    * 🥁 **MPC Pads (Bateria):** Grade de percussão integrada para criar ritmos e batidas de suporte.
* **Loop Station (Gravador Avançado):** Grava as tuas sequências musicais utilizando carimbos de data/hora (`Date.now()`). O sistema reproduz as notas gravadas de forma inteligente, ajustando-se ao volume selecionado e aos efeitos visuais das teclas.
* **Fábrica de Cores Dinâmica (6 Temas):** Troca de visuais sem recarregar a página, controlada por Variáveis CSS e persistida no navegador:
    1.  ⚡ *Cyberpunk Neon:* Roxo marcante com brilhos rosa e azul elétrico.
    2.  🪵 *Clássico Vintage:* Tons terrosos e elegantes de madeira e dourado.
    3.  🦄 *Pop Pastel:* Visual suave e divertido em tons de algodão-doce.
    4.  👑 *Gold Studio:* Preto absoluto com frisos luxuosos em ouro.
    5.  🕹️ *Retro Arcade:* A vibe dos fliperamas dos anos 80 em magenta e verde limão.
    6.  ☀️ *Clean Light (Titânio):* Tema claro moderno que substitui o "branco comum" por cinza titânio e alumínio escuro de alto contraste.
* **Super Memória (LocalStorage):** O estado visual do tema escolhido pelo utilizador permanece guardado, garantindo consistência mesmo após atualizar a página.
* **Metrónomo de Alta Precisão:** Ajuste de BPM deslizante (60 a 240 BPM) com clique gerado via código e indicador luminoso (*flash led*) síncrono.
* **Controle de Sustain (Eco):** Modificação do tempo de decaimento (*decay*) do som do sintetizador.
* **Responsividade Isolada de Elite:** Layout adaptável otimizado tanto para ecrãs grandes (laptops e tablets com teclado físico mapeado) quanto para dispositivos móveis (com ajuste ultra-adaptativo em percentagem para as teclas pretas e rolagem lateral suave).

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica dos painéis de controlo e teclado.
* **CSS3 Avançado:** Flexbox, Grid Layout, Media Queries responsivas e Variáveis CSS para a arquitetura de temas.
* **JavaScript (ES6+):** Manipulação assíncrona do DOM, Web Audio API (`AudioContext`), `localStorage`, estruturas de controlo de fluxo limpas com `.includes()` e timers de reprodução.

---

## ⌨️ Mapeamento de Teclas (Teclado Físico)

Podes tocar no simulador utilizando as seguintes teclas do teu computador:
* **Notas Brancas:** `A` `S` `D` `F` `T` `Y` `U` `J` `K` `L` `;`
* **Notas Pretas:** `W` `E` `G` `H` `O` `P`

---



---
Desenvolvido com 💜 por Juciana Soares durante a Trilha de Front-End.
