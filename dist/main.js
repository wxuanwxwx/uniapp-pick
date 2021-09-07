(() => {
  var e = {
      648: e => {
        e.exports = {
          name: "咕咕咕"
        }
      },
      384: (e, o, r) => {
        const s = r(648);
        e.exports = {
          message: `这是我的名字！${s.name}`
        }
      }
    },
    o = {};

  function r(s) {
    var t = o[s];
    if (void 0 !== t) return t.exports;
    var n = o[s] = {
      exports: {}
    };
    return e[s](n, n.exports, r), n.exports
  }(() => {
    const e = r(384);
    console.log(e.message)
  })()
})();