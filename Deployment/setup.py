from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
ext_modules = [
        Extension("Onboarding.src.api.resources",  ["Onboarding/src/api/resources.py"]),
                Extension("Onboarding.src.db.db",  ["Onboarding/src/db/db.py"]),
                Extension("Onboarding.src.config.config",  ["Onboarding/src/config/config.py"]),
                Extension("Onboarding.src.log",  ["Onboarding/src/log.py"])
]
setup(
        name = 'devnetops',
        cmdclass = {'build_ext': build_ext},
        ext_modules = ext_modules
)