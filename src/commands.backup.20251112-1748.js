import {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  createProduct,
  deleteProductById,
} from './api.js';
import { parseResource, prettyPrint, showUsage, toCSV, saveFile, tsStamp } from './utils.js';

export async function handleGet(resource) {
  const { collection, s2, s3 } = parseResource(resource);
  if (collection !== 'products') return showUsage('Colección no válida.');

  // GET products
  if (!s2) {
    const list = await getProducts();
    prettyPrint(list, '📦 Lista de productos:');
    return;
  }

  // GET products/<id>
  if (s2 && !isNaN(Number(s2)) && !s3) {
    const id = s2;
    const item = await getProductById(id);
    prettyPrint(item, `🧾 Producto #${id}:`);
    return;
  }

  // GET products/category/<name>
  if (s2 === 'category' && s3) {
    if (s3 === 'list') {
      const cats = await getCategories();
      prettyPrint(cats, '🏷️ Categorías disponibles:');
      return;
    }
    const list = await getProductsByCategory(s3);
    prettyPrint(list, `📚 Productos en categoría "${s3}":`);
    return;
  }

  return showUsage('Formato GET no soportado.');
}

export async function handlePost(resource, args) {
  const { collection, s2 } = parseResource(resource);
  if (collection !== 'products' || s2) return showUsage('Formato para POST inválido.');

  const [title, priceStr, category] = args;
  const price = Number(priceStr);
  if (!title || Number.isNaN(price) || !category) {
    return showUsage('Argumentos insuficientes para POST.');
  }

  const created = await createProduct({ title, price, category });
  prettyPrint(created, '✅ Producto creado:');
}

export async function handleDelete(resource) {
  const { collection, s2, s3 } = parseResource(resource);
  if (collection !== 'products' || !s2 || s3) return showUsage('Formato para DELETE inválido.');

  const id = s2;
  const deleted = await deleteProductById(id);
  prettyPrint(deleted, `🗑️ Producto #${id} eliminado (respuesta API):`);
}

export async function handleExport(resource) {
  const { collection, s2 } = parseResource(resource);
  if (collection !== 'products' || s2) return showUsage('Formato para EXPORT inválido. Usá: EXPORT products');

  const data = await getProducts();
  const csv = toCSV(data);
  const filename = `products_${tsStamp()}.csv`;
  const filepath = saveFile({ dir: './output', name: filename, content: csv });
  console.log(`\n✅ CSV exportado: ${filepath}`);
}
