#!/bin/bash -l

#SBATCH --job-name=corr2d
#SBATCH --output=corr2d.slurm.out

#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8

#SBATCH --mail-type=ALL

enable_lmod
module load rstudio

Rscript simple_2dcorr.r $@
