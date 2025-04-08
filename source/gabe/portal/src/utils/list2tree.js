export function list2tree(list, { parentCode, code }) {
  list.forEach((child) => {
    const p = child[parentCode];
    if (p) {
      list.forEach((parent) => {
        if (parent[code] === p) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      });
    }
  });
  return list.filter((n) => !n[parentCode]);
}
