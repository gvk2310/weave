from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
ext_modules = [
        Extension("Deploy.src.api.resources",  ["Deploy/src/api/resources.py"]),
                Extension("Deploy.src.db.db",  ["Deploy/src/db/db.py"]),
                Extension("Deploy.src.config.config",  ["Deploy/src/config/config.py"]),
  				Extension("Deploy.src.lib.awsFunctions",  ["Deploy/src/lib/awsFunctions.py"]),
  				Extension("Deploy.src.lib.commonfunctions",  ["Deploy/src/lib/commonfunctions.py"]),
  				Extension("Deploy.src.lib.sse",  ["Deploy/src/lib/sse.py"]),
  				Extension("Deploy.src.__init__",  ["Deploy/src/__init__.py"]),
                Extension("Deploy.src.log",  ["Deploy/src/log.py"])
]
setup(
        name = 'devnetops',
        cmdclass = {'build_ext': build_ext},
        ext_modules = ext_modules
)
