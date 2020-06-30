#!/bin/bash -l

#SBATCH --job-name=test
#SBATCH --output=output.txt

#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8

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
