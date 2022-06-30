# Guía - Optimización de modelo de simulación

### Repositorio

Para llevar a cabo el desarrollo del proyecto se ha realizado un fork del repositorio de la librería [GeneticsJS](https://github.com/GeneticsJS/GeneticsJS).

Es en este fork donde se ha implementado toda la funcionalidad necesaria para lanzar las simulaciones haciendo uso del simulador Babsim.Hospital. Además de ello, se han realizado ciertas modificaciones al funcionamiento de la librería y también se han implementado un algoritmo aleatorio y uno genético.

Para llevar a cabo la instalación del repositorio deberemos seguir los siguientes pasos:

```bash
# Clonar el repositorio
git clone https://github.com/GeneticsJS/GeneticsJS

# Movernos al directorio donde se encuentra el proyecto
cd GeneticsJS

# Instalar las dependencias del proyecto
npm install
```

### R

Para poder ejecutar el código fuente desarrollado durante el proyecto, es importante el tener instalado R. Para ello deberemos realizar la instalación en base al sistema operativo en el que estemos trabajando.

- [Guía de instalación de R](https://docs.rstudio.com/resources/install-r/)

Tras haber realizado la instalación de R se debe comprobar que se ha instalado correctamente:

```bash
# Comprobar la versión de R instalada
R --version

# Ejecutar R
R

# Ejecutar Rscript
Rscript
```

## Instalación de dependencias

Tras poder hacer uso de R y de Rscript, podremos pasar a instalar las dependencias que necesitamos tener cargadas en R para poder ejecutar el simulador.

```bash


# Instalamos las dependencias

Rscript -e 'install.packages("devtools", repos = "http://cran.us.r-project.org")'
Rscript -e 'devtools::install_github("https://github.com/RcppCore/Rcpp")'
Rscript -e 'devtools::install_github("r-lib/devtools")'
Rscript -e 'devtools::install_git(url = "http://owos.gm.fh-koeln.de:8055/bartz/spot.git")'
Rscript -e 'install.packages(c("golem", "igraph", "lubridate", "markovchain", "padr", "rvest", "simmer", "slider", "plyr", "stringr", "checkmate"), repos = "http://cran.us.r-project.org")'

# Realizamos la instalación del paquete babsim.hospital a través del comprimido situado en el repositorio
Rscript -e 'install.packages ("babsim/babsim.hospital_11.8.4.tar.gz", repos=NULL, type="source")'
```

Tras haber realizado esto, ya tenemos dentro de nuestras librerías de R, todos los paquetes necesarios para proceder con la ejecución de las simulaciones

### BabSim.Hospital

El software Babsim.Hospital está en constante actualización y el [repositorio](http://owos.gm.fh-koeln.de:8055/bartz/babsim.hospital) del mismo se encuentra situado en gitlab.

Por otro lado, el [paquete](https://cran.r-project.org/web/packages/babsim.hospital/index.html) dispone de documentación dentro de la página oficial de CRAN, en donde se pueden encontrar tanto los comprimidos con el código fuente del paquete, como también manuales donde se explica el funcionamiento del mismo.

## Modo de uso: Script en R

En este punto, ya deberíamos tener instalado todo correctamente, así que podemos proceder con las ejecuciones. El script planteado para realizar ejecuciones del simulador podemos invocarlo de la siguiente manera:

```bash
# Nos situamos dentro del proyecto
cd GeneticsJS

# Lanzamos el script
Rscript babsim/BabsimHospital.R 9 12 5 8 3 5 3 6 34 17 4 3 1.0378014745722273 0.14697676641854834 0.09857584591242897 0.015152198475942381 0.12516932683326826 0.001926416505314644 0.10111719895736802 0.3001806967553087 0.11222952263581498 0.8315922547208356 0.00017694618815243727 2 0.26360070211595554 0.0619840922131247 1 4 0.6179578689218207
```

En este caso, estamos llamando a Rscript, pasándole el script a ejecutar, el cual está situado dentro de la carpeta `babsim`, además de pasarle también los 29 parámetros de entrada que necesita el simulador para realizar una simulación.

## Modo de uso: algoritmos

### Librerías utilizadas

Para realizar ejecuciones del algoritmo de búsqueda aleatoria si que necesitaremos ejecutar código Typescript, para lo cual haremos uso del paquete [`ts-node`](https://www.npmjs.com/package/ts-node), el cual es un motor de ejecución de Typescript y REPL para node.js, el cual transformará todo el código a Javascript y lo ejecutará sobre la marcha.

Además de esto, se ha añadido la librería de node [`yargs`](https://www.npmjs.com/package/yargs) la cual nos permite parsear de manera cómoda todos los argumentos indicados en la línea de comandos.

### Algoritmo de búsqueda aleatoria

Para ejecutar el algoritmo de búsqueda aleatoria debemos tener en cuenta que para este se puede configurar el número de iteraciones que queremos que realize, durante las cuales el algoritmo se encargará de encontrar la mejor solución posible.

Si invocamos la guía de ayuda, obtendremos el siguiente resultado:
![Guía de ayuda](/assets/images/random-search.help.png)

Por lo tanto, usos válidos de dicho algoritmo podrían ser los que siguen:

```bash

# Usará el número de iteraciones establecido por defecto, es decir, 5
npx ts-node src/optimizacion/algorithm/RandomSearch.ts

# Realizará 100 iteraciones
npx ts-node src/optimizacion/algorithm/RandomSearch.ts -i 100

# Realizará 100 iteraciones
npx ts-node src/optimizacion/algorithm/RandomSearch.ts --iterations 100
```

### Algoritmo genético

El algoritmo genético podría llegar a tener demasiados elementos configurables, por lo tanto, se ha decidido minimizar estas configuraciones de manera que se haga uso de unas configuraciones preestablecidas, además de permitir configurar ciertos parámetros concretos.

Si invocamos la guía de ayuda, obtendremos el siguiente resultado:
![Guía de ayuda](/assets/images/genetic-algorithm-help.png)

Por lo tanto, usos válidos de dicho algoritmo podrían ser los que siguen:

```bash
# Usará todos los valores por defecto
npx ts-node src/optimizacion/algorithm/GeneticAlgorithm.ts

# Lanzará el algoritmo generando 10 individuos en cada generación
npx ts-node src/optimizacion/algorithm/GeneticAlgorithm.ts --population 10

# Realizará 10 réplicas para cada individuo, quedandose con el fitness medio
npx ts-node src/optimizacion/algorithm/GeneticAlgorithm.ts --replics 10

# Realizará 100 generaciones de invididuos
npx ts-node src/optimizacion/algorithm/GeneticAlgorithm.ts --generations 100

# Lanzará el algoritmo con los parámetros establecidos en el fichero de configuración indicado
npx ts-node src/optimizacion/algorithm/GeneticAlgorithm.ts --file polynomial.ts

# El resultado de la ejecución lo almacenará en un fichero con el nombre indicado
npx ts-node src/optimizacion/algorithm/GeneticAlgorithm.ts --output outputFileName
```

Aparte de estos ejemplos, se puede hacer un uso simultáneo de los parámetros, de manera que podríamos por ejemplo, utilizar una configuración de las ya establecidas, además de configurar el número de individuos de la población, las réplicas a ejecutar por individuo y el número de generaciones.
