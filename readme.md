# Generador de Contraseñas Seguras

Este proyecto es un generador de contraseñas seguras implementado en HTML, CSS y JavaScript. Permite a los usuarios crear contraseñas complejas y personalizadas con varias opciones de configuración.

## Características

- **Generación de contraseñas basadas en movimientos del ratón** para mayor aleatoriedad.
- **Opciones personalizables:**
  - Longitud de la contraseña (14-100 caracteres)
  - Inclusión de minúsculas, mayúsculas, números, símbolos, brackets y caracteres high ANSI
  - Opción para generar contraseñas basadas en palabras aleatorias
  - **Soporte para múltiples idiomas** (Inglés, Español, Francés, Alemán, Italiano)
- **Evaluación de la seguridad de la contraseña:**
  - **Cálculo de entropía** para medir la complejidad de la contraseña.
  - **Evaluación de fortaleza** basada en la entropía.
  - **Estimación del tiempo de crackeo** utilizando un clúster de GPU.
- **Interfaz de usuario intuitiva** con switches para seleccionar opciones.
- **Botones para generar y copiar contraseñas.**
- **Notificación visual** al copiar la contraseña.
- **Diseño responsivo** utilizando Materialize CSS.

## Estructura del Proyecto

El proyecto consta de los siguientes archivos:

- **`index.html`**: Estructura principal de la página web en español.
- **`index_eng.html`**: Versión en inglés de la página principal.
- **`style.css`**: Estilos personalizados para la interfaz de usuario.
- **`script.js`**: Lógica principal del generador de contraseñas.
- **`palabras.js`**: Función para obtener palabras aleatorias de una API.
- **`entropia.js`**: Funciones para calcular la entropía, fortaleza y tiempo de crackeo de la contraseña.
- **`images/favicon.ico`**: Icono de la web.

### `index.html` y `index_eng.html`

Contienen la estructura HTML de la página en sus respectivos idiomas, incluyendo:

- Opciones de generación de contraseñas (switches y inputs)
- Área para generar contraseñas con movimientos del ratón
- Botones para copiar y generar contraseñas
- Enlaces a recursos externos
- Selector de idioma para cambiar entre diferentes idiomas

### `style.css`

Define los estilos personalizados para:

- Layout responsivo
- Estilos de los switches y botones
- Animaciones y efectos visuales
- Ajustes de tamaño y color para diferentes elementos

### `script.js`

Implementa la lógica principal del generador:

- `generatePassword()`: Función principal para generar contraseñas.
- `ensureSelectedOptionsIncluded()`: Asegura que la contraseña incluya todos los tipos de caracteres seleccionados.
- `generateProportionalChars()`: Genera caracteres de forma proporcional según las opciones seleccionadas.
- `throttledGeneratePassword()`: Limita la frecuencia de generación de contraseñas.
- Eventos para interacción del usuario (movimiento del ratón, clics en botones).
- Funciones para toggle de opciones y mostrar notificaciones.

### `palabras.js`

Contiene la función `obtenerPalabras()` que realiza una petición a una API externa para obtener palabras aleatorias cuando se selecciona la opción de generar contraseñas basadas en palabras.

### `entropia.js`

Contiene las funciones para calcular la entropía, la fortaleza de la contraseña y el tiempo estimado de crackeo utilizando un clúster de GPU:

- `calcularEntropia()`: Calcula la entropía de la contraseña basada en la variedad y cantidad de caracteres.
- `evaluarFortaleza()`: Evalúa la fortaleza de la contraseña según su entropía.
- `calcularTiempoCrackeo()`: Estima el tiempo necesario para crackear la contraseña utilizando un clúster de GPU.

## Cómo Usar

1. **Clona o descarga el repositorio:**
   - Descarga las dos versiones (`index.html` e `index_eng.html`) si deseas utilizar el proyecto en ambos idiomas.
2. **Abre `index.html` en un navegador web moderno.**
3. **Selecciona el idioma** deseado usando el selector de idiomas en la parte superior de la página.
4. **Selecciona las opciones deseadas** usando los switches:
   - Activa o desactiva la inclusión de minúsculas, mayúsculas, números, símbolos, brackets y caracteres high ANSI.
   - Elige generar contraseñas basadas en palabras aleatorias si lo prefieres.
5. **Ajusta la longitud de la contraseña** si es necesario utilizando el control deslizante o ingresando un valor numérico.
6. **Mueve el ratón dentro del área designada** para generar una contraseña aleatoria basada en movimientos del ratón, o usa el botón "GENERAR CONTRASEÑA".
7. **Revisa la información adicional**:
   - **Entropía:** Mide la complejidad de la contraseña.
   - **Fortaleza:** Indica la seguridad general de la contraseña.
   - **Tiempo de Crackeo:** Estima cuánto tiempo tomaría crackear la contraseña usando un clúster de GPU.
8. **Haz clic en "COPIAR CONTRASEÑA"** para copiar la contraseña generada al portapapeles.

## Cálculo de Entropía de Contraseñas

La **entropía** es una medida de la imprevisibilidad o complejidad de una contraseña, expresada en bits. Cuanto mayor sea la entropía, más difícil será para un atacante adivinar o crackear la contraseña.

### Fórmula de Cálculo

La entropía de una contraseña se calcula utilizando la siguiente fórmula:

\[ \text{Entropía} = \text{Longitud de la Contraseña} \times \log_2(\text{Tamaño del Conjunto de Caracteres}) \]

- **Longitud de la Contraseña:** Número de caracteres en la contraseña.
- **Tamaño del Conjunto de Caracteres:** Número total de caracteres posibles que se pueden usar en cada posición de la contraseña.

### Ejemplo

Si una contraseña tiene 14 caracteres y utiliza un conjunto de 94 caracteres posibles (incluyendo mayúsculas, minúsculas, números y símbolos), la entropía se calcularía de la siguiente manera:

\[ \text{Entropía} = 14 \times \log_2(94) \approx 14 \times 6.5546 \approx 91.76 \text{ bits} \]

### Interpretación de la Entropía

- **0-28 bits:** Muy débil
- **28-35 bits:** Débil
- **36-59 bits:** Aceptable
- **60-127 bits:** Fuerte
- **≥128 bits:** Muy fuerte

## Dependencias

- **Materialize CSS:** Framework CSS para el diseño responsivo.
- **Material Icons:** Iconos utilizados en la interfaz.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de crear un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## Capturas de Pantalla

![Generador de Contraseñas Seguras](/Generador-de-Contraseñas-Seguras.png)
---

## Notas Adicionales

- **Consistencia en las Extensiones de Archivos:** Se recomienda mantener la misma extensión para todos los archivos HTML (por ejemplo, `.html` en lugar de mezclar `.html` y `.htm`) para evitar confusiones.
- **Soporte para Más Idiomas:** Actualmente soporta Inglés y Español. Se pueden añadir más idiomas siguiendo la misma estructura.

