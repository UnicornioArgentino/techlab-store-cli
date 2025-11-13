// Punto de entrada del CLI
import { handleGet, handlePost, handleDelete, handleExport } from './src/commands.js';
import { showUsage } from './src/utils.js';

const [, , methodRaw, resourceRaw, ...rest] = process.argv;
const method = (methodRaw || '').toUpperCase();
const resource = resourceRaw || '';

async function main() {
  try {
    switch (method) {
      case 'GET':
        await handleGet(resource, rest);
        break;
      case 'POST':
        await handlePost(resource, rest);
        break;
      case 'DELETE':
        await handleDelete(resource);
        break;
      case 'EXPORT':
        await handleExport(resource, rest);
        break;
      default:
        showUsage('Comando no reconocido.');
    }
  } catch (err) {
    console.error('âŒ Error inesperado:', err?.message || err);
    process.exit(1);
  }
}

main();


  
// --- Fallback universal para POST (asegura handlePOST) ---
try {
  const [, , _method, ..._args] = process.argv;
  if (String(_method || '').toUpperCase() === 'POST' && typeof handlePOST === 'function') {
    await handlePOST(_args);
    // Cortamos el flujo viejo para evitar doble ejecución / logs inconsistentes
    process.exit(0);
  }
} catch (e) {
  // no-op
}
