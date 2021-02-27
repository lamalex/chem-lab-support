#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Apr 10 20:44:51 2020

@author: alexlauni
"""

import numpy as np
import pandas as pd

def get_kmd_cols(df):
    return [col for col in df.columns if col.startswith('KMD')]

def calc_relative_intensity(df):
    total_intensity = df['PeakHeight'].sum()
    return (df['PeakHeight'] / total_intensity) * 100

def count_kmd(df):
    kmd_df = df[get_kmd_cols(df)]
    return kmd_df.apply(pd.Series.value_counts)

def new_dissapeared_and_retained(df1, df2):
    common_nmasses = np.intersect1d(df1['Neutral Mass'], df2['Neutral Mass'])
    retained_12 = df_12h['Neutral Mass'].apply(lambda nmass: nmass in common_nmasses)
    retained_24 = df_24h['Neutral Mass'].apply(lambda nmass: nmass in common_nmasses)

    df_dissapeared = df_12h[~retained_12]
    df_new = df_24h[~retained_24]
    df_retained = df_12h[retained_12]
    return (df_dissapeared, df_new, df_retained)
    
nominal_masses = {
    'CH2': 12+2*1.007825032,
    'COO': 12+2*15.994914622,
    'H2O': 15.994914622+2*1.007825032,
    'H2': 2*1.007825032,
    'O': 15.994914622,
    'C2H4O': 2*12+4*1.007825032+15.994914622,
    'OCH2': 12+2*1.007825032+15.994914622
}

df_12h = pd.read_csv('data/12h_cleaned.csv')
df_24h = pd.read_csv('data/24h_cleaned.csv')

# Add relative intensity
df_12h['RelativeIntensity'] = calc_relative_intensity(df_12h)
df_24h['RelativeIntensity'] = calc_relative_intensity(df_24h)

# count how many times each kmd value occurs for each group
kmd_count_12h = count_kmd(df_12h)
kmd_count_24h = count_kmd(df_24h)
    
df_dissapeared, df_new, df_retained = new_dissapeared_and_retained(df_12h, df_24h)

retained_with_common_kmd = {}
for group in get_kmd_cols(df_retained):
    common_kmd = np.intersect1d(df_retained[group], df_dissapeared[group])
    kmds = df_retained[group]
    fms_w_com_kmd = df_retained[kmds.apply(lambda kmd: kmd in common_kmd)]
    retained_with_common_kmd[group] = fms_w_com_kmd[group].value_counts()
    
