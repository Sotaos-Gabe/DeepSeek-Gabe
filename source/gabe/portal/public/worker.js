self.onmessage = (messageEvent) => {
  const {
    type,
    payload: { pagesCount, extractTextCapability },
  } = messageEvent.data;
  switch (type) {
    case "start":
      var _extractTextPromises = [];
      var promise = Promise.resolve();
      var _loop = function _loop(i, ii) {
        _extractTextPromises[i] = extractTextCapability.promise;
      };

      for (var i = 0, ii = pagesCount; i < ii; i++) {
        _loop(i, ii);
      }
      // this.postMessage({ test });
      break;
  }
};
