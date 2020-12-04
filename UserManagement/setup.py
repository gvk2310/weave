from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
ext_modules = [
        Extension("UserMgmt.src.api.resources",  ["UserMgmt/src/api/resources.py"]),
                Extension("UserMgmt.src.db.db",  ["UserMgmt/src/db/db.py"]),
                Extension("UserMgmt.src.config.config",  ["UserMgmt/src/config/config.py"]),
  				Extension("UserMgmt.src.lib.commonfunctions",  ["UserMgmt/src/lib/commonfunctions.py"]),
  				Extension("Onboarding.src.__init__",  ["Onboarding/src/__init__.py"]),
  				Extension("Onboarding.src.log",  ["Onboarding/src/log.py"])
]
setup(
        name = 'devnetops',
        cmdclass = {'build_ext': build_ext},
        ext_modules = ext_modules
)
