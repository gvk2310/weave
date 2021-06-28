from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext

ext_modules = [
    Extension("sse.src.api.resources", ["sse/src/api/resources.py"]),
    Extension("sse.src.lib.commonFunctions", ["sse/src/lib/commonFunctions"]),
    Extension("sse.src.config.config", ["sse/src/config/config.py"]),
    Extension("sse.src.__init__", ["sse/src/__init__.py"]),
    Extension("sse.src.log", ["sse/src/log.py"])
]
setup(
    name='devnetops',
    cmdclass={'build_ext': build_ext},
    ext_modules=ext_modules
)

