#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Oct 20 11:17:04 2019

@author: alexlauni
"""

import itertools

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

sns.set(style='white', context='paper')

df = pd.read_csv('pchem.csv')
df_grouped_by_compound = df.groupby('compound')

xlabel = u"wavenumber ($cm^{-1}$)"
ylabel = "intensity (AU)"

for compound_name, df_compound in df_grouped_by_compound:
    palette = itertools.cycle(sns.color_palette("hls", 3))

    df_ir = df_compound[df_compound['technique'] == 'IR']
    df_raman = df_compound[df_compound['technique'].str.startswith('Raman')]

    fig, ax = plt.subplots(2, 1)
    for subplot in ax:
        subplot.set_xlim(5000, 0)

    subplot=ax[0]
    subplot.set_ylim(1.1, min(df_ir['intensity']) - 0.01)
    subplot.xaxis.tick_top()
    subplot.xaxis.set_label_position('top')
    sns.lineplot(data=df_ir, x='wavenumber', y='intensity', ax=subplot, color=next(palette))
    subplot.set(xlabel=xlabel, ylabel=ylabel)

    subplot=ax[1]
    sns.lineplot(data=df_raman, x='wavenumber', y='intensity', hue='technique', ax=subplot, color=next(palette))
    subplot.set_ylim(min(df_raman['intensity']) - 0.01, 1.1)
    subplot.set(xlabel=xlabel, ylabel=ylabel)
    subplot.legend().set_visible(False)

    plt.close(fig)
    fig.savefig("{}.png".format(compound_name))
    fig.clf()
