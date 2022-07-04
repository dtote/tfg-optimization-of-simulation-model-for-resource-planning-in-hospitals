# Guía - Optimización de modelo de simulación

## Repositorio

Para llevar a cabo el desarrollo del proyecto se ha realizado un [fork](https://github.com/dtote/GeneticsJS) del repositorio de la librería [GeneticsJS](https://github.com/GeneticsJS/GeneticsJS).

Es en este fork donde se han implementado ciertas características necesarias para poder desarrollar el trabajo de final de grado que aquí se aborda, de manera que se usan de apoyo todas las clases que esta librería proporciona y a las cuales se le han añadido nuevos individuos, mutaciones y características concretas.

Por otro lado, en el repositorio donde nos encontramos se ha realizado la implentación de un algoritmo de búsqueda aleatoria y un algoritmo genético, los cuales tienen como objetivo el lanzar simulaciones del simulador Babsim.Hospital tratando de encontrar configuraciones de los parámetros de entrada al simulador que sean lo más cercanas posible a la óptima.

### BabSim.Hospital

El software Babsim.Hospital está en constante actualización y el [repositorio](http://owos.gm.fh-koeln.de:8055/bartz/babsim.hospital) del mismo se encuentra situado en gitlab.

Por otro lado, el [paquete](https://cran.r-project.org/web/packages/babsim.hospital/index.html) dispone de documentación dentro de la página oficial de CRAN, en donde se pueden encontrar tanto los comprimidos con el código fuente del paquete, como también manuales donde se explica el funcionamiento del mismo.

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

En caso de no tener instalado **R** y **Rscript** no se recomienda seguir con el proceso de instalación puesto que no se realizará con éxito.

## **Instalación automatizada de dependencias**

Si realiza este paso puede obviar el resto de instalaciones manuales.

Con este makefile se nos instalarán todas las dependencias del proyecto, del submódulo de git y de R.

```bash
# Clonamos el repositorio
git clone https://github.com/dtote/tfg-optimization-of-simulation-model-for-resource-planning-in-hospitals.git optimization

# Nos movemos al directorio donde se encuentra el proyecto
cd optimization

# Ejecutamos el makefile
make install
```

## **Instalación manual de dependencias**

```bash
# Clonamos el repositorio
git clone https://github.com/dtote/tfg-optimization-of-simulation-model-for-resource-planning-in-hospitals.git optimization

# Nos movemos al directorio donde se encuentra el proyecto
cd optimization

# Instalar las dependencias del proyecto
npm install

# Inicialización y actualización del submódulo de git correspondiente al fork de GeneticsJS
git submodule init
git submodule update

# Instalación de dependencias del submódulo de git correspondiente al fork de GeneticsJS

## Nos movemos al submódulo
cd src/GeneticsJS

## Dentro del submódulo nos movemos a la rama master
git checkout master

## Instalamos las dependencias del submódulo
npm install

## Volvemos a la raiz del proyecto
cd ../..
```

## **Instalación manual de dependencias de R**

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

Tras haber realizado toda la instalación de manera correcta, ya tenemos dentro de nuestras librerías de R, todos los paquetes necesarios para proceder con la ejecución de las simulaciones

## Modo de uso: Script en R

El script planteado para realizar ejecuciones del simulador podemos invocarlo de la siguiente manera:

```bash
# Nos situamos en la raíz del proyecto y ejecutamos el script
Rscript babsim/BabsimHospital.R 9 12 5 8 3 5 3 6 34 17 4 3 1.0378014745722273 0.14697676641854834 0.09857584591242897 0.015152198475942381 0.12516932683326826 0.001926416505314644 0.10111719895736802 0.3001806967553087 0.11222952263581498 0.8315922547208356 0.00017694618815243727 2 0.26360070211595554 0.0619840922131247 1 4 0.6179578689218207
```

En este caso, estamos llamando a Rscript, pasándole el script a ejecutar, el cual está situado dentro de la carpeta `babsim`, además de pasarle también los 29 parámetros de entrada que necesita el simulador para realizar una simulación.

## Modo de uso: algoritmos

### Librerías utilizadas

Para realizar ejecuciones del algoritmo de búsqueda aleatoria si que necesitaremos ejecutar código Typescript, para lo cual haremos uso del paquete [`ts-node`](https://www.npmjs.com/package/ts-node), el cual es un motor de ejecución de Typescript y REPL para node.js, el cual transformará todo el código a Javascript y lo ejecutará sobre la marcha.

Además de esto, se ha añadido la librería de node [`yargs`](https://www.npmjs.com/package/yargs) la cual nos permite parsear de manera cómoda todos los argumentos indicados en la línea de comandos.

### Algoritmo de búsqueda aleatoria

Para ejecutar el algoritmo de búsqueda aleatoria debemos tener en cuenta que se puede configurar la cantidad de veces que queremos que se lanze y el número de iteraciones que queremos que realize, durante las cuales el algoritmo se encargará de encontrar la mejor solución posible.

Si invocamos la guía de ayuda, obtendremos el siguiente resultado:
![Guía de ayuda](/assets/random_search_help.png)

Por lo tanto, usos válidos de dicho algoritmo podrían ser los que siguen:

```bash
# Usará el número de iteraciones establecido por defecto, es decir, 5
npx ts-node src/algorithms/RandomSearch.ts

# Ejecutará 1 vez la búsqueda aleatoria con 100 iteraciones
npx ts-node src/algorithms/RandomSearch.ts -i 100

# Ejecutará 10 veces la búsqueda aleatoria con 100 iteraciones
npx ts-node src/algorithms/RandomSearch.ts -i 100 -t 10

# Ejecutará la búsqueda con valores por defecto y guardará el resultado en resultado.json
npx ts-node src/algorithms/RandomSearch.ts -o resultado
```

### Algoritmo genético

El algoritmo genético podría llegar a tener demasiados elementos configurables, por lo tanto, se ha decidido minimizar estas configuraciones de manera que se haga uso de unas configuraciones preestablecidas, además de permitir configurar ciertos parámetros concretos.

Si invocamos la guía de ayuda, obtendremos el siguiente resultado:
![Guía de ayuda](/assets/genetic_algorithm_help.png)

Por lo tanto, usos válidos de dicho algoritmo podrían ser los que siguen:

```bash
# Usará todos los valores por defecto
npx ts-node src/algorithms/GeneticAlgorithm.ts

# Lanzará el algoritmo generando 10 individuos en cada generación
npx ts-node src/algorithms/GeneticAlgorithm.ts --population 10

# Realizará 10 réplicas para cada individuo, quedandose con el fitness medio
npx ts-node src/algorithms/GeneticAlgorithm.ts --replics 10

# Realizará 100 generaciones de invididuos
npx ts-node src/algorithms/GeneticAlgorithm.ts --generations 100

# Lanzará el algoritmo con los parámetros establecidos en el fichero de configuración indicado
npx ts-node src/algorithms/GeneticAlgorithm.ts --file polynomial.ts

# El resultado de la ejecución lo almacenará en un fichero con el nombre indicado
npx ts-node src/algorithms/GeneticAlgorithm.ts --output outputFileName
```

Aparte de estos ejemplos, se puede hacer un uso simultáneo de los parámetros, de manera que podríamos por ejemplo, utilizar una configuración de las ya establecidas, además de configurar el número de individuos de la población, las réplicas a ejecutar por individuo y el número de generaciones.
