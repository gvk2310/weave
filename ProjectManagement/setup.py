from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
ext_modules = [
        Extension("AccessMgmt.src.api.resources",  ["AccessMgmt/src/api/resources.py"]),
                Extension("AccessMgmt.src.db.db",  ["AccessMgmt/src/db/db.py"]),
                Extension("AccessMgmt.src.config.config",  ["AccessMgmt/src/config/config.py"]),
  				Extension("AccessMgmt.src.lib.commonFunctions",  ["AccessMgmt/src/lib/commonFunctions.py"]),
  				Extension("AccessMgmt.src.__init__",  ["AccessMgmt/src/__init__.py"]),
  				Extension("AccessMgmt.src.log",  ["AccessMgmt/src/log.py"])
]
setup(
        name = 'devnetops',
        cmdclass = {'build_ext': build_ext},
        ext_modules = ext_modules
)
