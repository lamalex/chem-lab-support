import re
from pathlib import Path

from setuptools import find_packages, setup

VERSION_REGEX = re.compile(r"^__version__\W*=\W*'([\d.abrc]+)'")

def read_version():
    init_py = Path(__file__).parent.joinpath('app', '__init__.py')
    with open(init_py) as f:
        for line in f:
            match = VERSION_REGEX.match(line)
            if match is not None:
                return match.group(1)
            else:
                msg = f"Cannot find version in ${init_py}"
                raise RuntimeError(msg)

install_requires =[
    'aiohttp==3.5.4',
    'gunicorn==19.9.0',
    'matplotlib==3.1',
    'seaborn==0.9',
    'pandas==0.25'
]

setup(
    name="Excited for Pilates",
    version=read_version(),
    description="Fancy plotter for electron excitation states",
    platforms=['POSIX'],
    packages=find_packages(),
    include_package_data=True,
    install_requires=install_requires,
    zip_safe=False
)
