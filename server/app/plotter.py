#!/usr/bin/env python3
import random
import string
import logging
import itertools
import matplotlib
matplotlib.use("Agg")
import seaborn as sns
sns.set(style='white', context='paper')
import pandas as pd
import matplotlib.pyplot as plt

AXIS_TOLERANCE = 0.1

def plot_from_csv(file_handle, plotConfig):
    filenames = []
    df = pd.read_csv(file_handle)
    df_grouped_by_compound = df.groupby('compound')

    if plotConfig:
        defaultConfig = {
            'xmin': -0.1,
            'xmax': 5000,
            'ymin': -0.1,
            'ymax': 1.1
        }

        for key in defaultConfig:
            if (not key in plotConfig):
                plotConfig[key] = defaultConfig[key]

    xColHeading = 'wavenumber'
    yColHeading = 'intensity'
    xAxisLabel = u"wavenumber ($cm^{-1}$)"
    yAxisLabel = "intensity (AU)"

    for compound_name, df_compound in df_grouped_by_compound:
        if not plotConfig:
            xseries = df[xColHeading]
            yseries = df[yColHeading]
            plotConfig = {
                'xmin': min(xseries),
                'xmax': max(xseries),
                'ymin': min(yseries),
                'ymax': max(yseries)
            }
        palette = itertools.cycle(sns.color_palette("hls", 3))

        df_ir = df_compound[df_compound['technique'] == 'IR']
        df_raman = df_compound[df_compound['technique'].str.startswith('Raman')]

        fig, ax = plt.subplots(2, 1)
        for subplot in ax:
            subplot.set_xlim(plotConfig['xmax'] + AXIS_TOLERANCE, plotConfig['xmin'] - AXIS_TOLERANCE)

        subplot=ax[0]
        sns.lineplot(data=df_ir, x=xColHeading, y=yColHeading, hue='technique', ax=subplot, color=next(palette))
        subplot.set_ylim(plotConfig['ymax'] + AXIS_TOLERANCE, plotConfig['ymin'] - AXIS_TOLERANCE)
        subplot.xaxis.tick_top()
        subplot.set(xlabel=xAxisLabel, ylabel=yAxisLabel)
        subplot.legend().set_visible(False)

        subplot=ax[1]
        sns.lineplot(data=df_raman, x=xColHeading, y=yColHeading, hue='technique', ax=subplot, color=next(palette))
        subplot.set_ylim(plotConfig['ymin'], plotConfig['ymax'])
        subplot.xaxis.tick_bottom()
        subplot.set(xlabel=xAxisLabel, ylabel=yAxisLabel)
        subplot.legend().set_visible(False)

        plt.close(fig)
        randomChars = ''.join([random.choice(string.ascii_letters + string.digits) for n in range(8)])
        filename = "{}.{}.png".format(compound_name, randomChars)
        fig.savefig('static/plots/{}'.format(filename), dpi=300, metadata={
            'software': 'excited_pilates.py',
            'comment': 'DREAM BIG, FIGHT HARD. WARREN 2020'
        })
        fig.clf()
        filenames.append(filename)
    return filenames
