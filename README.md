# Animale E-commerce

E-commerce desenvolvido como desafio front-end do Grupo Soma, focado na marca Animale. O projeto foi forkado do repositório original.

## 🚀 Tecnologias

- **Next.js** - Framework React escolhido pela minha familiaridade com o mesmo
- **TypeScript** - Adiciona tipagem ao JavaScript
- **Tailwind CSS** - Framework CSS de estilização
- **Framer Motion** - Biblioteca para animações de alguns componentes
- **Context API** - Gerenciamento de estado global pro carrinho

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas da aplicação
│   ├── novidades/         # Página principal de produtos (e redirect da Home, por questões de tempo)
│   └── produto/[id]/      # Página individual do produto
├── components/            # Componentes da aplicação
├── contexts/             # Contexto do carrinho
├── hooks/                # Hooks de fechamento de popovers
├── services/            # Serviços (lógica de filtragem e cacheamento de produtos)
├── types/               # Definições de tipos
└── utils/               # Funções utilitárias
```

## 🧩 Componentes Principais

### Header
- Navegação principal
- Menu dropdown para categorias
- Carrinho de compras integrado
- Responsivo com versão mobile

### ProductList
- Lista de produtos com infinite scroll (no lugar de botão para carregar mais itens)
- Filtros por tamanho e categoria
- Ordenação por preço e desconto
- Grid responsivo (4x4 em telas grandes, 2x2 em telas pequenas)

### ProductImageCarousel
- Carrossel de imagens com gestos
- Navegação por setas
- Otimizado para performance com lazy loading

### Filters
- Filtros combinados de tamanho e categoria
- Interface intuitiva (modificado em relação ao protótipo)
- Feedback visual das seleções

### Cart
- Gerenciamento de itens
- Atualização de quantidades
- Cálculo automático de total
- Persistência local

## 🎯 Decisões Técnicas

### Arquitetura
- **App Router**: Utilização do sistema de rotas do Next 14
- **Layout Compartilhado**: Header e estrutura base compartilhada entre páginas

### Performance
- **Lazy Loading**: Carregamento sob demanda de imagens e componentes
- **Infinite Scroll**: Paginação infinita para melhor UX
- **Caching**: Cache de produtos para otimizar requisições

### UX/UI
- **Animações Suaves**: Transições fluidas entre estados
- **Feedback Visual**: Indicadores claros de ações
- **Design Responsivo**: Adaptação para diferentes dispositivos

### Estado
- **Context API**: Gerenciamento global do carrinho
- **Local Storage**: Persistência de dados do carrinho
- **TypeScript**: Tipagem forte para prevenção de erros

## 🔄 Fluxo de Dados

1. **Produtos**
   - Carregamento inicial na página
   - Filtros aplicados no cliente
   - Cache para otimização

2. **Carrinho**
   - Estado global via Context
   - Persistência no localStorage
   - Atualizações em tempo real

3. **Filtros**
   - Estado local por componente
   - Combinação de múltiplos filtros
   - Atualização instantânea da lista

## 📱 Responsividade

- **Mobile First**: Design pensado primeiro para dispositivos móveis
- **Breakpoints**: Adaptação fluida para diferentes tamanhos de tela
- **Touch**: Suporte a interações touch em carrosséis e filtros

## 🛠 Setup e Desenvolvimento

### Rodando localmente

```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

### Rodando com Docker

```bash
# Construir a imagem
docker build -t animale-ecommerce .

# Rodar o container
docker run -p 3000:3000 animale-ecommerce
```

Ou usando docker-compose:

```bash
# Subir a aplicação
docker-compose up

# Parar a aplicação
docker-compose down
```

A aplicação estará disponível em `http://localhost:3000`

### Requisitos

- Node.js 18+ (desenvolvimento local)
- Docker 20+ (opcional)
- Docker Compose v2+ (opcional)

## 📝 Notas

Algumas modificações que fiz no desafio considerando o prazo de entrega e os requisitos:

- Modificação do Banner principal para que ele possa receber props e ser facilmente modificável;
- Redirecionamento da rota /HOME para /NOVIDADES. Preferi focar o desafio na página de produtos do que em uma Home funcional, dado o prazo;
- Substituição do botão de "Carregar mais" sugerido no desafio pelo infinite scrolling, garantindo melhor experiência do usuário;
- Lazy loading com prioridade para imagem ativa, carregando as demais em segundo plano e cacheando na aplicação;
- Filtragem e remoção dos produtos com valor 0 presentes no JSON;
- Função que exibe o maior número de parcelas disponível para cada produto, com base nos dados do JSON;
- Função que filtra e oculta a exibição da última imagem do array de cada produto, que mostra um close-up no material e não agrega ao carrossel;
- Opções de ordenação e filtragem com base em categorias, sendo possível combinar diferentes filtros;
- Fallback para quando não houver produtos a exibir;
- Separação de serviços e funções utilitárias em services/products.ts e utils/product.ts;
- Dockerização da aplicação para rodar o projeto em ambiente controlado e com maior praticidade.

