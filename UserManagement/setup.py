from setuptools import setup, find_packages

setup(
    name='DevNetOps',
    version='1.3',
    description="DevNetOps scripts",
    long_description="DevNetOps scripts",
    license='Accenture',
    url='http://Accenture.com/',
    packages=find_packages(exclude=['bin', 'tests', 'tests.*']),
    platforms='Ubuntu',
    install_requires=[],
    classifiers=[
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python :: 3.6'
    ]
)
