#!/usr/bin/env python3

import os
import sys
import numpy as np
import pandas as pd
from scipy.optimize import curve_fit
import seaborn as sns
import matplotlib.pyplot as plt

"""
Run like python fit.py <path to csv>
Update X_COL_LABEL/Y_COL_LABEL to match columns if needed
"""


def model_func(t, c1, c2, k1, k2):
    return c1 * np.exp(-k1*t) + c2 * np.exp(-k2 * t)


if __name__ == "__main__":
    datafile = sys.argv[1]

    if not os.path.exists(datafile):
        print(f"File `{datafile}' not found")
        os.exit(69)


    X_COL_LABEL = 'Hours'
    Y_COL_LABEL = 'TOC, norm'

    df = pd.read_csv(datafile)

    x = df[X_COL_LABEL]

    w = []
    for _ in range(0,2):
        w = curve_fit(model_func, x, df[Y_COL_LABEL])[0]

    print(f"c1: {w[0]}\nc2:{w[1]}\nk1: {w[2]}\nk2: {w[3]}")

    axs = sns.scatterplot(x=x, y=df[Y_COL_LABEL], markers='g')
    plt.plot(x, model_func(x, *w), color='r')
    axs.set_xlim(0, 180)
    axs.set_ylim(0, 100)
    plt.show()
