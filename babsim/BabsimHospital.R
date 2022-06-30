library("babsim.hospital")
library("digest")

args <- commandArgs(trailingOnly = TRUE)

if (length(args) == 0) {
    err_msg <- "The 29 simulator parameters are needed as arguments.\nExample: pathToScript/FunctionOptimizationSimulation.R  13 9 4 7 4 7 4 6 31 20 4 3 1.025122034383019 0.09948852474437592 0.10792190546870738 0.011173293404359304 0.0817632221946115 0.001797158613580871 0.09993614034820439 0.26068035962145947 0.08496138324965977 0.5390764291554987 0.007022805782825558 3 0.5251115371385421 0.03026528551276313 1 4 0.7184313987846556\n\n"
    stop(err_msg)
}

parameters <- as.numeric(args[1:29])

# seed with random generated value
seed = floor(runif(1, min= 1, max = .Machine$integer.max))

# if a seed is provided for the genetic, we modify the seed value with the received seed
if (args[30:30] == "--genetic-seed" && !is.na(as.numeric(args[31:31]))) {
  # seed =  (as.numeric(args[31:31]) + 1) / 2 # not stochastic
  seed = seed * (as.numeric(args[31:31]) + 1) / 2 # stochastic
}

# if a seed is provided for the random search, we re-assign the seed value
if (args[30:30] == "--random-seed" && !is.na(as.numeric(args[31:31]))) {
  seed = as.numeric(args[31:31])
}

# write(seed, file = "my_seeds.txt", sep = '\n', append = TRUE)

region = 5315 #5374 Germany, 5315 is Cologne, 5 is NRW
simrepeats = 1
parallel = FALSE
percCores = 0.8
resourceNames =  c('intensiveBed', 'intensiveBedVentilation')
resourceEval = c('intensiveBed', 'intensiveBedVentilation') 
FieldStartDate = '2020-09-01'
icudata <- getRegionIcu(data = icudata, region = region)
fieldData <- getIcuBeds(icudata)
fieldData <- fieldData[which(fieldData$Day >= as.Date(FieldStartDate)), ]
rownames(fieldData) <- NULL
icu = TRUE
icuWeights = c(1,1)
SimStartDate = '2020-08-01'
rkidata <- getRegionRki(data = rkidata, region = region)
simData <- getRkiData(rkidata)
simData <- simData[which(simData$Day >= as.Date(SimStartDate)), ]
simData <- simData[as.Date(simData$Day) <= max(as.Date(fieldData$Day)),]
## time must start at 1
simData$time <- simData$time - min(simData$time)
rownames(simData) <- NULL
data <- list(simData = simData, fieldData = fieldData)
conf <- babsimToolsConf()
conf <- getConfFromData(conf = conf,
                        simData = data$simData,
                        fieldData = data$fieldData)
conf$parallel = parallel
conf$simRepeats = simrepeats
conf$ICU = icu
conf$ResourceNames = resourceNames
conf$ResourceEval = resourceEval
conf$percCores = percCores
conf$logLevel = 0
conf$w2 = icuWeights
conf$seed = seed
set.seed(conf$seed)
# para <- babsimHospitalPara()
para <-  list(
    AmntDaysInfectedToHospital = parameters[1], # x1
    AmntDaysNormalToHealthy = parameters[2], #x2
    AmntDaysNormalToIntensive = parameters[3], # x3
    AmntDaysNormalToVentilation = parameters[4], # x4
    AmntDaysNormalToDeath = parameters[5], # x5
    AmntDaysIntensiveToAftercare = parameters[6], # x6
    AmntDaysIntensiveToVentilation = parameters[7], # x7
    AmntDaysIntensiveToDeath = parameters[8], # x8
    AmntDaysVentilationToIntensiveAfter = parameters[9], #  x9
    AmntDaysVentilationToDeath = parameters[10], # x10
    AmntDaysIntensiveAfterToAftercare = parameters[11], # x11
    AmntDaysIntensiveAfterToDeath = parameters[12], # x12
    GammaShapeParameter = parameters[13], # x13
    FactorPatientsInfectedToHospital = parameters[14], # x14
    FactorPatientsHospitalToIntensive = parameters[15], # x15
    FactorPatientsHospitalToVentilation = parameters[16], #x16
    FactorPatientsNormalToIntensive = parameters[17], #x17
    FactorPatientsNormalToVentilation = parameters[18], #x18
    FactorPatientsNormalToDeath = parameters[19], # x19
    FactorPatientsIntensiveToVentilation = parameters[20], # x20
    FactorPatientsIntensiveToDeath = parameters[21], # x21
    FactorPatientsVentilationToIntensiveAfter = parameters[22], # x22
    FactorPatientsIntensiveAfterToDeath = parameters[23], # x23
    AmntDaysAftercareToHealthy = parameters[24], # x24
    RiskFactorA = parameters[25], # x25
    RiskFactorB = parameters[26], # x26
    RiskMale = parameters[27], # x27
    AmntDaysIntensiveAfterToHealthy = parameters[28], # x28
    FactorPatientsIntensiveAfterToHealthy = parameters[29] # x29
  )
rkiWithRisk <- getRkiRisk(data$simData, para)
output <- babsimHospital(conf = conf, para= para, arrivalTimes = rkiWithRisk)

# Calculating RMSE
fieldEvents <- getRealBeds(data = data$fieldData, resource = conf$ResourceNames)
res <- getDailyMaxResults(envs = output, fieldEvents = fieldEvents, conf = conf)
resDefault <- getError(res, conf = conf)

print(output[[1]]$now_val)