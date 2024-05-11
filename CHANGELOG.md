# [5.0.0](https://github.com/3cp/browser-do/compare/v4.1.0...v5.0.0) (2024-05-11)


### chore

* upgrade deps ([fd1adef](https://github.com/3cp/browser-do/commit/fd1adef16da60f03eafa30b32363347c9cfc8407))


### BREAKING CHANGES

* drop support of Nodejs < v18



# [4.1.0](https://github.com/3cp/browser-do/compare/v4.0.0...v4.1.0) (2022-01-23)


### Bug Fixes

* support both jasmine-core v3 and v4 ([9ea5ee2](https://github.com/3cp/browser-do/commit/9ea5ee21644dac1b73b0d2f621fa468bdedd57a4)), closes [#8](https://github.com/3cp/browser-do/issues/8)



# [4.0.0](https://github.com/3cp/browser-do/compare/v3.0.2...v4.0.0) (2021-11-03)


### chore

* upgrade deps, es6ify doesn't work with latest socket.io anymore ([de56192](https://github.com/3cp/browser-do/commit/de561924cccea3c6b9a0997cc1efc3f474fc0e6a))


### BREAKING CHANGES

* drop IE support



## [3.0.2](https://github.com/3cp/browser-do/compare/v3.0.1...v3.0.2) (2020-10-02)


### Bug Fixes

* fix wrong jasmine report on fit/fdescribe ([3a1f72e](https://github.com/3cp/browser-do/commit/3a1f72e3c2de80efb5c393aa6d05c0cda4a11a53)), closes [#3](https://github.com/3cp/browser-do/issues/3)



## [3.0.1](https://github.com/3cp/browser-do/compare/v3.0.0...v3.0.1) (2020-10-01)


### Bug Fixes

* has to use yarn to build to support IE11 ([59ff7a2](https://github.com/3cp/browser-do/commit/59ff7a28e4d21aa840e23712155a96a23780b84e))



# [3.0.0](https://github.com/3cp/browser-do/compare/v2.0.2...v3.0.0) (2020-08-18)


### Features

* drop nodejs v8 support ([d3680c3](https://github.com/3cp/browser-do/commit/d3680c340e11ec473aa4930c7302dd4f07825349))


### BREAKING CHANGES

* drop nodejs v8 support



## [2.0.2](https://github.com/3cp/browser-do/compare/v2.0.1...v2.0.2) (2020-05-15)


### Performance Improvements

* remove through and duplexer ([4b11b1e](https://github.com/3cp/browser-do/commit/4b11b1e4a7cca2fcedabd3649048318b15695a59))



## [2.0.1](https://github.com/3cp/browser-do/compare/v2.0.0...v2.0.1) (2020-02-19)



# [2.0.0](https://github.com/3cp/browser-do/compare/v1.0.0...v2.0.0) (2020-02-18)


### Bug Fixes

* bypass IE11 SCRIPT5045 ([a86710c](https://github.com/3cp/browser-do/commit/a86710c7aa5b9e0178328c46b934ca4e350c188d))
* fix macOS false browser detection ([961a8c6](https://github.com/3cp/browser-do/commit/961a8c60e16fda9771574cc40f8f46ea34b1d2eb))
* fix reporter build ([2a8fc38](https://github.com/3cp/browser-do/commit/2a8fc38f8d5dc3b872c210729831810db096a1ce))
* make reporter runnable on IE11 again ([0929c9d](https://github.com/3cp/browser-do/commit/0929c9dda6c88416a69479c95d8908a49670f317))


### Features

* migrate to latest chromium based edge ([b1a54c1](https://github.com/3cp/browser-do/commit/b1a54c195249469c94fa48c7a73b2679781680d5))
* support browser edge-headless ([63474b9](https://github.com/3cp/browser-do/commit/63474b979bfa36ad55aafca979099e1200d9136f))


### BREAKING CHANGES

* doesn't work with old MS Edge anymore.



# [1.0.0](https://github.com/3cp/browser-do/compare/v0.5.0...v1.0.0) (2020-01-21)



# [0.5.0](https://github.com/3cp/browser-do/compare/v0.4.0...v0.5.0) (2020-01-19)


### Bug Fixes

* use large socket.io timeout to cater huge test file ([49fe1ff](https://github.com/3cp/browser-do/commit/49fe1ffef5b2ed12df5a5b082ed0fd180604753c))



# [0.4.0](https://github.com/3cp/browser-do/compare/v0.3.4...v0.4.0) (2020-01-14)


### Features

* print out console debug/info/warn/error ([390df91](https://github.com/3cp/browser-do/commit/390df919f261d1766ebbd82f8cafe015bb577d52))



## [0.3.4](https://github.com/3cp/browser-do/compare/v0.3.3...v0.3.4) (2020-01-05)



## [0.3.3](https://github.com/3cp/browser-do/compare/v0.3.2...v0.3.3) (2019-11-20)



## [0.3.2](https://github.com/3cp/browser-do/compare/v0.3.1...v0.3.2) (2019-06-27)


### Bug Fixes

* don't check leak in default mocha setup, mocha thinks window.__coverage__ is a leak ([53695e3](https://github.com/3cp/browser-do/commit/53695e3))



## [0.3.1](https://github.com/3cp/browser-do/compare/v0.3.0...v0.3.1) (2019-06-27)



# [0.3.0](https://github.com/3cp/browser-do/compare/v0.2.0...v0.3.0) (2019-06-27)


### Bug Fixes

* avoid multiple tap complete callback ([e32b354](https://github.com/3cp/browser-do/commit/e32b354))


### Features

* support window.__coverage__ report ([c4c2aa0](https://github.com/3cp/browser-do/commit/c4c2aa0))



# [0.2.0](https://github.com/3cp/browser-do/compare/v0.1.0...v0.2.0) (2019-06-19)


### Features

* replace xhr-write-stream with socket.io ([9be4d62](https://github.com/3cp/browser-do/commit/9be4d62))



# 0.1.0 (2019-06-18)


### Bug Fixes

* add gitattributes for windows linebreak issue ([f99d952](https://github.com/3cp/browser-do/commit/f99d952))
* add polyfill for mocha+ie ([d8ad455](https://github.com/3cp/browser-do/commit/d8ad455))
* fix edge script. ([244fb40](https://github.com/3cp/browser-do/commit/244fb40))
* fix unnecessary and broken browser path check ([db4d6e2](https://github.com/3cp/browser-do/commit/db4d6e2))
* get back enstore ([cf32452](https://github.com/3cp/browser-do/commit/cf32452))


### Features

* first try of browser-run + tape-run ([ac20c9f](https://github.com/3cp/browser-do/commit/ac20c9f))
* in keep-open mode, forward test result to ctrl-c exit ([9a56224](https://github.com/3cp/browser-do/commit/9a56224))
* internal tap parser ([9ed7206](https://github.com/3cp/browser-do/commit/9ed7206))
* support jasmine out of the box ([16e69db](https://github.com/3cp/browser-do/commit/16e69db))




