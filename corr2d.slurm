#!/bin/bash -l

#SBATCH --job-name=corr2d
#SBATCH --output=corr2d.slurm.out

#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8

#SBATCH --mail-type=ALL
#SBATCH --mail-user=

enable_lmod
module load rstudio

cat << EOF
this job is called $SLURM_JOB_NAME and its ID is $SLURM_JOB_ID
job $SLURM_JOB_ID has being allocated $SLURM_NTASKS cores across $SLURM_NNODES hosts
job $SLURM_JOB_ID will be running on the following machines:

EOF

echo $SLURM_NODELIST

cat << EOF

the working directory for job $SLURM_JOB_NAME is $SLURM_SUBMIT_DIR
what is inside?

EOF

ls -l "$SLURM_SUBMIT_DIR"

Rscript simple_2dcorr.r Replicate1_PhotoVanillin_1DNMR.csv Replicate2_PhotoVanillin_1DNMR.csv
