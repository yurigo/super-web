DESIGN.md — Gaming Hub
1. Concepto general

Diseñar un hub de juegos online con una estética Dark Mode, moderna, divertida y minimalista, inspirado en las interfaces de gaming actuales.

La plataforma será un espacio donde los usuarios puedan descubrir, jugar y compartir juegos directamente desde el navegador.

El primer juego disponible será el 3 en raya (Tic-Tac-Toe), pero el diseño debe ser escalable para incorporar nuevos juegos sin modificar la identidad visual.

Principios de diseño
Dark first: toda la interfaz estará diseñada para modo oscuro.
Playful: colores vibrantes, elementos dinámicos y personalidad.
Clean UI: evitar interfaces recargadas.
Responsive: experiencia optimizada para móvil, tablet y escritorio.
Game focused: los juegos deben ser siempre los protagonistas.
Modular: componentes reutilizables para todos los juegos.
2. Paleta de colores

La identidad visual se construye alrededor de cinco colores principales.

Variable	Color	Uso
Primary Cyan	#00C2CB	Acciones principales, enlaces y elementos activos
Mint	#7FE0D4	Estados positivos, hover y detalles
Yellow	#FFE38A	Destacados, premios y notificaciones
Coral	#FF9A76	Acciones secundarias y elementos especiales
Pink	#FF5D8F	Acentos, jugador O y elementos destacados
CSS Variables
css
:root {
  --color1: #00C2CB;
  --color2: #7FE0D4;
  --color3: #FFE38A;
  --color4: #FF9A76;
  --color5: #FF5D8F;

  /* Backgrounds */
  --bg-primary: #101116;
  --bg-secondary: #181A22;
  --bg-tertiary: #20232D;
  --bg-elevated: #272B36;

  /* Borders */
  --border-default: #343844;
  --border-active: var(--color1);

  /* Text */
  --text-primary: #F5F6FA;
  --text-secondary: #A4A8B5;
  --text-muted: #6F7482;

  /* States */
  --success: var(--color2);
  --warning: var(--color3);
  --danger: var(--color5);

  /* Effects */
  --shadow-soft: 0 8px 30px rgba(0, 0, 0, 0.25);
  --glow-primary: 0 0 20px rgba(0, 194, 203, 0.18);
}

Reglas de utilización
El fondo principal debe ser oscuro, nunca negro absoluto.
El cyan será el color de acción principal.
El mint servirá para transmitir estados positivos.
El amarillo se reservará para elementos que necesiten llamar la atención.
El coral y el pink aportarán personalidad y contraste.
Evitar utilizar los cinco colores simultáneamente en grandes superficies.
Los colores vivos deben utilizarse como acentos, no como fondos predominantes.
3. Tipografía

Utilizar una tipografía moderna, geométrica y legible.

Tipografías recomendadas:

Principal: Inter.
Alternativa: Manrope.
Para títulos de juegos: Space Grotesk.
Jerarquía
Elemento	Tamaño	Peso
Hero title	40-48px	700
Page title	32px	700
Section title	24px	600
Card title	18px	600
Body	15-16px	400
Caption	12-13px	400

Los títulos pueden tener un carácter más expresivo, mientras que los textos funcionales deben priorizar la legibilidad.

4. Layout general
Estructura principal

La aplicación debe disponer de tres zonas:

Header: navegación y perfil.
Main content: juegos, categorías y contenido principal.
Footer: información secundaria, enlaces y copyright.
Header
Altura aproximada: 72px.
Fondo: --bg-primary.
Logo a la izquierda.
Navegación central o menú compacto.
Acciones y perfil a la derecha.
Borde inferior sutil.

Elementos:

Logo del hub.
Inicio.
Juegos.
Favoritos.
Perfil de usuario.
Main content
Ancho máximo recomendado: 1280px.
Padding horizontal: 24px.
Separación vertical generosa.
Grid responsive para las tarjetas de juegos.
Footer
Fondo oscuro.
Texto secundario.
Enlaces a información, privacidad y contacto.
5. Componentes visuales
Game Cards

Las tarjetas serán el elemento principal del catálogo.

Características:

Fondo --bg-secondary.
Border radius: 16px.
Borde sutil.
Imagen o ilustración del juego.
Nombre del juego.
Descripción breve.
Categoría o etiqueta.
Indicador de disponibilidad.
Acción para jugar.

Estados:

Default: fondo secundario.
Hover: elevación ligera y borde cyan.
Active: pequeña reducción de escala.
Disabled: opacidad reducida.
Buttons

Primary

Fondo: #00C2CB.
Texto: #101116.
Border radius: 10px.
Font weight: 600.

Secondary

Fondo: #272B36.
Texto: #F5F6FA.
Borde: #343844.

Accent

Fondo: #FF5D8F.
Texto: #101116.

Estados:

