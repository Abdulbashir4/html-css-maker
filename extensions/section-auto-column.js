export function onBlockCreate(type, el) {
  if (type === 'section') {
    el.appendChild(createColumn(true));
  }
}
