from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
ext_modules = [
	Extension("UserMgmt.src.api.resources",  ["UserMgmt/src/api/resources.py"]),
		Extension("UserMgmt.src.db.db",  ["UserMgmt/src/db/db.py"]),
		Extension("UserMgmt.src.config.config",  ["UserMgmt/src/config/config.py"]),
		Extension("UserMgmt.src.log",  ["UserMgmt/src/log.py"])
]
setup(
	name = 'devnetops',
	cmdclass = {'build_ext': build_ext},
	ext_modules = ext_modules
)