Hover: aumento ligero de brillo.
Active: scale(0.97).
Disabled: opacidad del 40%.
Inputs
Fondo: --bg-tertiary.
Texto: --text-primary.
Borde: --border-default.
Focus: borde cyan.
Border radius: 10px.
Altura recomendada: 44px.
Badges

Utilizar etiquetas pequeñas y redondeadas para categorías, estados y características.

Ejemplos:

NUEVO: amarillo.
POPULAR: pink.
ONLINE: mint.
BETA: coral.
6. Primer juego: 3 en raya

El primer juego debe funcionar como referencia visual y funcional para los siguientes juegos de la plataforma.

Concepto

Un tablero minimalista, moderno y atractivo que permita jugar al 3 en raya contra otra persona o contra la máquina.

Layout de juego

La pantalla de juego debe incluir:

Título del juego.
Información de la partida.
Indicador del turno actual.
Tablero 3x3.
Resultado de la partida.
Botón de reiniciar.
Opciones para cambiar el modo de juego.
Tablero

Características:

Grid de 3 columnas y 3 filas.
Celdas cuadradas.
Fondo --bg-secondary.
Separaciones de 8px.
Border radius: 14px.
Animaciones suaves al colocar una ficha.
Fichas

Jugador X

Color: #00C2CB.
Glow: cyan.
Icono grande y centrado.

Jugador O

Color: #FF5D8F.
Glow: pink.
Icono grande y centrado.

Las fichas deben ser fácilmente distinguibles y tener una animación de entrada.

Estados del tablero
Empty: celda disponible.
Hover: fondo ligeramente iluminado.
X: ficha cyan.
O: ficha pink.
Winning: destacar las tres celdas ganadoras.
Disabled: tablero bloqueado mientras se muestra el resultado.
Indicador de turno

Mostrar una pequeña tarjeta superior:

Turno de X: acento cyan.
Turno de O: acento pink.
Victoria: acento mint.
Empate: acento amarillo.
Resultado

Al finalizar la partida:

Mostrar un mensaje destacado.
Añadir una animación sutil.
Resaltar la combinación ganadora.
Mostrar botón de revancha.

Ejemplos:

¡X ha ganado!
¡O ha ganado!
¡Empate!
Modos de juego
Local: dos jugadores en el mismo dispositivo.
Contra IA: jugar contra el ordenador.
Online: preparado para futuras partidas multijugador.
7. Animaciones y microinteracciones

Las animaciones deben aportar feedback sin distraer.

Acción	Animación
Hover de botón	Brightness + transición
Click	Scale 0.97
Entrada de ficha	Scale + fade
Victoria	Glow suave
Cambio de turno	Fade
Apertura de modal	Fade + scale
Hover de tarjeta	Elevación ligera
Duraciones
css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;
}


Respetar prefers-reduced-motion y evitar animaciones excesivas.

8. Responsive design
Desktop
Header completo.
Catálogo en 3 o 4 columnas.
Tablero centrado.
Espacios generosos.
Tablet
Catálogo en 2 o 3 columnas.
Navegación simplificada.
Tablero centrado y adaptable.
Mobile
Header compacto.
Navegación reducida.
Catálogo en 1 o 2 columnas según anchura.
Tablero ocupando el ancho disponible.
Controles grandes y fáciles de pulsar.
Botones accesibles con una sola mano.

El tablero debe mantener siempre una proporción cuadrada.

9. Accesibilidad
Contraste suficiente entre texto y fondo.
No utilizar únicamente el color para comunicar estados.
Todos los botones deben tener estados focus visibles.
Navegación mediante teclado.
Áreas táctiles recomendadas de al menos 44x44px.
Etiquetas accesibles para los controles.
Compatibilidad con lectores de pantalla.
10. Arquitectura visual escalable

La interfaz debe estar preparada para incorporar más juegos.

Todos los juegos deben compartir:

Header.
Navegación.
Sistema de colores.
Tipografía.
Botones.
Tarjetas.
Modales.
Sistema de notificaciones.
Layout responsive.

Cada juego podrá definir sus propios componentes internos, pero deberá respetar el sistema visual global.

Futuras categorías
Juegos de lógica.
Juegos de estrategia.
Juegos arcade.
Juegos de cartas.
Juegos multijugador.
Juegos casuales.
11. Dirección artística

La personalidad visual del proyecto debe transmitir:

Diversión.
Tecnología.
Comunidad.
Competición amistosa.
Simplicidad.

Referencia estética: una mezcla entre un dashboard gaming moderno, una aplicación social y una plataforma arcade minimalista.

Evitar:

Gradientes excesivos.
Neones en todos los elementos.
Sombras demasiado pronunciadas.
Bordes excesivamente gruesos.
Interfaces visualmente recargadas.
Estética infantil.
12. Objetivo final

Crear un hub de juegos online reconocible, rápido y agradable de utilizar.

El diseño del 3 en raya será la primera implementación del sistema visual y establecerá las reglas que deberán seguir los futuros juegos.

La interfaz debe ser oscura, los colores deben aportar personalidad y el juego debe ser siempre el protagonista.