from distutils.core import setup
from distutils.extension import Extension
from Cython.Distutils import build_ext
ext_modules = [
        Extension("Onboarding.src.api.resources",  ["Onboarding/src/api/resources.py"]),
                Extension("Onboarding.src.db.db",  ["Onboarding/src/db/db.py"]),
                Extension("Onboarding.src.config.config",  ["Onboarding/src/config/config.py"]),
  				Extension("Onboarding.src.lib.cloud_validate",  ["Onboarding/src/lib/cloud_validate.py"]),
  				Extension("Onboarding.src.lib.commonfunctions",  ["Onboarding/src/lib/commonfunctions.py"]),
  				Extension("Onboarding.src.lib.jfrog",  ["Onboarding/src/lib/jfrog.py"]),
  				Extension("Onboarding.src.lib.nexus",  ["Onboarding/src/lib/nexus.py"]),
  				Extension("Onboarding.src.lib.sse",  ["Onboarding/src/lib/sse.py"]),
  				Extension("Onboarding.src.lib.vault",  ["Onboarding/src/lib/vault.py"]),
  				Extension("Onboarding.src.__init__",  ["Onboarding/src/__init__.py"]),
  				Extension("Onboarding.src.log",  ["Onboarding/src/log.py"])
]
setup(
        name = 'devnetops',
        cmdclass = {'build_ext': build_ext},
        ext_modules = ext_modules
)
