import { BTree } from "./btree";

console.log('Hello from b-tree');
let btree = new BTree<string>(3);
btree.add({ key: 1, data: '1' });
btree.add({ key: 2, data: '2' });
btree.add({ key: 3, data: '3' });
btree.add({ key: 4, data: '4' });

console.log(JSON.stringify(btree, null, 2));