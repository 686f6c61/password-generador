# Generador de Contraseñas Seguras

Este proyecto es un generador de contraseñas seguras implementado en HTML, CSS y JavaScript. Permite a los usuarios crear contraseñas complejas y personalizadas con varias opciones de configuración.

![Generador de Contraseñas Seguras](/Generador-de-Contraseñas-Seguras.png)


## Características

- Generación de contraseñas basadas en movimientos del ratón para mayor aleatoriedad.
- Opciones personalizables:
  - Longitud de la contraseña (14-100 caracteres)
  - Inclusión de minúsculas, mayúsculas, números, símbolos, brackets y caracteres high ANSI
  - Opción para generar contraseñas basadas en palabras aleatorias
- Interfaz de usuario intuitiva con switches para seleccionar opciones
- Botones para generar y copiar contraseñas
- Notificación visual al copiar la contraseña
- Diseño responsivo utilizando Materialize CSS

## Estructura del Proyecto

El proyecto consta de los siguientes archivos:

1. `index.html`: Estructura principal de la página web.
2. `style.css`: Estilos personalizados para la interfaz de usuario.
3. `script.js`: Lógica principal del generador de contraseñas.
4. `palabras.js`: Función para obtener palabras aleatorias de una API.

### index.html

Contiene la estructura HTML de la página, incluyendo:
- Opciones de generación de contraseñas (switches y inputs)
- Área para generar contraseñas con movimientos del ratón
- Botones para copiar y generar contraseñas
- Enlaces a recursos externos

### style.css

Define los estilos personalizados para:
- Layout responsivo
- Estilos de los switches y botones
- Animaciones y efectos visuales
- Ajustes de tamaño y color para diferentes elementos

### script.js

Implementa la lógica principal del generador:

- `generatePassword()`: Función principal para generar contraseñas.
- `ensureSelectedOptionsIncluded()`: Asegura que la contraseña incluya todos los tipos de caracteres seleccionados.
- `generateProportionalChars()`: Genera caracteres de forma proporcional según las opciones seleccionadas.
- `throttledGeneratePassword()`: Limita la frecuencia de generación de contraseñas.
- Eventos para interacción del usuario (movimiento del ratón, clics en botones).
- Funciones para toggle de opciones y mostrar notificaciones.

### palabras.js

Contiene la función `obtenerPalabras()` que realiza una petición a una API externa para obtener palabras aleatorias cuando se selecciona la opción de generar contraseñas basadas en palabras.

## Cómo Usar

1. Abre `index.html` en un navegador web moderno.
2. Selecciona las opciones deseadas usando los switches.
3. Ajusta la longitud de la contraseña si es necesario.
4. Mueve el ratón dentro del área designada para generar una contraseña aleatoria, o usa el botón "GENERAR CONTRASEÑA".
5. Haz clic en "COPIAR CONTRASEÑA" para copiar la contraseña generada al portapapeles.

## Dependencias

- [Materialize CSS](https://materializecss.com/): Framework CSS para el diseño responsivo.
- [Material Icons](https://fonts.google.com/icons): Iconos utilizados en la interfaz.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de crear un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

