// https://github.com/larrymyers/jasmine-reporters/blob/master/src/tap_reporter.js
(function(global) {
  function trim(str) { return str.replace(/^\s+/, "").replace(/\s+$/, ""); }
  function elapsed(start, end) { return (end - start)/1000; }
  function isFailed(obj) { return obj.status === "failed"; }
  function isSkipped(obj) { return obj.status === "pending"; }
  function isExcluded(obj) { return obj.status === "excluded" || obj.status === "disabled"; }
  function extend(dupe, obj) { // performs a shallow copy of all props of `obj` onto `dupe`
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        dupe[prop] = obj[prop];
      }
    }
    return dupe;
  }
  function log(str) {
    var con = global.console || console;
    if (con && con.log) {
      con.log(str);
    }
  }

  /**
   * TAP (http://en.wikipedia.org/wiki/Test_Anything_Protocol) reporter.
   * outputs spec results to the console.
   */
  var TapReporter = function() {
    var self = this;
    self.started = false;
    self.finished = false;

    var startTime,
      endTime,
      currentSuite = null,
      totalSpecsExecuted = 0,
      totalSpecsSkipped = 0,
      totalSpecsFailed = 0,
      totalSpecsDefined,
      // when use use fit, jasmine never calls suiteStarted / suiteDone, so make a fake one to use
      fakeFocusedSuite = {
        id: "focused",
        description: "focused specs",
        fullName: "focused specs"
      };

    var __suites = {}, __specs = {};
    function getSuite(suite) {
      __suites[suite.id] = extend(__suites[suite.id] || {}, suite);
      return __suites[suite.id];
    }
    function getSpec(spec, suite) {
      __specs[spec.id] = extend(__specs[spec.id] || {}, spec);
      var ret = __specs[spec.id];
      if (suite && !ret._suite) {
        ret._suite = suite;
      }
      return ret;
    }

    self.jasmineStarted = function(summary) {
      log("TAP version 13");
      self.started = true;
      totalSpecsDefined = summary && summary.totalSpecsDefined || NaN;
      startTime = new Date();
    };
    self.suiteStarted = function(suite) {
      suite = getSuite(suite);
      currentSuite = suite;
    };
    self.specStarted = function() {
      if (!currentSuite) {
        // focused spec (fit) -- suiteStarted was never called
        self.suiteStarted(fakeFocusedSuite);
      }
      totalSpecsExecuted++;
    };
    self.specDone = function(spec) {
      spec = getSpec(spec, currentSuite);
      var resultStr = "ok " + totalSpecsExecuted + " - " + spec._suite.description + " : " + spec.description;
      if (isFailed(spec)) {
        totalSpecsFailed++;
        resultStr = "not " + resultStr;
        for (var i = 0, failure; i < spec.failedExpectations.length; i++) {
          failure = spec.failedExpectations[i];
          resultStr += "\n  # Failure: " + trim(failure.message);
          if (failure.stack && failure.stack !== failure.message) {
            resultStr += "\n  # === STACK TRACE ===";
            resultStr += "\n  # " + failure.stack.replace(/\n/mg, "\n  # ");
            resultStr += "\n  # === END STACK TRACE ===";
          }
        }
      }
      if (isSkipped(spec)) {
        totalSpecsExecuted--;
        totalSpecsSkipped++;
        resultStr = "# Skipped (xit or xdescribe): " + spec._suite.description + " : " + spec.description;
      }
      if (isExcluded(spec)) {
        totalSpecsExecuted--;
        totalSpecsSkipped++;
        resultStr = "# Excluded (by fit or fdescribe on other spec): " + spec._suite.description + " : " + spec.description;
      }
      log(resultStr);
    };
    self.suiteDone = function(suite) {
      suite = getSuite(suite);
      if (suite._parent === undefined) {
        // disabled suite (xdescribe) -- suiteStarted was never called
        self.suiteStarted(suite);
      }
      currentSuite = suite._parent;
    };
    self.jasmineDone = function() {
      if (currentSuite) {
        // focused spec (fit) -- suiteDone was never called
        self.suiteDone(fakeFocusedSuite);
      }
      endTime = new Date();
      var dur = elapsed(startTime, endTime),
        totalSpecs = totalSpecsDefined || totalSpecsExecuted;

      if (totalSpecsExecuted === 0) {
        log("1..0 # All tests disabled");
      } else {
        log("1.." + totalSpecsExecuted);
      }
      var diagStr = "#";
      diagStr = "# " + totalSpecs + " spec" + (totalSpecs < 2 ? "" : "s");
      diagStr += ", " + totalSpecsFailed + " failure" + (totalSpecsFailed < 2 ? "" : "s");
      diagStr += ", " + totalSpecsSkipped + " skipped";
      diagStr += " in " + dur + "s.";
      log(diagStr);

      self.finished = true;
    };
  };

  global.jasmine.getEnv().addReporter(new TapReporter());
})(this);