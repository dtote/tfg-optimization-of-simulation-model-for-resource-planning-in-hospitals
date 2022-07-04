.DEFAULT_GOAL := install

babsim: 
	@echo '🧪 Installing babsim.hospital dependencies...''
	@Rscript -e 'install.packages("devtools", repos = "http://cran.us.r-project.org")'
	@Rscript -e 'devtools::install_github("https://github.com/RcppCore/Rcpp")'
	@Rscript -e 'devtools::install_github("r-lib/devtools")'
	@Rscript -e 'devtools::install_git(url = "http://owos.gm.fh-koeln.de:8055/bartz/spot.git")'
	@Rscript -e 'install.packages(c("golem", "igraph", "lubridate", "markovchain", "padr", "rvest", "simmer", "slider", "plyr", "stringr", "checkmate"), repos = "http://cran.us.r-project.org")'
	@Rscript -e 'install.packages ("babsim/babsim.hospital_11.8.4.tar.gz", repos=NULL, type="source")'

dependencies:
	@echo '🚀 Installing dependencies...''
	@git clone https://github.com/dtote/tfg-optimization-of-simulation-model-for-resource-planning-in-hospitals.git optimization
	@cd optimization
	@npm install
	@git submodule init
	@git submodule update
	@cd src/GeneticsJS
	@git checkout master
	@npm install
	@cd ../..

install: dependencies babsim