interface BTreeNode<T> {
    /**
     * Chave do nó.
     */
    chave: number;
    /**
     * Dados do nó.
     */
    dados: T;
    paginaEsquerdo: number;
    paginaDireito: number;
}

interface BTreePage<T> {
    /**
     * Quantidade de elementos ocupados no nó. Max Ordem - 1.
     */
    // elementosOcupados: number;
    elementos: BTreeNode<T>[];
}

export class BTree<T> {
    /**
     * Ordem da árvore, ou seja, quantidade máxima de filhos que um nó pode ter (O).
     * E quantidade maxima de filhos - 1 (O - 1).
     */
    private ordem: number;
    /**
     * Raiz da árvore.Como a árvore é balanceada, a raiz sempre será o nó do meio.
     * Então a cada iteração a raiz pode mudar, ela é um ponteiro para a lista de nós.
     */
    private paginaRaiz: number;
    private paginas: BTreePage<T>[];

    /**
     * 
     * @param ordem De preferência um número ímpar.
     */
    constructor(ordem: number) {
        this.ordem = ordem;
        this.paginaRaiz = -1;
    }

    public add({ key, data }: { key: number, data: T }) {
        console.log(`----- Adicionando ${key} -----`);

        const elemento: BTreeNode<T> = {
            chave: key,
            dados: data,
            paginaEsquerdo: -1,
            paginaDireito: -1
        };

        //Se a árvore está vazia, cria a primeira pagina
        if (Number(this.paginaRaiz) < 0) {
            console.log('Árvore vazia, criando primeira página');
            this.paginaRaiz = 0;
            this.paginas = [{ elementos: [elemento] }];
            return;
        }

        //Se a raiz está cheia, cria uma nova raiz
        if (this.paginas[this.paginaRaiz].elementos.length === this.ordem - 1) {
            console.log('Raiz cheia, criando nova raiz');
            this.paginaRaiz = this.split(this.paginaRaiz);
        }

        this.addInPage(elemento, this.paginaRaiz);
    }

    private addInPage(elemento: BTreeNode<T>, page: number) {
        console.log(`Adicionando ${elemento.chave} na pagina ${page}`);

        const pagina = this.paginas[page];

        //Se a pagina está cheia, divide a pagina
        if (pagina.elementos.length === this.ordem - 1) {
            console.log(`Pagina ${page} cheia, dividindo`);
            this.split(page);
        }

        //Se a pagina está vazia, adiciona o elemento
        if (pagina?.elementos.length === 0) {
            console.log(`Pagina ${page} vazia, adicionando elemento`);
            pagina.elementos.push(elemento);
            return;
        }

        //Busca na pagina
        console.log(`Buscando um espaço na pagina ${page}`);
        for (let i = 0; i < pagina.elementos.length; i++) {
            if (elemento.chave < pagina.elementos[i].chave) {
                //TODO inserir elemento na pagina, na posição i
                const elementosEsquerda = pagina.elementos.slice(0, i);
                const elementosDireita = pagina.elementos.slice(i);
                pagina.elementos = elementosEsquerda.concat([elemento], elementosDireita);
                return;
            }
        }

        if (pagina.elementos.length < this.ordem - 1) {
            console.log(`Pagina ${page} não está cheia e o elemento é o maior, adicionando na ultima posição`);
            pagina.elementos.push(elemento);
            return;
        }

        //Não encontrou na pagina, então adiciona o elemento no ponteiro do ultimo elemento da pagina
        this.addInPage(elemento, pagina.elementos[pagina.elementos.length - 1].paginaDireito);
    }

    private split(page: number): number {
        const pagina = this.paginas[page];

        //Cria uma nova pagina
        const novaPagina: BTreePage<T> = { elementos: [] };
        const meio = Math.floor((this.ordem - 1) / 2);

        //Adiciona o elemento do meio na nova pagina
        novaPagina.elementos.push(pagina.elementos[meio]);

        //Adiciona os elementos da direita na nova pagina
        for (let i = meio + 1; i < pagina.elementos.length; i++) {
            novaPagina.elementos.push(pagina.elementos[i]);
        }

        //Remove os elementos da direita da pagina atual
        pagina.elementos.splice(meio, pagina.elementos.length - meio);

        //Se a pagina atual é a raiz, cria uma nova raiz
        if (page === this.paginaRaiz) {
            this.paginaRaiz = this.paginas.length;
            this.paginas.push(novaPagina);
            return this.paginaRaiz;
        }

        //Se não é a raiz, adiciona a nova pagina na pagina pai
        const pai = this.paginas[page - 1];
        pai.elementos.push(novaPagina.elementos[0]);

        //Ordena os elementos da pagina pai
        pai.elementos.sort((a, b) => a.chave - b.chave);

        //Atualiza os ponteiros da pagina pai
        for (let i = 0; i < pai.elementos.length; i++) {
            if (pai.elementos[i].chave === novaPagina.elementos[0].chave) {
                pai.elementos[i].paginaEsquerdo = page;
                pai.elementos[i].paginaDireito = page + 1;
                break;
            }
        }

        //Adiciona a nova pagina
        this.paginas.push(novaPagina);

        return page + 1;
    }

    public remove(key: number) {

    }

    public find(key: number) {
        if (!this.paginaRaiz) { return undefined; }
        if (this.paginas[this.paginaRaiz].elementos.length === 0) { return undefined; }

        return this.findInPage(key, this.paginaRaiz);
    }

    //Percorre todos os elementos da pagina e seus filhos recursivamente
    private findInPage(key: number, page: number): T | undefined {
        const pagina = this.paginas[page];

        //Elemento nao encontrado
        if (pagina.elementos.length === 0) { return undefined; }

        //Busca na pagina
        for (let i = 0; i < pagina.elementos.length; i++) {
            if (key === pagina.elementos[i].chave) {
                return pagina.elementos[i].dados;
            }
            if (key < pagina.elementos[i].chave) {
                return this.findInPage(key, pagina.elementos[i].paginaEsquerdo);
            }
        }
        //Não encontrou na pagina, então busca o ponteiro do ultimo elemento da pagina
        return this.findInPage(key, pagina.elementos[pagina.elementos.length - 1].paginaDireito);
    }
}