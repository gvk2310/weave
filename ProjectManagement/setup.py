from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
ext_modules = [
        Extension("ProjectMgmt.src.api.resources",  ["ProjectMgmt/src/api/resources.py"]),
                Extension("ProjectMgmt.src.db.db",  ["ProjectMgmt/src/db/db.py"]),
                Extension("ProjectMgmt.src.config.config",  ["ProjectMgmt/src/config/config.py"]),
  				Extension("ProjectMgmt.src.lib.commonFunctions",  ["ProjectMgmt/src/lib/commonFunctions.py"]),
  				Extension("ProjectMgmt.src.__init__",  ["ProjectMgmt/src/__init__.py"]),
  				Extension("ProjectMgmt.src.log",  ["ProjectMgmt/src/log.py"])
]
setup(
        name = 'devnetops',
        cmdclass = {'build_ext': build_ext},
        ext_modules = ext_modules
)
