chcp 65001 > $null
$ErrorActionPreference = "Stop"

# Flag para suprimir emojis si tu consola se queja
$noEmoji = "--no-emoji"

# Título con acento en UTF-8, sin comillas anidadas
$title = 'Remera DS Análisis'

# Lecturas
node index.js GET products $noEmoji
node index.js GET products/5 $noEmoji
node index.js GET products/category/list $noEmoji
node index.js GET products/category/electronics $noEmoji

# Alta de demo (pasa el título como argumento simple)
node index.js POST products $title 299 ropa $noEmoji

# Baja de demo #7 (para limpiar)
node index.js DELETE products/7 $noEmoji
