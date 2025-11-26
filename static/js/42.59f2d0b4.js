(self["webpackChunkreach_panel"] = self["webpackChunkreach_panel"] || []).push([[42], {
    12641: function(e, t, r) {
        var a, n;
        /*! VelocityJS.org (1.5.2). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
        /*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */
        (function(e) {
            "use strict";
            if (!e.jQuery) {
                var t = function(e, r) {
                    return new t.fn.init(e,r)
                };
                t.isWindow = function(e) {
                    return e && e === e.window
                }
                ,
                t.type = function(e) {
                    return e ? "object" === typeof e || "function" === typeof e ? a[i.call(e)] || "object" : typeof e : e + ""
                }
                ,
                t.isArray = Array.isArray || function(e) {
                    return "array" === t.type(e)
                }
                ,
                t.isPlainObject = function(e) {
                    var r;
                    if (!e || "object" !== t.type(e) || e.nodeType || t.isWindow(e))
                        return !1;
                    try {
                        if (e.constructor && !n.call(e, "constructor") && !n.call(e.constructor.prototype, "isPrototypeOf"))
                            return !1
                    } catch (a) {
                        return !1
                    }
                    for (r in e)
                        ;
                    return void 0 === r || n.call(e, r)
                }
                ,
                t.each = function(e, t, r) {
                    var a, n = 0, i = e.length, o = l(e);
                    if (r) {
                        if (o) {
                            for (; n < i; n++)
                                if (a = t.apply(e[n], r),
                                !1 === a)
                                    break
                        } else
                            for (n in e)
                                if (e.hasOwnProperty(n) && (a = t.apply(e[n], r),
                                !1 === a))
                                    break
                    } else if (o) {
                        for (; n < i; n++)
                            if (a = t.call(e[n], n, e[n]),
                            !1 === a)
                                break
                    } else
                        for (n in e)
                            if (e.hasOwnProperty(n) && (a = t.call(e[n], n, e[n]),
                            !1 === a))
                                break;
                    return e
                }
                ,
                t.data = function(e, a, n) {
                    if (void 0 === n) {
                        var i = e[t.expando]
                          , o = i && r[i];
                        if (void 0 === a)
                            return o;
                        if (o && a in o)
                            return o[a]
                    } else if (void 0 !== a) {
                        var s = e[t.expando] || (e[t.expando] = ++t.uuid);
                        return r[s] = r[s] || {},
                        r[s][a] = n,
                        n
                    }
                }
                ,
                t.removeData = function(e, a) {
                    var n = e[t.expando]
                      , i = n && r[n];
                    i && (a ? t.each(a, (function(e, t) {
                        delete i[t]
                    }
                    )) : delete r[n])
                }
                ,
                t.extend = function() {
                    var e, r, a, n, i, o, s = arguments[0] || {}, l = 1, u = arguments.length, c = !1;
                    for ("boolean" === typeof s && (c = s,
                    s = arguments[l] || {},
                    l++),
                    "object" !== typeof s && "function" !== t.type(s) && (s = {}),
                    l === u && (s = this,
                    l--); l < u; l++)
                        if (i = arguments[l])
                            for (n in i)
                                i.hasOwnProperty(n) && (e = s[n],
                                a = i[n],
                                s !== a && (c && a && (t.isPlainObject(a) || (r = t.isArray(a))) ? (r ? (r = !1,
                                o = e && t.isArray(e) ? e : []) : o = e && t.isPlainObject(e) ? e : {},
                                s[n] = t.extend(c, o, a)) : void 0 !== a && (s[n] = a)));
                    return s
                }
                ,
                t.queue = function(e, r, a) {
                    function n(e, t) {
                        var r = t || [];
                        return e && (l(Object(e)) ? function(e, t) {
                            var r = +t.length
                              , a = 0
                              , n = e.length;
                            while (a < r)
                                e[n++] = t[a++];
                            if (r !== r)
                                while (void 0 !== t[a])
                                    e[n++] = t[a++];
                            e.length = n
                        }(r, "string" === typeof e ? [e] : e) : [].push.call(r, e)),
                        r
                    }
                    if (e) {
                        r = (r || "fx") + "queue";
                        var i = t.data(e, r);
                        return a ? (!i || t.isArray(a) ? i = t.data(e, r, n(a)) : i.push(a),
                        i) : i || []
                    }
                }
                ,
                t.dequeue = function(e, r) {
                    t.each(e.nodeType ? [e] : e, (function(e, a) {
                        r = r || "fx";
                        var n = t.queue(a, r)
                          , i = n.shift();
                        "inprogress" === i && (i = n.shift()),
                        i && ("fx" === r && n.unshift("inprogress"),
                        i.call(a, (function() {
                            t.dequeue(a, r)
                        }
                        )))
                    }
                    ))
                }
                ,
                t.fn = t.prototype = {
                    init: function(e) {
                        if (e.nodeType)
                            return this[0] = e,
                            this;
                        throw new Error("Not a DOM node.")
                    },
                    offset: function() {
                        var t = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                            top: 0,
                            left: 0
                        };
                        return {
                            top: t.top + (e.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                            left: t.left + (e.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                        }
                    },
                    position: function() {
                        function e(e) {
                            var t = e.offsetParent;
                            while (t && "html" !== t.nodeName.toLowerCase() && t.style && "static" === t.style.position.toLowerCase())
                                t = t.offsetParent;
                            return t || document
                        }
                        var r = this[0]
                          , a = e(r)
                          , n = this.offset()
                          , i = /^(?:body|html)$/i.test(a.nodeName) ? {
                            top: 0,
                            left: 0
                        } : t(a).offset();
                        return n.top -= parseFloat(r.style.marginTop) || 0,
                        n.left -= parseFloat(r.style.marginLeft) || 0,
                        a.style && (i.top += parseFloat(a.style.borderTopWidth) || 0,
                        i.left += parseFloat(a.style.borderLeftWidth) || 0),
                        {
                            top: n.top - i.top,
                            left: n.left - i.left
                        }
                    }
                };
                var r = {};
                t.expando = "velocity" + (new Date).getTime(),
                t.uuid = 0;
                for (var a = {}, n = a.hasOwnProperty, i = a.toString, o = "Boolean Number String Function Array Date RegExp Object Error".split(" "), s = 0; s < o.length; s++)
                    a["[object " + o[s] + "]"] = o[s].toLowerCase();
                t.fn.init.prototype = t.fn,
                e.Velocity = {
                    Utilities: t
                }
            }
            function l(e) {
                var r = e.length
                  , a = t.type(e);
                return "function" !== a && !t.isWindow(e) && (!(1 !== e.nodeType || !r) || ("array" === a || 0 === r || "number" === typeof r && r > 0 && r - 1 in e))
            }
        }
        )(window),
        function(i) {
            "use strict";
            "object" === typeof e.exports ? e.exports = i() : (a = i,
            n = "function" === typeof a ? a.call(t, r, t, e) : a,
            void 0 === n || (e.exports = n))
        }((function() {
            "use strict";
            return function(e, t, r, a) {
                var n = function() {
                    if (r.documentMode)
                        return r.documentMode;
                    for (var e = 7; e > 4; e--) {
                        var t = r.createElement("div");
                        if (t.innerHTML = "\x3c!--[if IE " + e + "]><span></span><![endif]--\x3e",
                        t.getElementsByTagName("span").length)
                            return t = null,
                            e
                    }
                    return a
                }()
                  , i = function() {
                    var e = 0;
                    return t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || function(t) {
                        var r, a = (new Date).getTime();
                        return r = Math.max(0, 16 - (a - e)),
                        e = a + r,
                        setTimeout((function() {
                            t(a + r)
                        }
                        ), r)
                    }
                }()
                  , o = function() {
                    var e = t.performance || {};
                    if ("function" !== typeof e.now) {
                        var r = e.timing && e.timing.navigationStart ? e.timing.navigationStart : (new Date).getTime();
                        e.now = function() {
                            return (new Date).getTime() - r
                        }
                    }
                    return e
                }();
                function s(e) {
                    var t = -1
                      , r = e ? e.length : 0
                      , a = [];
                    while (++t < r) {
                        var n = e[t];
                        n && a.push(n)
                    }
                    return a
                }
                var l = function() {
                    var e = Array.prototype.slice;
                    try {
                        return e.call(r.documentElement),
                        e
                    } catch (t) {
                        return function(t, r) {
                            var a = this.length;
                            if ("number" !== typeof t && (t = 0),
                            "number" !== typeof r && (r = a),
                            this.slice)
                                return e.call(this, t, r);
                            var n, i = [], o = t >= 0 ? t : Math.max(0, a + t), s = r < 0 ? a + r : Math.min(r, a), l = s - o;
                            if (l > 0)
                                if (i = new Array(l),
                                this.charAt)
                                    for (n = 0; n < l; n++)
                                        i[n] = this.charAt(o + n);
                                else
                                    for (n = 0; n < l; n++)
                                        i[n] = this[o + n];
                            return i
                        }
                    }
                }()
                  , u = function() {
                    return Array.prototype.includes ? function(e, t) {
                        return e.includes(t)
                    }
                    : Array.prototype.indexOf ? function(e, t) {
                        return e.indexOf(t) >= 0
                    }
                    : function(e, t) {
                        for (var r = 0; r < e.length; r++)
                            if (e[r] === t)
                                return !0;
                        return !1
                    }
                };
                function c(e) {
                    return d.isWrapped(e) ? e = l.call(e) : d.isNode(e) && (e = [e]),
                    e
                }
                var p, d = {
                    isNumber: function(e) {
                        return "number" === typeof e
                    },
                    isString: function(e) {
                        return "string" === typeof e
                    },
                    isArray: Array.isArray || function(e) {
                        return "[object Array]" === Object.prototype.toString.call(e)
                    }
                    ,
                    isFunction: function(e) {
                        return "[object Function]" === Object.prototype.toString.call(e)
                    },
                    isNode: function(e) {
                        return e && e.nodeType
                    },
                    isWrapped: function(e) {
                        return e && e !== t && d.isNumber(e.length) && !d.isString(e) && !d.isFunction(e) && !d.isNode(e) && (0 === e.length || d.isNode(e[0]))
                    },
                    isSVG: function(e) {
                        return t.SVGElement && e instanceof t.SVGElement
                    },
                    isEmptyObject: function(e) {
                        for (var t in e)
                            if (e.hasOwnProperty(t))
                                return !1;
                        return !0
                    }
                }, f = !1;
                if (e.fn && e.fn.jquery ? (p = e,
                f = !0) : p = t.Velocity.Utilities,
                n <= 8 && !f)
                    throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
                if (!(n <= 7)) {
                    var g = 400
                      , m = "swing"
                      , y = {
                        State: {
                            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(t.navigator.userAgent),
                            isAndroid: /Android/i.test(t.navigator.userAgent),
                            isGingerbread: /Android 2\.3\.[3-7]/i.test(t.navigator.userAgent),
                            isChrome: t.chrome,
                            isFirefox: /Firefox/i.test(t.navigator.userAgent),
                            prefixElement: r.createElement("div"),
                            prefixMatches: {},
                            scrollAnchor: null,
                            scrollPropertyLeft: null,
                            scrollPropertyTop: null,
                            isTicking: !1,
                            calls: [],
                            delayedElements: {
                                count: 0
                            }
                        },
                        CSS: {},
                        Utilities: p,
                        Redirects: {},
                        Easings: {},
                        Promise: t.Promise,
                        defaults: {
                            queue: "",
                            duration: g,
                            easing: m,
                            begin: a,
                            complete: a,
                            progress: a,
                            display: a,
                            visibility: a,
                            loop: !1,
                            delay: !1,
                            mobileHA: !0,
                            _cacheValues: !0,
                            promiseRejectEmpty: !0
                        },
                        init: function(e) {
                            p.data(e, "velocity", {
                                isSVG: d.isSVG(e),
                                isAnimating: !1,
                                computedStyle: null,
                                tweensContainer: null,
                                rootPropertyValueCache: {},
                                transformCache: {}
                            })
                        },
                        hook: null,
                        mock: !1,
                        version: {
                            major: 1,
                            minor: 5,
                            patch: 2
                        },
                        debug: !1,
                        timestamp: !0,
                        pauseAll: function(e) {
                            var t = (new Date).getTime();
                            p.each(y.State.calls, (function(t, r) {
                                if (r) {
                                    if (e !== a && (r[2].queue !== e || !1 === r[2].queue))
                                        return !0;
                                    r[5] = {
                                        resume: !1
                                    }
                                }
                            }
                            )),
                            p.each(y.State.delayedElements, (function(e, r) {
                                r && k(r, t)
                            }
                            ))
                        },
                        resumeAll: function(e) {
                            var t = (new Date).getTime();
                            p.each(y.State.calls, (function(t, r) {
                                if (r) {
                                    if (e !== a && (r[2].queue !== e || !1 === r[2].queue))
                                        return !0;
                                    r[5] && (r[5].resume = !0)
                                }
                            }
                            )),
                            p.each(y.State.delayedElements, (function(e, r) {
                                r && P(r, t)
                            }
                            ))
                        }
                    };
                    t.pageYOffset !== a ? (y.State.scrollAnchor = t,
                    y.State.scrollPropertyLeft = "pageXOffset",
                    y.State.scrollPropertyTop = "pageYOffset") : (y.State.scrollAnchor = r.documentElement || r.body.parentNode || r.body,
                    y.State.scrollPropertyLeft = "scrollLeft",
                    y.State.scrollPropertyTop = "scrollTop");
                    var h = function() {
                        function e(e) {
                            return -e.tension * e.x - e.friction * e.v
                        }
                        function t(t, r, a) {
                            var n = {
                                x: t.x + a.dx * r,
                                v: t.v + a.dv * r,
                                tension: t.tension,
                                friction: t.friction
                            };
                            return {
                                dx: n.v,
                                dv: e(n)
                            }
                        }
                        function r(r, a) {
                            var n = {
                                dx: r.v,
                                dv: e(r)
                            }
                              , i = t(r, .5 * a, n)
                              , o = t(r, .5 * a, i)
                              , s = t(r, a, o)
                              , l = 1 / 6 * (n.dx + 2 * (i.dx + o.dx) + s.dx)
                              , u = 1 / 6 * (n.dv + 2 * (i.dv + o.dv) + s.dv);
                            return r.x = r.x + l * a,
                            r.v = r.v + u * a,
                            r
                        }
                        return function e(t, a, n) {
                            var i, o, s, l = {
                                x: -1,
                                v: 0,
                                tension: null,
                                friction: null
                            }, u = [0], c = 0, p = 1e-4, d = .016;
                            t = parseFloat(t) || 500,
                            a = parseFloat(a) || 20,
                            n = n || null,
                            l.tension = t,
                            l.friction = a,
                            i = null !== n,
                            i ? (c = e(t, a),
                            o = c / n * d) : o = d;
                            while (1)
                                if (s = r(s || l, o),
                                u.push(1 + s.x),
                                c += 16,
                                !(Math.abs(s.x) > p && Math.abs(s.v) > p))
                                    break;
                            return i ? function(e) {
                                return u[e * (u.length - 1) | 0]
                            }
                            : c
                        }
                    }();
                    y.Easings = {
                        linear: function(e) {
                            return e
                        },
                        swing: function(e) {
                            return .5 - Math.cos(e * Math.PI) / 2
                        },
                        spring: function(e) {
                            return 1 - Math.cos(4.5 * e * Math.PI) * Math.exp(6 * -e)
                        }
                    },
                    p.each([["ease", [.25, .1, .25, 1]], ["ease-in", [.42, 0, 1, 1]], ["ease-out", [0, 0, .58, 1]], ["ease-in-out", [.42, 0, .58, 1]], ["easeInSine", [.47, 0, .745, .715]], ["easeOutSine", [.39, .575, .565, 1]], ["easeInOutSine", [.445, .05, .55, .95]], ["easeInQuad", [.55, .085, .68, .53]], ["easeOutQuad", [.25, .46, .45, .94]], ["easeInOutQuad", [.455, .03, .515, .955]], ["easeInCubic", [.55, .055, .675, .19]], ["easeOutCubic", [.215, .61, .355, 1]], ["easeInOutCubic", [.645, .045, .355, 1]], ["easeInQuart", [.895, .03, .685, .22]], ["easeOutQuart", [.165, .84, .44, 1]], ["easeInOutQuart", [.77, 0, .175, 1]], ["easeInQuint", [.755, .05, .855, .06]], ["easeOutQuint", [.23, 1, .32, 1]], ["easeInOutQuint", [.86, 0, .07, 1]], ["easeInExpo", [.95, .05, .795, .035]], ["easeOutExpo", [.19, 1, .22, 1]], ["easeInOutExpo", [1, 0, 0, 1]], ["easeInCirc", [.6, .04, .98, .335]], ["easeOutCirc", [.075, .82, .165, 1]], ["easeInOutCirc", [.785, .135, .15, .86]]], (function(e, t) {
                        y.Easings[t[0]] = T.apply(null, t[1])
                    }
                    ));
                    var v = y.CSS = {
                        RegEx: {
                            isHex: /^#([A-f\d]{3}){1,2}$/i,
                            valueUnwrap: /^[A-z]+\((.*)\)$/i,
                            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
                        },
                        Lists: {
                            colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                            transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                            transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"],
                            units: ["%", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax", "cm", "mm", "Q", "in", "pc", "pt", "px", "deg", "grad", "rad", "turn", "s", "ms"],
                            colorNames: {
                                aliceblue: "240,248,255",
                                antiquewhite: "250,235,215",
                                aquamarine: "127,255,212",
                                aqua: "0,255,255",
                                azure: "240,255,255",
                                beige: "245,245,220",
                                bisque: "255,228,196",
                                black: "0,0,0",
                                blanchedalmond: "255,235,205",
                                blueviolet: "138,43,226",
                                blue: "0,0,255",
                                brown: "165,42,42",
                                burlywood: "222,184,135",
                                cadetblue: "95,158,160",
                                chartreuse: "127,255,0",
                                chocolate: "210,105,30",
                                coral: "255,127,80",
                                cornflowerblue: "100,149,237",
                                cornsilk: "255,248,220",
                                crimson: "220,20,60",
                                cyan: "0,255,255",
                                darkblue: "0,0,139",
                                darkcyan: "0,139,139",
                                darkgoldenrod: "184,134,11",
                                darkgray: "169,169,169",
                                darkgrey: "169,169,169",
                                darkgreen: "0,100,0",
                                darkkhaki: "189,183,107",
                                darkmagenta: "139,0,139",
                                darkolivegreen: "85,107,47",
                                darkorange: "255,140,0",
                                darkorchid: "153,50,204",
                                darkred: "139,0,0",
                                darksalmon: "233,150,122",
                                darkseagreen: "143,188,143",
                                darkslateblue: "72,61,139",
                                darkslategray: "47,79,79",
                                darkturquoise: "0,206,209",
                                darkviolet: "148,0,211",
                                deeppink: "255,20,147",
                                deepskyblue: "0,191,255",
                                dimgray: "105,105,105",
                                dimgrey: "105,105,105",
                                dodgerblue: "30,144,255",
                                firebrick: "178,34,34",
                                floralwhite: "255,250,240",
                                forestgreen: "34,139,34",
                                fuchsia: "255,0,255",
                                gainsboro: "220,220,220",
                                ghostwhite: "248,248,255",
                                gold: "255,215,0",
                                goldenrod: "218,165,32",
                                gray: "128,128,128",
                                grey: "128,128,128",
                                greenyellow: "173,255,47",
                                green: "0,128,0",
                                honeydew: "240,255,240",
                                hotpink: "255,105,180",
                                indianred: "205,92,92",
                                indigo: "75,0,130",
                                ivory: "255,255,240",
                                khaki: "240,230,140",
                                lavenderblush: "255,240,245",
                                lavender: "230,230,250",
                                lawngreen: "124,252,0",
                                lemonchiffon: "255,250,205",
                                lightblue: "173,216,230",
                                lightcoral: "240,128,128",
                                lightcyan: "224,255,255",
                                lightgoldenrodyellow: "250,250,210",
                                lightgray: "211,211,211",
                                lightgrey: "211,211,211",
                                lightgreen: "144,238,144",
                                lightpink: "255,182,193",
                                lightsalmon: "255,160,122",
                                lightseagreen: "32,178,170",
                                lightskyblue: "135,206,250",
                                lightslategray: "119,136,153",
                                lightsteelblue: "176,196,222",
                                lightyellow: "255,255,224",
                                limegreen: "50,205,50",
                                lime: "0,255,0",
                                linen: "250,240,230",
                                magenta: "255,0,255",
                                maroon: "128,0,0",
                                mediumaquamarine: "102,205,170",
                                mediumblue: "0,0,205",
                                mediumorchid: "186,85,211",
                                mediumpurple: "147,112,219",
                                mediumseagreen: "60,179,113",
                                mediumslateblue: "123,104,238",
                                mediumspringgreen: "0,250,154",
                                mediumturquoise: "72,209,204",
                                mediumvioletred: "199,21,133",
                                midnightblue: "25,25,112",
                                mintcream: "245,255,250",
                                mistyrose: "255,228,225",
                                moccasin: "255,228,181",
                                navajowhite: "255,222,173",
                                navy: "0,0,128",
                                oldlace: "253,245,230",
                                olivedrab: "107,142,35",
                                olive: "128,128,0",
                                orangered: "255,69,0",
                                orange: "255,165,0",
                                orchid: "218,112,214",
                                palegoldenrod: "238,232,170",
                                palegreen: "152,251,152",
                                paleturquoise: "175,238,238",
                                palevioletred: "219,112,147",
                                papayawhip: "255,239,213",
                                peachpuff: "255,218,185",
                                peru: "205,133,63",
                                pink: "255,192,203",
                                plum: "221,160,221",
                                powderblue: "176,224,230",
                                purple: "128,0,128",
                                red: "255,0,0",
                                rosybrown: "188,143,143",
                                royalblue: "65,105,225",
                                saddlebrown: "139,69,19",
                                salmon: "250,128,114",
                                sandybrown: "244,164,96",
                                seagreen: "46,139,87",
                                seashell: "255,245,238",
                                sienna: "160,82,45",
                                silver: "192,192,192",
                                skyblue: "135,206,235",
                                slateblue: "106,90,205",
                                slategray: "112,128,144",
                                snow: "255,250,250",
                                springgreen: "0,255,127",
                                steelblue: "70,130,180",
                                tan: "210,180,140",
                                teal: "0,128,128",
                                thistle: "216,191,216",
                                tomato: "255,99,71",
                                turquoise: "64,224,208",
                                violet: "238,130,238",
                                wheat: "245,222,179",
                                whitesmoke: "245,245,245",
                                white: "255,255,255",
                                yellowgreen: "154,205,50",
                                yellow: "255,255,0"
                            }
                        },
                        Hooks: {
                            templates: {
                                textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                                boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                                clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                                backgroundPosition: ["X Y", "0% 0%"],
                                transformOrigin: ["X Y Z", "50% 50% 0px"],
                                perspectiveOrigin: ["X Y", "50% 50%"]
                            },
                            registered: {},
                            register: function() {
                                for (var e = 0; e < v.Lists.colors.length; e++) {
                                    var t = "color" === v.Lists.colors[e] ? "0 0 0 1" : "255 255 255 1";
                                    v.Hooks.templates[v.Lists.colors[e]] = ["Red Green Blue Alpha", t]
                                }
                                var r, a, i;
                                if (n)
                                    for (r in v.Hooks.templates)
                                        if (v.Hooks.templates.hasOwnProperty(r)) {
                                            a = v.Hooks.templates[r],
                                            i = a[0].split(" ");
                                            var o = a[1].match(v.RegEx.valueSplit);
                                            "Color" === i[0] && (i.push(i.shift()),
                                            o.push(o.shift()),
                                            v.Hooks.templates[r] = [i.join(" "), o.join(" ")])
                                        }
                                for (r in v.Hooks.templates)
                                    if (v.Hooks.templates.hasOwnProperty(r))
                                        for (var s in a = v.Hooks.templates[r],
                                        i = a[0].split(" "),
                                        i)
                                            if (i.hasOwnProperty(s)) {
                                                var l = r + i[s]
                                                  , u = s;
                                                v.Hooks.registered[l] = [r, u]
                                            }
                            },
                            getRoot: function(e) {
                                var t = v.Hooks.registered[e];
                                return t ? t[0] : e
                            },
                            getUnit: function(e, t) {
                                var r = (e.substr(t || 0, 5).match(/^[a-z%]+/) || [])[0] || "";
                                return r && u(v.Lists.units, r) ? r : ""
                            },
                            fixColors: function(e) {
                                return e.replace(/(rgba?\(\s*)?(\b[a-z]+\b)/g, (function(e, t, r) {
                                    return v.Lists.colorNames.hasOwnProperty(r) ? (t || "rgba(") + v.Lists.colorNames[r] + (t ? "" : ",1)") : t + r
                                }
                                ))
                            },
                            cleanRootPropertyValue: function(e, t) {
                                return v.RegEx.valueUnwrap.test(t) && (t = t.match(v.RegEx.valueUnwrap)[1]),
                                v.Values.isCSSNullValue(t) && (t = v.Hooks.templates[e][1]),
                                t
                            },
                            extractValue: function(e, t) {
                                var r = v.Hooks.registered[e];
                                if (r) {
                                    var a = r[0]
                                      , n = r[1];
                                    return t = v.Hooks.cleanRootPropertyValue(a, t),
                                    t.toString().match(v.RegEx.valueSplit)[n]
                                }
                                return t
                            },
                            injectValue: function(e, t, r) {
                                var a = v.Hooks.registered[e];
                                if (a) {
                                    var n, i, o = a[0], s = a[1];
                                    return r = v.Hooks.cleanRootPropertyValue(o, r),
                                    n = r.toString().match(v.RegEx.valueSplit),
                                    n[s] = t,
                                    i = n.join(" "),
                                    i
                                }
                                return r
                            }
                        },
                        Normalizations: {
                            registered: {
                                clip: function(e, t, r) {
                                    switch (e) {
                                    case "name":
                                        return "clip";
                                    case "extract":
                                        var a;
                                        return v.RegEx.wrappedValueAlreadyExtracted.test(r) ? a = r : (a = r.toString().match(v.RegEx.valueUnwrap),
                                        a = a ? a[1].replace(/,(\s+)?/g, " ") : r),
                                        a;
                                    case "inject":
                                        return "rect(" + r + ")"
                                    }
                                },
                                blur: function(e, t, r) {
                                    switch (e) {
                                    case "name":
                                        return y.State.isFirefox ? "filter" : "-webkit-filter";
                                    case "extract":
                                        var a = parseFloat(r);
                                        if (!a && 0 !== a) {
                                            var n = r.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                            a = n ? n[1] : 0
                                        }
                                        return a;
                                    case "inject":
                                        return parseFloat(r) ? "blur(" + r + ")" : "none"
                                    }
                                },
                                opacity: function(e, t, r) {
                                    if (n <= 8)
                                        switch (e) {
                                        case "name":
                                            return "filter";
                                        case "extract":
                                            var a = r.toString().match(/alpha\(opacity=(.*)\)/i);
                                            return r = a ? a[1] / 100 : 1,
                                            r;
                                        case "inject":
                                            return t.style.zoom = 1,
                                            parseFloat(r) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(r), 10) + ")"
                                        }
                                    else
                                        switch (e) {
                                        case "name":
                                            return "opacity";
                                        case "extract":
                                            return r;
                                        case "inject":
                                            return r
                                        }
                                }
                            },
                            register: function() {
                                n && !(n > 9) || y.State.isGingerbread || (v.Lists.transformsBase = v.Lists.transformsBase.concat(v.Lists.transforms3D));
                                for (var e = 0; e < v.Lists.transformsBase.length; e++)
                                    (function() {
                                        var t = v.Lists.transformsBase[e];
                                        v.Normalizations.registered[t] = function(e, r, n) {
                                            switch (e) {
                                            case "name":
                                                return "transform";
                                            case "extract":
                                                return S(r) === a || S(r).transformCache[t] === a ? /^scale/i.test(t) ? 1 : 0 : S(r).transformCache[t].replace(/[()]/g, "");
                                            case "inject":
                                                var i = !1;
                                                switch (t.substr(0, t.length - 1)) {
                                                case "translate":
                                                    i = !/(%|px|em|rem|vw|vh|\d)$/i.test(n);
                                                    break;
                                                case "scal":
                                                case "scale":
                                                    y.State.isAndroid && S(r).transformCache[t] === a && n < 1 && (n = 1),
                                                    i = !/(\d)$/i.test(n);
                                                    break;
                                                case "skew":
                                                    i = !/(deg|\d)$/i.test(n);
                                                    break;
                                                case "rotate":
                                                    i = !/(deg|\d)$/i.test(n);
                                                    break
                                                }
                                                return i || (S(r).transformCache[t] = "(" + n + ")"),
                                                S(r).transformCache[t]
                                            }
                                        }
                                    }
                                    )();
                                for (var t = 0; t < v.Lists.colors.length; t++)
                                    (function() {
                                        var e = v.Lists.colors[t];
                                        v.Normalizations.registered[e] = function(t, r, i) {
                                            switch (t) {
                                            case "name":
                                                return e;
                                            case "extract":
                                                var o;
                                                if (v.RegEx.wrappedValueAlreadyExtracted.test(i))
                                                    o = i;
                                                else {
                                                    var s, l = {
                                                        black: "rgb(0, 0, 0)",
                                                        blue: "rgb(0, 0, 255)",
                                                        gray: "rgb(128, 128, 128)",
                                                        green: "rgb(0, 128, 0)",
                                                        red: "rgb(255, 0, 0)",
                                                        white: "rgb(255, 255, 255)"
                                                    };
                                                    /^[A-z]+$/i.test(i) ? s = l[i] !== a ? l[i] : l.black : v.RegEx.isHex.test(i) ? s = "rgb(" + v.Values.hexToRgb(i).join(" ") + ")" : /^rgba?\(/i.test(i) || (s = l.black),
                                                    o = (s || i).toString().match(v.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                                }
                                                return (!n || n > 8) && 3 === o.split(" ").length && (o += " 1"),
                                                o;
                                            case "inject":
                                                return /^rgb/.test(i) ? i : (n <= 8 ? 4 === i.split(" ").length && (i = i.split(/\s+/).slice(0, 3).join(" ")) : 3 === i.split(" ").length && (i += " 1"),
                                                (n <= 8 ? "rgb" : "rgba") + "(" + i.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")")
                                            }
                                        }
                                    }
                                    )();
                                function r(e, t, r) {
                                    var a = "border-box" === v.getPropertyValue(t, "boxSizing").toString().toLowerCase();
                                    if (a === (r || !1)) {
                                        var n, i, o = 0, s = "width" === e ? ["Left", "Right"] : ["Top", "Bottom"], l = ["padding" + s[0], "padding" + s[1], "border" + s[0] + "Width", "border" + s[1] + "Width"];
                                        for (n = 0; n < l.length; n++)
                                            i = parseFloat(v.getPropertyValue(t, l[n])),
                                            isNaN(i) || (o += i);
                                        return r ? -o : o
                                    }
                                    return 0
                                }
                                function i(e, t) {
                                    return function(a, n, i) {
                                        switch (a) {
                                        case "name":
                                            return e;
                                        case "extract":
                                            return parseFloat(i) + r(e, n, t);
                                        case "inject":
                                            return parseFloat(i) - r(e, n, t) + "px"
                                        }
                                    }
                                }
                                v.Normalizations.registered.innerWidth = i("width", !0),
                                v.Normalizations.registered.innerHeight = i("height", !0),
                                v.Normalizations.registered.outerWidth = i("width"),
                                v.Normalizations.registered.outerHeight = i("height")
                            }
                        },
                        Names: {
                            camelCase: function(e) {
                                return e.replace(/-(\w)/g, (function(e, t) {
                                    return t.toUpperCase()
                                }
                                ))
                            },
                            SVGAttribute: function(e) {
                                var t = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                                return (n || y.State.isAndroid && !y.State.isChrome) && (t += "|transform"),
                                new RegExp("^(" + t + ")$","i").test(e)
                            },
                            prefixCheck: function(e) {
                                if (y.State.prefixMatches[e])
                                    return [y.State.prefixMatches[e], !0];
                                for (var t = ["", "Webkit", "Moz", "ms", "O"], r = 0, a = t.length; r < a; r++) {
                                    var n;
                                    if (n = 0 === r ? e : t[r] + e.replace(/^\w/, (function(e) {
                                        return e.toUpperCase()
                                    }
                                    )),
                                    d.isString(y.State.prefixElement.style[n]))
                                        return y.State.prefixMatches[e] = n,
                                        [n, !0]
                                }
                                return [e, !1]
                            }
                        },
                        Values: {
                            hexToRgb: function(e) {
                                var t, r = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
                                return e = e.replace(r, (function(e, t, r, a) {
                                    return t + t + r + r + a + a
                                }
                                )),
                                t = a.exec(e),
                                t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : [0, 0, 0]
                            },
                            isCSSNullValue: function(e) {
                                return !e || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)
                            },
                            getUnitType: function(e) {
                                return /^(rotate|skew)/i.test(e) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e) ? "" : "px"
                            },
                            getDisplayType: function(e) {
                                var t = e && e.tagName.toString().toLowerCase();
                                return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t) ? "inline" : /^(li)$/i.test(t) ? "list-item" : /^(tr)$/i.test(t) ? "table-row" : /^(table)$/i.test(t) ? "table" : /^(tbody)$/i.test(t) ? "table-row-group" : "block"
                            },
                            addClass: function(e, t) {
                                if (e)
                                    if (e.classList)
                                        e.classList.add(t);
                                    else if (d.isString(e.className))
                                        e.className += (e.className.length ? " " : "") + t;
                                    else {
                                        var r = e.getAttribute(n <= 7 ? "className" : "class") || "";
                                        e.setAttribute("class", r + (r ? " " : "") + t)
                                    }
                            },
                            removeClass: function(e, t) {
                                if (e)
                                    if (e.classList)
                                        e.classList.remove(t);
                                    else if (d.isString(e.className))
                                        e.className = e.className.toString().replace(new RegExp("(^|\\s)" + t.split(" ").join("|") + "(\\s|$)","gi"), " ");
                                    else {
                                        var r = e.getAttribute(n <= 7 ? "className" : "class") || "";
                                        e.setAttribute("class", r.replace(new RegExp("(^|s)" + t.split(" ").join("|") + "(s|$)","gi"), " "))
                                    }
                            }
                        },
                        getPropertyValue: function(e, r, i, o) {
                            function s(e, r) {
                                var i = 0;
                                if (n <= 8)
                                    i = p.css(e, r);
                                else {
                                    var l = !1;
                                    /^(width|height)$/.test(r) && 0 === v.getPropertyValue(e, "display") && (l = !0,
                                    v.setPropertyValue(e, "display", v.Values.getDisplayType(e)));
                                    var u, c = function() {
                                        l && v.setPropertyValue(e, "display", "none")
                                    };
                                    if (!o) {
                                        if ("height" === r && "border-box" !== v.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                            var d = e.offsetHeight - (parseFloat(v.getPropertyValue(e, "borderTopWidth")) || 0) - (parseFloat(v.getPropertyValue(e, "borderBottomWidth")) || 0) - (parseFloat(v.getPropertyValue(e, "paddingTop")) || 0) - (parseFloat(v.getPropertyValue(e, "paddingBottom")) || 0);
                                            return c(),
                                            d
                                        }
                                        if ("width" === r && "border-box" !== v.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                            var f = e.offsetWidth - (parseFloat(v.getPropertyValue(e, "borderLeftWidth")) || 0) - (parseFloat(v.getPropertyValue(e, "borderRightWidth")) || 0) - (parseFloat(v.getPropertyValue(e, "paddingLeft")) || 0) - (parseFloat(v.getPropertyValue(e, "paddingRight")) || 0);
                                            return c(),
                                            f
                                        }
                                    }
                                    u = S(e) === a ? t.getComputedStyle(e, null) : S(e).computedStyle ? S(e).computedStyle : S(e).computedStyle = t.getComputedStyle(e, null),
                                    "borderColor" === r && (r = "borderTopColor"),
                                    i = 9 === n && "filter" === r ? u.getPropertyValue(r) : u[r],
                                    "" !== i && null !== i || (i = e.style[r]),
                                    c()
                                }
                                if ("auto" === i && /^(top|right|bottom|left)$/i.test(r)) {
                                    var g = s(e, "position");
                                    ("fixed" === g || "absolute" === g && /top|left/i.test(r)) && (i = p(e).position()[r] + "px")
                                }
                                return i
                            }
                            var l;
                            if (v.Hooks.registered[r]) {
                                var u = r
                                  , c = v.Hooks.getRoot(u);
                                i === a && (i = v.getPropertyValue(e, v.Names.prefixCheck(c)[0])),
                                v.Normalizations.registered[c] && (i = v.Normalizations.registered[c]("extract", e, i)),
                                l = v.Hooks.extractValue(u, i)
                            } else if (v.Normalizations.registered[r]) {
                                var d, f;
                                d = v.Normalizations.registered[r]("name", e),
                                "transform" !== d && (f = s(e, v.Names.prefixCheck(d)[0]),
                                v.Values.isCSSNullValue(f) && v.Hooks.templates[r] && (f = v.Hooks.templates[r][1])),
                                l = v.Normalizations.registered[r]("extract", e, f)
                            }
                            if (!/^[\d-]/.test(l)) {
                                var g = S(e);
                                if (g && g.isSVG && v.Names.SVGAttribute(r))
                                    if (/^(height|width)$/i.test(r))
                                        try {
                                            l = e.getBBox()[r]
                                        } catch (m) {
                                            l = 0
                                        }
                                    else
                                        l = e.getAttribute(r);
                                else
                                    l = s(e, v.Names.prefixCheck(r)[0])
                            }
                            return v.Values.isCSSNullValue(l) && (l = 0),
                            y.debug >= 2 && console.log("Get " + r + ": " + l),
                            l
                        },
                        setPropertyValue: function(e, r, a, i, o) {
                            var s = r;
                            if ("scroll" === r)
                                o.container ? o.container["scroll" + o.direction] = a : "Left" === o.direction ? t.scrollTo(a, o.alternateValue) : t.scrollTo(o.alternateValue, a);
                            else if (v.Normalizations.registered[r] && "transform" === v.Normalizations.registered[r]("name", e))
                                v.Normalizations.registered[r]("inject", e, a),
                                s = "transform",
                                a = S(e).transformCache[r];
                            else {
                                if (v.Hooks.registered[r]) {
                                    var l = r
                                      , u = v.Hooks.getRoot(r);
                                    i = i || v.getPropertyValue(e, u),
                                    a = v.Hooks.injectValue(l, a, i),
                                    r = u
                                }
                                if (v.Normalizations.registered[r] && (a = v.Normalizations.registered[r]("inject", e, a),
                                r = v.Normalizations.registered[r]("name", e)),
                                s = v.Names.prefixCheck(r)[0],
                                n <= 8)
                                    try {
                                        e.style[s] = a
                                    } catch (p) {
                                        y.debug && console.log("Browser does not support [" + a + "] for [" + s + "]")
                                    }
                                else {
                                    var c = S(e);
                                    c && c.isSVG && v.Names.SVGAttribute(r) ? e.setAttribute(r, a) : e.style[s] = a
                                }
                                y.debug >= 2 && console.log("Set " + r + " (" + s + "): " + a)
                            }
                            return [s, a]
                        },
                        flushTransformCache: function(e) {
                            var t = ""
                              , r = S(e);
                            if ((n || y.State.isAndroid && !y.State.isChrome) && r && r.isSVG) {
                                var a = function(t) {
                                    return parseFloat(v.getPropertyValue(e, t))
                                }
                                  , i = {
                                    translate: [a("translateX"), a("translateY")],
                                    skewX: [a("skewX")],
                                    skewY: [a("skewY")],
                                    scale: 1 !== a("scale") ? [a("scale"), a("scale")] : [a("scaleX"), a("scaleY")],
                                    rotate: [a("rotateZ"), 0, 0]
                                };
                                p.each(S(e).transformCache, (function(e) {
                                    /^translate/i.test(e) ? e = "translate" : /^scale/i.test(e) ? e = "scale" : /^rotate/i.test(e) && (e = "rotate"),
                                    i[e] && (t += e + "(" + i[e].join(" ") + ") ",
                                    delete i[e])
                                }
                                ))
                            } else {
                                var o, s;
                                p.each(S(e).transformCache, (function(r) {
                                    if (o = S(e).transformCache[r],
                                    "transformPerspective" === r)
                                        return s = o,
                                        !0;
                                    9 === n && "rotateZ" === r && (r = "rotate"),
                                    t += r + o + " "
                                }
                                )),
                                s && (t = "perspective" + s + " " + t)
                            }
                            v.setPropertyValue(e, "transform", t)
                        }
                    };
                    v.Hooks.register(),
                    v.Normalizations.register(),
                    y.hook = function(e, t, r) {
                        var n;
                        return e = c(e),
                        p.each(e, (function(e, i) {
                            if (S(i) === a && y.init(i),
                            r === a)
                                n === a && (n = v.getPropertyValue(i, t));
                            else {
                                var o = v.setPropertyValue(i, t, r);
                                "transform" === o[0] && y.CSS.flushTransformCache(i),
                                n = o
                            }
                        }
                        )),
                        n
                    }
                    ;
                    var b = function() {
                        var e;
                        function n() {
                            return i ? w.promise || null : o
                        }
                        var i, o, s, l, f, m, h = arguments[0] && (arguments[0].p || p.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || d.isString(arguments[0].properties));
                        d.isWrapped(this) ? (i = !1,
                        s = 0,
                        l = this,
                        o = this) : (i = !0,
                        s = 1,
                        l = h ? arguments[0].elements || arguments[0].e : arguments[0]);
                        var w = {
                            promise: null,
                            resolver: null,
                            rejecter: null
                        };
                        if (i && y.Promise && (w.promise = new y.Promise((function(e, t) {
                            w.resolver = e,
                            w.rejecter = t
                        }
                        ))),
                        h ? (f = arguments[0].properties || arguments[0].p,
                        m = arguments[0].options || arguments[0].o) : (f = arguments[s],
                        m = arguments[s + 1]),
                        l = c(l),
                        l) {
                            var x, V = l.length, T = 0;
                            if (!/^(stop|finish|finishAll|pause|resume)$/i.test(f) && !p.isPlainObject(m)) {
                                var E = s + 1;
                                m = {};
                                for (var N = E; N < arguments.length; N++)
                                    d.isArray(arguments[N]) || !/^(fast|normal|slow)$/i.test(arguments[N]) && !/^\d/.test(arguments[N]) ? d.isString(arguments[N]) || d.isArray(arguments[N]) ? m.easing = arguments[N] : d.isFunction(arguments[N]) && (m.complete = arguments[N]) : m.duration = arguments[N]
                            }
                            switch (f) {
                            case "scroll":
                                x = "scroll";
                                break;
                            case "reverse":
                                x = "reverse";
                                break;
                            case "pause":
                                var H = (new Date).getTime();
                                return p.each(l, (function(e, t) {
                                    k(t, H)
                                }
                                )),
                                p.each(y.State.calls, (function(e, t) {
                                    var r = !1;
                                    t && p.each(t[1], (function(e, n) {
                                        var i = m === a ? "" : m;
                                        return !0 !== i && t[2].queue !== i && (m !== a || !1 !== t[2].queue) || (p.each(l, (function(e, a) {
                                            if (a === n)
                                                return t[5] = {
                                                    resume: !1
                                                },
                                                r = !0,
                                                !1
                                        }
                                        )),
                                        !r && void 0)
                                    }
                                    ))
                                }
                                )),
                                n();
                            case "resume":
                                return p.each(l, (function(e, t) {
                                    P(t, H)
                                }
                                )),
                                p.each(y.State.calls, (function(e, t) {
                                    var r = !1;
                                    t && p.each(t[1], (function(e, n) {
                                        var i = m === a ? "" : m;
                                        return !0 !== i && t[2].queue !== i && (m !== a || !1 !== t[2].queue) || (!t[5] || (p.each(l, (function(e, a) {
                                            if (a === n)
                                                return t[5].resume = !0,
                                                r = !0,
                                                !1
                                        }
                                        )),
                                        !r && void 0))
                                    }
                                    ))
                                }
                                )),
                                n();
                            case "finish":
                            case "finishAll":
                            case "stop":
                                p.each(l, (function(e, t) {
                                    S(t) && S(t).delayTimer && (clearTimeout(S(t).delayTimer.setTimeout),
                                    S(t).delayTimer.next && S(t).delayTimer.next(),
                                    delete S(t).delayTimer),
                                    "finishAll" !== f || !0 !== m && !d.isString(m) || (p.each(p.queue(t, d.isString(m) ? m : ""), (function(e, t) {
                                        d.isFunction(t) && t()
                                    }
                                    )),
                                    p.queue(t, d.isString(m) ? m : "", []))
                                }
                                ));
                                var L = [];
                                return p.each(y.State.calls, (function(e, t) {
                                    t && p.each(t[1], (function(r, n) {
                                        var i = m === a ? "" : m;
                                        if (!0 !== i && t[2].queue !== i && (m !== a || !1 !== t[2].queue))
                                            return !0;
                                        p.each(l, (function(r, a) {
                                            if (a === n)
                                                if ((!0 === m || d.isString(m)) && (p.each(p.queue(a, d.isString(m) ? m : ""), (function(e, t) {
                                                    d.isFunction(t) && t(null, !0)
                                                }
                                                )),
                                                p.queue(a, d.isString(m) ? m : "", [])),
                                                "stop" === f) {
                                                    var o = S(a);
                                                    o && o.tweensContainer && (!0 === i || "" === i) && p.each(o.tweensContainer, (function(e, t) {
                                                        t.endValue = t.currentValue
                                                    }
                                                    )),
                                                    L.push(e)
                                                } else
                                                    "finish" !== f && "finishAll" !== f || (t[2].duration = 1)
                                        }
                                        ))
                                    }
                                    ))
                                }
                                )),
                                "stop" === f && (p.each(L, (function(e, t) {
                                    A(t, !0)
                                }
                                )),
                                w.promise && w.resolver(l)),
                                n();
                            default:
                                if (!p.isPlainObject(f) || d.isEmptyObject(f)) {
                                    if (d.isString(f) && y.Redirects[f]) {
                                        e = p.extend({}, m);
                                        var O = e.duration
                                          , q = e.delay || 0;
                                        return !0 === e.backwards && (l = p.extend(!0, [], l).reverse()),
                                        p.each(l, (function(t, r) {
                                            parseFloat(e.stagger) ? e.delay = q + parseFloat(e.stagger) * t : d.isFunction(e.stagger) && (e.delay = q + e.stagger.call(r, t, V)),
                                            e.drag && (e.duration = parseFloat(O) || (/^(callout|transition)/.test(f) ? 1e3 : g),
                                            e.duration = Math.max(e.duration * (e.backwards ? 1 - t / V : (t + 1) / V), .75 * e.duration, 200)),
                                            y.Redirects[f].call(r, r, e || {}, t, V, l, w.promise ? w : a)
                                        }
                                        )),
                                        n()
                                    }
                                    var j = "Velocity: First argument (" + f + ") was not a property map, a known action, or a registered redirect. Aborting.";
                                    return w.promise ? w.rejecter(new Error(j)) : t.console && console.log(j),
                                    n()
                                }
                                x = "start"
                            }
                            var z = {
                                lastParent: null,
                                lastPosition: null,
                                lastFontSize: null,
                                lastPercentToPxWidth: null,
                                lastPercentToPxHeight: null,
                                lastEmToPx: null,
                                remToPx: null,
                                vwToPx: null,
                                vhToPx: null
                            }
                              , _ = [];
                            p.each(l, (function(e, t) {
                                d.isNode(t) && M(t, e)
                            }
                            )),
                            e = p.extend({}, y.defaults, m),
                            e.loop = parseInt(e.loop, 10);
                            var R = 2 * e.loop - 1;
                            if (e.loop)
                                for (var $ = 0; $ < R; $++) {
                                    var B = {
                                        delay: e.delay,
                                        progress: e.progress
                                    };
                                    $ === R - 1 && (B.display = e.display,
                                    B.visibility = e.visibility,
                                    B.complete = e.complete),
                                    b(l, "reverse", B)
                                }
                            return n()
                        }
                        function M(e, n) {
                            var i, o = p.extend({}, y.defaults, m), s = {};
                            switch (S(e) === a && y.init(e),
                            parseFloat(o.delay) && !1 !== o.queue && p.queue(e, o.queue, (function(t, r) {
                                if (!0 === r)
                                    return !0;
                                y.velocityQueueEntryFlag = !0;
                                var a = y.State.delayedElements.count++;
                                y.State.delayedElements[a] = e;
                                var n = function(e) {
                                    return function() {
                                        y.State.delayedElements[e] = !1,
                                        t()
                                    }
                                }(a);
                                S(e).delayBegin = (new Date).getTime(),
                                S(e).delay = parseFloat(o.delay),
                                S(e).delayTimer = {
                                    setTimeout: setTimeout(t, parseFloat(o.delay)),
                                    next: n
                                }
                            }
                            )),
                            o.duration.toString().toLowerCase()) {
                            case "fast":
                                o.duration = 200;
                                break;
                            case "normal":
                                o.duration = g;
                                break;
                            case "slow":
                                o.duration = 600;
                                break;
                            default:
                                o.duration = parseFloat(o.duration) || 1
                            }
                            function c(c) {
                                var g, h;
                                if (o.begin && 0 === T)
                                    try {
                                        o.begin.call(l, l)
                                    } catch (Q) {
                                        setTimeout((function() {
                                            throw Q
                                        }
                                        ), 1)
                                    }
                                if ("scroll" === x) {
                                    var b, k, P, A = /^x$/i.test(o.axis) ? "Left" : "Top", E = parseFloat(o.offset) || 0;
                                    o.container ? d.isWrapped(o.container) || d.isNode(o.container) ? (o.container = o.container[0] || o.container,
                                    b = o.container["scroll" + A],
                                    P = b + p(e).position()[A.toLowerCase()] + E) : o.container = null : (b = y.State.scrollAnchor[y.State["scrollProperty" + A]],
                                    k = y.State.scrollAnchor[y.State["scrollProperty" + ("Left" === A ? "Top" : "Left")]],
                                    P = p(e).offset()[A.toLowerCase()] + E),
                                    s = {
                                        scroll: {
                                            rootPropertyValue: !1,
                                            startValue: b,
                                            currentValue: b,
                                            endValue: P,
                                            unitType: "",
                                            easing: o.easing,
                                            scrollData: {
                                                container: o.container,
                                                direction: A,
                                                alternateValue: k
                                            }
                                        },
                                        element: e
                                    },
                                    y.debug && console.log("tweensContainer (scroll): ", s.scroll, e)
                                } else if ("reverse" === x) {
                                    if (g = S(e),
                                    !g)
                                        return;
                                    if (!g.tweensContainer)
                                        return void p.dequeue(e, o.queue);
                                    for (var N in "none" === g.opts.display && (g.opts.display = "auto"),
                                    "hidden" === g.opts.visibility && (g.opts.visibility = "visible"),
                                    g.opts.loop = !1,
                                    g.opts.begin = null,
                                    g.opts.complete = null,
                                    m.easing || delete o.easing,
                                    m.duration || delete o.duration,
                                    o = p.extend({}, g.opts, o),
                                    h = p.extend(!0, {}, g ? g.tweensContainer : null),
                                    h)
                                        if (h.hasOwnProperty(N) && "element" !== N) {
                                            var H = h[N].startValue;
                                            h[N].startValue = h[N].currentValue = h[N].endValue,
                                            h[N].endValue = H,
                                            d.isEmptyObject(m) || (h[N].easing = o.easing),
                                            y.debug && console.log("reverse tweensContainer (" + N + "): " + JSON.stringify(h[N]), e)
                                        }
                                    s = h
                                } else if ("start" === x) {
                                    g = S(e),
                                    g && g.tweensContainer && !0 === g.isAnimating && (h = g.tweensContainer);
                                    var L = function(t, r) {
                                        var a, i, s;
                                        return d.isFunction(t) && (t = t.call(e, n, V)),
                                        d.isArray(t) ? (a = t[0],
                                        !d.isArray(t[1]) && /^[\d-]/.test(t[1]) || d.isFunction(t[1]) || v.RegEx.isHex.test(t[1]) ? s = t[1] : d.isString(t[1]) && !v.RegEx.isHex.test(t[1]) && y.Easings[t[1]] || d.isArray(t[1]) ? (i = r ? t[1] : C(t[1], o.duration),
                                        s = t[2]) : s = t[1] || t[2]) : a = t,
                                        r || (i = i || o.easing),
                                        d.isFunction(a) && (a = a.call(e, n, V)),
                                        d.isFunction(s) && (s = s.call(e, n, V)),
                                        [a || 0, i, s]
                                    }
                                      , O = function(n, l) {
                                        var u, c = v.Hooks.getRoot(n), f = !1, m = l[0], b = l[1], w = l[2];
                                        if (g && g.isSVG || "tween" === c || !1 !== v.Names.prefixCheck(c)[1] || v.Normalizations.registered[c] !== a) {
                                            (o.display !== a && null !== o.display && "none" !== o.display || o.visibility !== a && "hidden" !== o.visibility) && /opacity|filter/.test(n) && !w && 0 !== m && (w = 0),
                                            o._cacheValues && h && h[n] ? (w === a && (w = h[n].endValue + h[n].unitType),
                                            f = g.rootPropertyValueCache[c]) : v.Hooks.registered[n] ? w === a ? (f = v.getPropertyValue(e, c),
                                            w = v.getPropertyValue(e, n, f)) : f = v.Hooks.templates[c][1] : w === a && (w = v.getPropertyValue(e, n));
                                            var x, S, k, P = !1, V = function(e, t) {
                                                var r, a;
                                                return a = (t || "0").toString().toLowerCase().replace(/[%A-z]+$/, (function(e) {
                                                    return r = e,
                                                    ""
                                                }
                                                )),
                                                r || (r = v.Values.getUnitType(e)),
                                                [a, r]
                                            };
                                            if (w !== m && d.isString(w) && d.isString(m)) {
                                                u = "";
                                                var T = 0
                                                  , C = 0
                                                  , F = []
                                                  , A = []
                                                  , E = 0
                                                  , N = 0
                                                  , H = 0;
                                                w = v.Hooks.fixColors(w),
                                                m = v.Hooks.fixColors(m);
                                                while (T < w.length && C < m.length) {
                                                    var L = w[T]
                                                      , O = m[C];
                                                    if (/[\d\.-]/.test(L) && /[\d\.-]/.test(O)) {
                                                        var q = L
                                                          , j = O
                                                          , _ = "."
                                                          , R = ".";
                                                        while (++T < w.length) {
                                                            if (L = w[T],
                                                            L === _)
                                                                _ = "..";
                                                            else if (!/\d/.test(L))
                                                                break;
                                                            q += L
                                                        }
                                                        while (++C < m.length) {
                                                            if (O = m[C],
                                                            O === R)
                                                                R = "..";
                                                            else if (!/\d/.test(O))
                                                                break;
                                                            j += O
                                                        }
                                                        var $ = v.Hooks.getUnit(w, T)
                                                          , B = v.Hooks.getUnit(m, C);
                                                        if (T += $.length,
                                                        C += B.length,
                                                        $ === B)
                                                            q === j ? u += q + $ : (u += "{" + F.length + (N ? "!" : "") + "}" + $,
                                                            F.push(parseFloat(q)),
                                                            A.push(parseFloat(j)));
                                                        else {
                                                            var M = parseFloat(q)
                                                              , W = parseFloat(j);
                                                            u += (E < 5 ? "calc" : "") + "(" + (M ? "{" + F.length + (N ? "!" : "") + "}" : "0") + $ + " + " + (W ? "{" + (F.length + (M ? 1 : 0)) + (N ? "!" : "") + "}" : "0") + B + ")",
                                                            M && (F.push(M),
                                                            A.push(0)),
                                                            W && (F.push(0),
                                                            A.push(W))
                                                        }
                                                    } else {
                                                        if (L !== O) {
                                                            E = 0;
                                                            break
                                                        }
                                                        u += L,
                                                        T++,
                                                        C++,
                                                        0 === E && "c" === L || 1 === E && "a" === L || 2 === E && "l" === L || 3 === E && "c" === L || E >= 4 && "(" === L ? E++ : (E && E < 5 || E >= 4 && ")" === L && --E < 5) && (E = 0),
                                                        0 === N && "r" === L || 1 === N && "g" === L || 2 === N && "b" === L || 3 === N && "a" === L || N >= 3 && "(" === L ? (3 === N && "a" === L && (H = 1),
                                                        N++) : H && "," === L ? ++H > 3 && (N = H = 0) : (H && N < (H ? 5 : 4) || N >= (H ? 4 : 3) && ")" === L && --N < (H ? 5 : 4)) && (N = H = 0)
                                                    }
                                                }
                                                T === w.length && C === m.length || (y.debug && console.error('Trying to pattern match mis-matched strings ["' + m + '", "' + w + '"]'),
                                                u = a),
                                                u && (F.length ? (y.debug && console.log('Pattern found "' + u + '" -> ', F, A, "[" + w + "," + m + "]"),
                                                w = F,
                                                m = A,
                                                S = k = "") : u = a)
                                            }
                                            u || (x = V(n, w),
                                            w = x[0],
                                            k = x[1],
                                            x = V(n, m),
                                            m = x[0].replace(/^([+-\/*])=/, (function(e, t) {
                                                return P = t,
                                                ""
                                            }
                                            )),
                                            S = x[1],
                                            w = parseFloat(w) || 0,
                                            m = parseFloat(m) || 0,
                                            "%" === S && (/^(fontSize|lineHeight)$/.test(n) ? (m /= 100,
                                            S = "em") : /^scale/.test(n) ? (m /= 100,
                                            S = "") : /(Red|Green|Blue)$/i.test(n) && (m = m / 100 * 255,
                                            S = "")));
                                            var I = function() {
                                                var a = {
                                                    myParent: e.parentNode || r.body,
                                                    position: v.getPropertyValue(e, "position"),
                                                    fontSize: v.getPropertyValue(e, "fontSize")
                                                }
                                                  , n = a.position === z.lastPosition && a.myParent === z.lastParent
                                                  , i = a.fontSize === z.lastFontSize;
                                                z.lastParent = a.myParent,
                                                z.lastPosition = a.position,
                                                z.lastFontSize = a.fontSize;
                                                var o = 100
                                                  , s = {};
                                                if (i && n)
                                                    s.emToPx = z.lastEmToPx,
                                                    s.percentToPxWidth = z.lastPercentToPxWidth,
                                                    s.percentToPxHeight = z.lastPercentToPxHeight;
                                                else {
                                                    var l = g && g.isSVG ? r.createElementNS("http://www.w3.org/2000/svg", "rect") : r.createElement("div");
                                                    y.init(l),
                                                    a.myParent.appendChild(l),
                                                    p.each(["overflow", "overflowX", "overflowY"], (function(e, t) {
                                                        y.CSS.setPropertyValue(l, t, "hidden")
                                                    }
                                                    )),
                                                    y.CSS.setPropertyValue(l, "position", a.position),
                                                    y.CSS.setPropertyValue(l, "fontSize", a.fontSize),
                                                    y.CSS.setPropertyValue(l, "boxSizing", "content-box"),
                                                    p.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], (function(e, t) {
                                                        y.CSS.setPropertyValue(l, t, o + "%")
                                                    }
                                                    )),
                                                    y.CSS.setPropertyValue(l, "paddingLeft", o + "em"),
                                                    s.percentToPxWidth = z.lastPercentToPxWidth = (parseFloat(v.getPropertyValue(l, "width", null, !0)) || 1) / o,
                                                    s.percentToPxHeight = z.lastPercentToPxHeight = (parseFloat(v.getPropertyValue(l, "height", null, !0)) || 1) / o,
                                                    s.emToPx = z.lastEmToPx = (parseFloat(v.getPropertyValue(l, "paddingLeft")) || 1) / o,
                                                    a.myParent.removeChild(l)
                                                }
                                                return null === z.remToPx && (z.remToPx = parseFloat(v.getPropertyValue(r.body, "fontSize")) || 16),
                                                null === z.vwToPx && (z.vwToPx = parseFloat(t.innerWidth) / 100,
                                                z.vhToPx = parseFloat(t.innerHeight) / 100),
                                                s.remToPx = z.remToPx,
                                                s.vwToPx = z.vwToPx,
                                                s.vhToPx = z.vhToPx,
                                                y.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(s), e),
                                                s
                                            };
                                            if (/[\/*]/.test(P))
                                                S = k;
                                            else if (k !== S && 0 !== w)
                                                if (0 === m)
                                                    S = k;
                                                else {
                                                    i = i || I();
                                                    var D = /margin|padding|left|right|width|text|word|letter/i.test(n) || /X$/.test(n) || "x" === n ? "x" : "y";
                                                    switch (k) {
                                                    case "%":
                                                        w *= "x" === D ? i.percentToPxWidth : i.percentToPxHeight;
                                                        break;
                                                    case "px":
                                                        break;
                                                    default:
                                                        w *= i[k + "ToPx"]
                                                    }
                                                    switch (S) {
                                                    case "%":
                                                        w *= 1 / ("x" === D ? i.percentToPxWidth : i.percentToPxHeight);
                                                        break;
                                                    case "px":
                                                        break;
                                                    default:
                                                        w *= 1 / i[S + "ToPx"]
                                                    }
                                                }
                                            switch (P) {
                                            case "+":
                                                m = w + m;
                                                break;
                                            case "-":
                                                m = w - m;
                                                break;
                                            case "*":
                                                m *= w;
                                                break;
                                            case "/":
                                                m = w / m;
                                                break
                                            }
                                            s[n] = {
                                                rootPropertyValue: f,
                                                startValue: w,
                                                currentValue: w,
                                                endValue: m,
                                                unitType: S,
                                                easing: b
                                            },
                                            u && (s[n].pattern = u),
                                            y.debug && console.log("tweensContainer (" + n + "): " + JSON.stringify(s[n]), e)
                                        } else
                                            y.debug && console.log("Skipping [" + c + "] due to a lack of browser support.")
                                    };
                                    for (var q in f)
                                        if (f.hasOwnProperty(q)) {
                                            var j = v.Names.camelCase(q)
                                              , R = L(f[q]);
                                            if (u(v.Lists.colors, j)) {
                                                var $ = R[0]
                                                  , B = R[1]
                                                  , M = R[2];
                                                if (v.RegEx.isHex.test($)) {
                                                    for (var W = ["Red", "Green", "Blue"], I = v.Values.hexToRgb($), D = M ? v.Values.hexToRgb(M) : a, G = 0; G < W.length; G++) {
                                                        var U = [I[G]];
                                                        B && U.push(B),
                                                        D !== a && U.push(D[G]),
                                                        O(j + W[G], U)
                                                    }
                                                    continue
                                                }
                                            }
                                            O(j, R)
                                        }
                                    s.element = e
                                }
                                s.element && (v.Values.addClass(e, "velocity-animating"),
                                _.push(s),
                                g = S(e),
                                g && ("" === o.queue && (g.tweensContainer = s,
                                g.opts = o),
                                g.isAnimating = !0),
                                T === V - 1 ? (y.State.calls.push([_, l, o, null, w.resolver, null, 0]),
                                !1 === y.State.isTicking && (y.State.isTicking = !0,
                                F())) : T++)
                            }
                            if (!1 !== y.mock && (!0 === y.mock ? o.duration = o.delay = 1 : (o.duration *= parseFloat(y.mock) || 1,
                            o.delay *= parseFloat(y.mock) || 1)),
                            o.easing = C(o.easing, o.duration),
                            o.begin && !d.isFunction(o.begin) && (o.begin = null),
                            o.progress && !d.isFunction(o.progress) && (o.progress = null),
                            o.complete && !d.isFunction(o.complete) && (o.complete = null),
                            o.display !== a && null !== o.display && (o.display = o.display.toString().toLowerCase(),
                            "auto" === o.display && (o.display = y.CSS.Values.getDisplayType(e))),
                            o.visibility !== a && null !== o.visibility && (o.visibility = o.visibility.toString().toLowerCase()),
                            o.mobileHA = o.mobileHA && y.State.isMobile && !y.State.isGingerbread,
                            !1 === o.queue)
                                if (o.delay) {
                                    var h = y.State.delayedElements.count++;
                                    y.State.delayedElements[h] = e;
                                    var b = function(e) {
                                        return function() {
                                            y.State.delayedElements[e] = !1,
                                            c()
                                        }
                                    }(h);
                                    S(e).delayBegin = (new Date).getTime(),
                                    S(e).delay = parseFloat(o.delay),
                                    S(e).delayTimer = {
                                        setTimeout: setTimeout(c, parseFloat(o.delay)),
                                        next: b
                                    }
                                } else
                                    c();
                            else
                                p.queue(e, o.queue, (function(e, t) {
                                    if (!0 === t)
                                        return w.promise && w.resolver(l),
                                        !0;
                                    y.velocityQueueEntryFlag = !0,
                                    c(e)
                                }
                                ));
                            "" !== o.queue && "fx" !== o.queue || "inprogress" === p.queue(e)[0] || p.dequeue(e)
                        }
                        w.promise && (f && m && !1 === m.promiseRejectEmpty ? w.resolver() : w.rejecter())
                    };
                    y = p.extend(b, y),
                    y.animate = b;
                    var w = t.requestAnimationFrame || i;
                    if (!y.State.isMobile && r.hidden !== a) {
                        var x = function() {
                            r.hidden ? (w = function(e) {
                                return setTimeout((function() {
                                    e(!0)
                                }
                                ), 16)
                            }
                            ,
                            F()) : w = t.requestAnimationFrame || i
                        };
                        x(),
                        r.addEventListener("visibilitychange", x)
                    }
                    return e.Velocity = y,
                    e !== t && (e.fn.velocity = b,
                    e.fn.velocity.defaults = y.defaults),
                    p.each(["Down", "Up"], (function(e, t) {
                        y.Redirects["slide" + t] = function(e, r, n, i, o, s) {
                            var l = p.extend({}, r)
                              , u = l.begin
                              , c = l.complete
                              , d = {}
                              , f = {
                                height: "",
                                marginTop: "",
                                marginBottom: "",
                                paddingTop: "",
                                paddingBottom: ""
                            };
                            l.display === a && (l.display = "Down" === t ? "inline" === y.CSS.Values.getDisplayType(e) ? "inline-block" : "block" : "none"),
                            l.begin = function() {
                                for (var r in 0 === n && u && u.call(o, o),
                                f)
                                    if (f.hasOwnProperty(r)) {
                                        d[r] = e.style[r];
                                        var a = v.getPropertyValue(e, r);
                                        f[r] = "Down" === t ? [a, 0] : [0, a]
                                    }
                                d.overflow = e.style.overflow,
                                e.style.overflow = "hidden"
                            }
                            ,
                            l.complete = function() {
                                for (var t in d)
                                    d.hasOwnProperty(t) && (e.style[t] = d[t]);
                                n === i - 1 && (c && c.call(o, o),
                                s && s.resolver(o))
                            }
                            ,
                            y(e, f, l)
                        }
                    }
                    )),
                    p.each(["In", "Out"], (function(e, t) {
                        y.Redirects["fade" + t] = function(e, r, n, i, o, s) {
                            var l = p.extend({}, r)
                              , u = l.complete
                              , c = {
                                opacity: "In" === t ? 1 : 0
                            };
                            0 !== n && (l.begin = null),
                            l.complete = n !== i - 1 ? null : function() {
                                u && u.call(o, o),
                                s && s.resolver(o)
                            }
                            ,
                            l.display === a && (l.display = "In" === t ? "auto" : "none"),
                            y(this, c, l)
                        }
                    }
                    )),
                    y
                }
                function S(e) {
                    var t = p.data(e, "velocity");
                    return null === t ? a : t
                }
                function k(e, t) {
                    var r = S(e);
                    r && r.delayTimer && !r.delayPaused && (r.delayRemaining = r.delay - t + r.delayBegin,
                    r.delayPaused = !0,
                    clearTimeout(r.delayTimer.setTimeout))
                }
                function P(e, t) {
                    var r = S(e);
                    r && r.delayTimer && r.delayPaused && (r.delayPaused = !1,
                    r.delayTimer.setTimeout = setTimeout(r.delayTimer.next, r.delayRemaining))
                }
                function V(e) {
                    return function(t) {
                        return Math.round(t * e) * (1 / e)
                    }
                }
                function T(e, r, a, n) {
                    var i = 4
                      , o = .001
                      , s = 1e-7
                      , l = 10
                      , u = 11
                      , c = 1 / (u - 1)
                      , p = "Float32Array"in t;
                    if (4 !== arguments.length)
                        return !1;
                    for (var d = 0; d < 4; ++d)
                        if ("number" !== typeof arguments[d] || isNaN(arguments[d]) || !isFinite(arguments[d]))
                            return !1;
                    e = Math.min(e, 1),
                    a = Math.min(a, 1),
                    e = Math.max(e, 0),
                    a = Math.max(a, 0);
                    var f = p ? new Float32Array(u) : new Array(u);
                    function g(e, t) {
                        return 1 - 3 * t + 3 * e
                    }
                    function m(e, t) {
                        return 3 * t - 6 * e
                    }
                    function y(e) {
                        return 3 * e
                    }
                    function h(e, t, r) {
                        return ((g(t, r) * e + m(t, r)) * e + y(t)) * e
                    }
                    function v(e, t, r) {
                        return 3 * g(t, r) * e * e + 2 * m(t, r) * e + y(t)
                    }
                    function b(t, r) {
                        for (var n = 0; n < i; ++n) {
                            var o = v(r, e, a);
                            if (0 === o)
                                return r;
                            var s = h(r, e, a) - t;
                            r -= s / o
                        }
                        return r
                    }
                    function w() {
                        for (var t = 0; t < u; ++t)
                            f[t] = h(t * c, e, a)
                    }
                    function x(t, r, n) {
                        var i, o, u = 0;
                        do {
                            o = r + (n - r) / 2,
                            i = h(o, e, a) - t,
                            i > 0 ? n = o : r = o
                        } while (Math.abs(i) > s && ++u < l);
                        return o
                    }
                    function S(t) {
                        for (var r = 0, n = 1, i = u - 1; n !== i && f[n] <= t; ++n)
                            r += c;
                        --n;
                        var s = (t - f[n]) / (f[n + 1] - f[n])
                          , l = r + s * c
                          , p = v(l, e, a);
                        return p >= o ? b(t, l) : 0 === p ? l : x(t, r, r + c)
                    }
                    var k = !1;
                    function P() {
                        k = !0,
                        e === r && a === n || w()
                    }
                    var V = function(t) {
                        return k || P(),
                        e === r && a === n ? t : 0 === t ? 0 : 1 === t ? 1 : h(S(t), r, n)
                    };
                    V.getControlPoints = function() {
                        return [{
                            x: e,
                            y: r
                        }, {
                            x: a,
                            y: n
                        }]
                    }
                    ;
                    var T = "generateBezier(" + [e, r, a, n] + ")";
                    return V.toString = function() {
                        return T
                    }
                    ,
                    V
                }
                function C(e, t) {
                    var r = e;
                    return d.isString(e) ? y.Easings[e] || (r = !1) : r = d.isArray(e) && 1 === e.length ? V.apply(null, e) : d.isArray(e) && 2 === e.length ? h.apply(null, e.concat([t])) : !(!d.isArray(e) || 4 !== e.length) && T.apply(null, e),
                    !1 === r && (r = y.Easings[y.defaults.easing] ? y.defaults.easing : m),
                    r
                }
                function F(e) {
                    if (e) {
                        var t = y.timestamp && !0 !== e ? e : o.now()
                          , r = y.State.calls.length;
                        r > 1e4 && (y.State.calls = s(y.State.calls),
                        r = y.State.calls.length);
                        for (var i = 0; i < r; i++)
                            if (y.State.calls[i]) {
                                var l = y.State.calls[i]
                                  , u = l[0]
                                  , c = l[2]
                                  , f = l[3]
                                  , g = !f
                                  , m = null
                                  , h = l[5]
                                  , b = l[6];
                                if (f || (f = y.State.calls[i][3] = t - 16),
                                h) {
                                    if (!0 !== h.resume)
                                        continue;
                                    f = l[3] = Math.round(t - b - 16),
                                    l[5] = null
                                }
                                b = l[6] = t - f;
                                for (var x = Math.min(b / c.duration, 1), k = 0, P = u.length; k < P; k++) {
                                    var V = u[k]
                                      , T = V.element;
                                    if (S(T)) {
                                        var C = !1;
                                        if (c.display !== a && null !== c.display && "none" !== c.display) {
                                            if ("flex" === c.display) {
                                                var E = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                                p.each(E, (function(e, t) {
                                                    v.setPropertyValue(T, "display", t)
                                                }
                                                ))
                                            }
                                            v.setPropertyValue(T, "display", c.display)
                                        }
                                        for (var N in c.visibility !== a && "hidden" !== c.visibility && v.setPropertyValue(T, "visibility", c.visibility),
                                        V)
                                            if (V.hasOwnProperty(N) && "element" !== N) {
                                                var H, L = V[N], O = d.isString(L.easing) ? y.Easings[L.easing] : L.easing;
                                                if (d.isString(L.pattern)) {
                                                    var q = 1 === x ? function(e, t, r) {
                                                        var a = L.endValue[t];
                                                        return r ? Math.round(a) : a
                                                    }
                                                    : function(e, t, r) {
                                                        var a = L.startValue[t]
                                                          , n = L.endValue[t] - a
                                                          , i = a + n * O(x, c, n);
                                                        return r ? Math.round(i) : i
                                                    }
                                                    ;
                                                    H = L.pattern.replace(/{(\d+)(!)?}/g, q)
                                                } else if (1 === x)
                                                    H = L.endValue;
                                                else {
                                                    var j = L.endValue - L.startValue;
                                                    H = L.startValue + j * O(x, c, j)
                                                }
                                                if (!g && H === L.currentValue)
                                                    continue;
                                                if (L.currentValue = H,
                                                "tween" === N)
                                                    m = H;
                                                else {
                                                    var z;
                                                    if (v.Hooks.registered[N]) {
                                                        z = v.Hooks.getRoot(N);
                                                        var _ = S(T).rootPropertyValueCache[z];
                                                        _ && (L.rootPropertyValue = _)
                                                    }
                                                    var R = v.setPropertyValue(T, N, L.currentValue + (n < 9 && 0 === parseFloat(H) ? "" : L.unitType), L.rootPropertyValue, L.scrollData);
                                                    v.Hooks.registered[N] && (v.Normalizations.registered[z] ? S(T).rootPropertyValueCache[z] = v.Normalizations.registered[z]("extract", null, R[1]) : S(T).rootPropertyValueCache[z] = R[1]),
                                                    "transform" === R[0] && (C = !0)
                                                }
                                            }
                                        c.mobileHA && S(T).transformCache.translate3d === a && (S(T).transformCache.translate3d = "(0px, 0px, 0px)",
                                        C = !0),
                                        C && v.flushTransformCache(T)
                                    }
                                }
                                c.display !== a && "none" !== c.display && (y.State.calls[i][2].display = !1),
                                c.visibility !== a && "hidden" !== c.visibility && (y.State.calls[i][2].visibility = !1),
                                c.progress && c.progress.call(l[1], l[1], x, Math.max(0, f + c.duration - t), f, m),
                                1 === x && A(i)
                            }
                    }
                    y.State.isTicking && w(F)
                }
                function A(e, t) {
                    if (!y.State.calls[e])
                        return !1;
                    for (var r = y.State.calls[e][0], n = y.State.calls[e][1], i = y.State.calls[e][2], o = y.State.calls[e][4], s = !1, l = 0, u = r.length; l < u; l++) {
                        var c = r[l].element;
                        t || i.loop || ("none" === i.display && v.setPropertyValue(c, "display", i.display),
                        "hidden" === i.visibility && v.setPropertyValue(c, "visibility", i.visibility));
                        var d = S(c);
                        if (!0 !== i.loop && (p.queue(c)[1] === a || !/\.velocityQueueEntryFlag/i.test(p.queue(c)[1])) && d) {
                            d.isAnimating = !1,
                            d.rootPropertyValueCache = {};
                            var f = !1;
                            p.each(v.Lists.transforms3D, (function(e, t) {
                                var r = /^scale/.test(t) ? 1 : 0
                                  , n = d.transformCache[t];
                                d.transformCache[t] !== a && new RegExp("^\\(" + r + "[^.]").test(n) && (f = !0,
                                delete d.transformCache[t])
                            }
                            )),
                            i.mobileHA && (f = !0,
                            delete d.transformCache.translate3d),
                            f && v.flushTransformCache(c),
                            v.Values.removeClass(c, "velocity-animating")
                        }
                        if (!t && i.complete && !i.loop && l === u - 1)
                            try {
                                i.complete.call(n, n)
                            } catch (h) {
                                setTimeout((function() {
                                    throw h
                                }
                                ), 1)
                            }
                        o && !0 !== i.loop && o(n),
                        d && !0 === i.loop && !t && (p.each(d.tweensContainer, (function(e, t) {
                            if (/^rotate/.test(e) && (parseFloat(t.startValue) - parseFloat(t.endValue)) % 360 === 0) {
                                var r = t.startValue;
                                t.startValue = t.endValue,
                                t.endValue = r
                            }
                            /^backgroundPosition/.test(e) && 100 === parseFloat(t.endValue) && "%" === t.unitType && (t.endValue = 0,
                            t.startValue = 100)
                        }
                        )),
                        y(c, "reverse", {
                            loop: !0,
                            delay: i.delay
                        })),
                        !1 !== i.queue && p.dequeue(c, i.queue)
                    }
                    y.State.calls[e] = !1;
                    for (var g = 0, m = y.State.calls.length; g < m; g++)
                        if (!1 !== y.State.calls[g]) {
                            s = !0;
                            break
                        }
                    !1 === s && (y.State.isTicking = !1,
                    delete y.State.calls,
                    y.State.calls = [])
                }
                jQuery.fn.velocity = jQuery.fn.animate
            }(window.jQuery || window.Zepto || window, window, window ? window.document : void 0)
        }
        ))
    },
    57042: function(e, t, r) {
        "use strict";
        r.d(t, {
            Z: function() {
                return h
            }
        });
        var a = r(40118);
        const n = ["textContent"]
          , i = {
            key: 2,
            class: "panel__subtitle"
        }
          , o = {
            key: 0,
            class: "panel__header-elements"
        }
          , s = {
            class: "panel__content-extended"
        }
          , l = {
            key: 0,
            class: "panel__footer panel__custom-footer"
        }
          , u = {
            class: "panel__controls"
        };
        function c(e, t, r, c, p, d) {
            const f = (0,
            a.up)("a-button")
              , g = (0,
            a.up)("a-skeleton")
              , m = (0,
            a.up)("a-spin");
            return (0,
            a.wg)(),
            (0,
            a.j4)(m, {
                spinning: e.pending
            }, {
                default: (0,
                a.w5)(( () => [(0,
                a._)("div", {
                    class: (0,
                    a.C_)(e.loading ? "panel__skeleton" : "")
                }, [(0,
                a.Wm)(g, {
                    active: "",
                    loading: e.loading
                }, {
                    default: (0,
                    a.w5)(( () => [(0,
                    a._)("div", {
                        class: (0,
                        a.C_)(e.classList)
                    }, [e.headless ? (0,
                    a.kq)("", !0) : ((0,
                    a.wg)(),
                    (0,
                    a.iD)("div", {
                        key: 0,
                        class: (0,
                        a.C_)(e.splitHeader ? ["panel__header", "panel__header--split"] : ["panel__header"])
                    }, [(0,
                    a._)("div", null, [e.titleText && !e.$slots.title ? ((0,
                    a.wg)(),
                    (0,
                    a.iD)("h5", {
                        key: 0,
                        textContent: (0,
                        a.zw)(e.titleText),
                        class: "panel__title"
                    }, null, 8, n)) : (0,
                    a.WI)(e.$slots, "title", {
                        key: 1
                    }, void 0, !0), e.subtitle || e.$slots.subtitle ? ((0,
                    a.wg)(),
                    (0,
                    a.iD)("div", i, [(0,
                    a.WI)(e.$slots, "subtitle", {}, ( () => [(0,
                    a.Uk)((0,
                    a.zw)(e.subtitle), 1)]), !0)])) : (0,
                    a.kq)("", !0)]), e.$slots["header-elements"] ? ((0,
                    a.wg)(),
                    (0,
                    a.iD)("div", o, [(0,
                    a.WI)(e.$slots, "header-elements", {}, void 0, !0)])) : (0,
                    a.kq)("", !0)], 2)), (0,
                    a._)("div", {
                        class: (0,
                        a.C_)(e.headless ? ["panel__content", "panel__content--headless"] : ["panel__content"])
                    }, [(0,
                    a.WI)(e.$slots, "default", {}, void 0, !0)], 2), (0,
                    a._)("div", s, [(0,
                    a.WI)(e.$slots, "content-extended", {}, void 0, !0)]), (0,
                    a.Wm)(a.uT, {
                        name: "slide-fade",
                        onBeforeEnter: e.beforeEnter,
                        onEnter: e.footerEnter,
                        onLeave: e.footerLeave,
                        css: !1
                    }, {
                        default: (0,
                        a.w5)(( () => [e.showCustomFooter && e.$slots.custom_footer ? ((0,
                        a.wg)(),
                        (0,
                        a.iD)("div", l, [(0,
                        a.WI)(e.$slots, "custom_footer", {}, void 0, !0)])) : e.unsaved ? ((0,
                        a.wg)(),
                        (0,
                        a.iD)("div", {
                            key: 1,
                            class: (0,
                            a.C_)(["panel__footer", {
                                "panel__footer--no-events": e.disableFooterEvents
                            }])
                        }, [(0,
                        a._)("div", u, [(0,
                        a.Wm)(f, {
                            onClick: t[0] || (t[0] = t => e.$emit("cancel"))
                        }, {
                            default: (0,
                            a.w5)(( () => [(0,
                            a.Uk)((0,
                            a.zw)(e.$t("common.action.cancel")), 1)])),
                            _: 1
                        }), (0,
                        a.Wm)(f, {
                            type: "primary",
                            disabled: e.lockApply,
                            onClick: t[1] || (t[1] = t => e.$emit("apply"))
                        }, {
                            default: (0,
                            a.w5)(( () => [(0,
                            a.Uk)((0,
                            a.zw)(e.$t("common.action.apply")), 1)])),
                            _: 1
                        }, 8, ["disabled"])])], 2)) : (0,
                        a.kq)("", !0)])),
                        _: 3
                    }, 8, ["onBeforeEnter", "onEnter", "onLeave"])], 2)])),
                    _: 3
                }, 8, ["loading"])], 2)])),
                _: 3
            }, 8, ["spinning"])
        }
        var p = r(33324)
          , d = r(12641)
          , f = r.n(d)
          , g = (0,
        a.aZ)({
            name: "Panel",
            props: {
                class: {
                    type: String,
                    default: ""
                },
                headless: {
                    type: Boolean,
                    default: !1
                },
                noPadding: {
                    type: Boolean,
                    default: !1
                },
                noMargin: {
                    type: Boolean,
                    default: !1
                },
                lowMargin: {
                    type: Boolean,
                    default: !1
                },
                splitHeader: {
                    type: Boolean,
                    default: !1
                },
                title: {
                    type: String,
                    default: ""
                },
                subtitle: [String],
                showCustomFooter: {
                    type: Boolean,
                    default: !1
                },
                lockApply: {
                    type: Boolean,
                    default: !1
                },
                pending: {
                    type: Boolean,
                    default: !1
                },
                loading: {
                    type: Boolean,
                    default: !1
                },
                unsaved: {
                    type: Boolean,
                    default: !1
                },
                notifications: Array,
                mode: {
                    type: String,
                    validator: e => ["default", "no-padding", "no-margin", "low-margin"].includes(e)
                }
            },
            setup(e) {
                const t = (0,
                a.iH)(!1)
                  , {title: r} = (0,
                a.BK)(e)
                  , {t: n, te: i} = (0,
                p.QT)()
                  , o = (0,
                a.Fl)(( () => [e.class, "panel", ...e.mode ? `panel--${e.mode}` : [], ...e.noPadding ? ["panel--no-padding"] : [], ...e.noMargin ? ["panel--no-margin"] : [], ...e.lowMargin ? ["panel--low-margin"] : []]))
                  , s = (0,
                a.Fl)(( () => r.value ? i(r.value) ? n(r.value) : r.value : ""))
                  , l = e => {
                    t.value = !0,
                    e.style.setProperty("opacity", "0")
                }
                  , u = (e, r) => {
                    e.style.setProperty("opacity", "1"),
                    f()(e, "slideDown", {
                        duration: 300,
                        complete: () => {
                            setTimeout(( () => {
                                t.value = !1
                            }
                            ), 300),
                            r()
                        }
                    })
                }
                  , c = (e, t) => {
                    f()(e, "slideUp", {
                        duration: 300
                    }),
                    f()(e, {
                        opacity: 0
                    }, {
                        complete: t
                    })
                }
                ;
                return {
                    disableFooterEvents: t,
                    classList: o,
                    titleText: s,
                    beforeEnter: l,
                    footerEnter: u,
                    footerLeave: c
                }
            }
        })
          , m = r(83744);
        const y = (0,
        m.Z)(g, [["render", c], ["__scopeId", "data-v-73b2ee32"]]);
        var h = y
    }
}]);