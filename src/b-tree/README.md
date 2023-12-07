# Arvore B

A arvore B é uma estrutura de dados que permite a busca, inserção e remoção de dados de forma eficiente. Ela é uma estrutura de dados balanceada, ou seja, a altura da árvore é sempre a mesma, o que garante que a complexidade de busca, inserção e remoção seja `O(log n)`.

## Regras
- Cada nó/Página deve ter pelo menos 50% de sua capacidade preenchida
- O número de filhos (exceto folhas) deve ser igual ao número de chaves + 1
- Todos os nós folhas devem estar na mesma profundidade (o crescimento é para cima)
- O numero da ordem deve ser impar (para facilitar a divisão)