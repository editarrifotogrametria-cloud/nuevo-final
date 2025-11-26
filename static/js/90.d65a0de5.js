"use strict";
(self["webpackChunkreach_panel"] = self["webpackChunkreach_panel"] || []).push([[90], {
    73972: function(t, n, e) {
        e.r(n),
        e.d(n, {
            default: function() {
                return Qo
            }
        });
        var r = e(40118);
        const i = {
            class: "satellites"
        };
        function a(t, n, e, a, o, s) {
            const u = (0,
            r.up)("SNRChart")
              , l = (0,
            r.up)("panel")
              , c = (0,
            r.up)("SkyPlot");
            return (0,
            r.wg)(),
            (0,
            r.iD)("div", i, [t.showSNR ? ((0,
            r.wg)(),
            (0,
            r.j4)(l, {
                key: 0,
                headless: ""
            }, {
                default: (0,
                r.w5)(( () => [(0,
                r.Wm)(u)])),
                _: 1
            })) : (0,
            r.kq)("", !0), t.showSkyPlot ? ((0,
            r.wg)(),
            (0,
            r.j4)(l, {
                key: 1,
                headless: ""
            }, {
                default: (0,
                r.w5)(( () => [(0,
                r.Wm)(c)])),
                _: 1
            })) : (0,
            r.kq)("", !0)])
        }
        var o = e(57042);
        const s = {
            class: "chart"
        }
          , u = {
            class: "mb-20"
        }
          , l = {
            class: "charts"
        };
        function c(t, n, e, i, a, o) {
            const c = (0,
            r.up)("Chart");
            return (0,
            r.wg)(),
            (0,
            r.iD)("div", s, [(0,
            r._)("h4", u, (0,
            r.zw)(t.t("tabs.satellites.snr")), 1), (0,
            r._)("div", l, [((0,
            r.wg)(!0),
            (0,
            r.iD)(r.HY, null, (0,
            r.Ko)(t.satellitesData, (t => ((0,
            r.wg)(),
            (0,
            r.j4)(c, {
                key: t.value.system,
                "observation-data": t.value,
                class: (0,
                r.C_)(`snr-chart-${t.value.system}`)
            }, null, 8, ["observation-data", "class"])))), 128))])])
        }
        var h = e(33324)
          , f = e(66867);
        const p = ["viewBox"]
          , d = ["id"]
          , g = ["width", "height", "transform"]
          , v = ["transform"]
          , y = ["width", "height", "x", "y"];
        function m(t, n, e, i, a, o) {
            const s = (0,
            r.up)("chart-title");
            return (0,
            r.wg)(),
            (0,
            r.iD)("div", null, [(0,
            r._)("div", null, [(0,
            r.Wm)(s, {
                class: (0,
                r.C_)(`snr-title-${t.observationData.system}`),
                system: t.observationData.system,
                rover: t.observationData.count.rover,
                base: t.observationData.count.base
            }, null, 8, ["class", "system", "rover", "base"])]), (0,
            r._)("div", {
                class: (0,
                r.C_)(["snr-chart", `snr-container-${t.observationData.system}`]),
                ref: "container",
                id: "snr-chart-container"
            }, [((0,
            r.wg)(),
            (0,
            r.iD)("svg", {
                viewBox: `0 0 ${t.containerWidth} ${t.containerHeight}`,
                class: "snr-chart__canvas"
            }, [(0,
            r._)("g", {
                class: "snr-chart__axis-layer",
                id: "axis_" + t.observationData.system
            }, null, 8, d), (0,
            r._)("g", {
                class: "snr-chart__chart-layer",
                ref: "chartLayer",
                width: t.chartSize.width,
                height: t.chartSize.height,
                transform: t.getTransformTranslate(t.margin.left, t.margin.top)
            }, [((0,
            r.wg)(!0),
            (0,
            r.iD)(r.HY, null, (0,
            r.Ko)(t.chartEntries, ( (n, e) => ((0,
            r.wg)(),
            (0,
            r.iD)("g", {
                key: e,
                transform: t.getTransformTranslate(t.scales.xScale(n.satelliteName)),
                class: "snr-chart__group"
            }, [((0,
            r.wg)(!0),
            (0,
            r.iD)(r.HY, null, (0,
            r.Ko)(n.values, (n => ((0,
            r.wg)(),
            (0,
            r.iD)("rect", {
                key: n.source,
                class: (0,
                r.C_)(["snr-chart__bar", t.getBarClass(n.source, n.snr), `snr-bar-${n.source}-${n.index}`]),
                width: t.barWidth,
                height: t.getBarHeight(n.snr),
                x: t.scales.xInScale(n.source),
                y: t.scales.yScale(n.snr)
            }, null, 10, y)))), 128))], 8, v)))), 128))], 8, g)], 8, p))], 2)])
        }
        var _ = e(71373);
        function w(t, n, e) {
            t = +t,
            n = +n,
            e = (i = arguments.length) < 2 ? (n = t,
            t = 0,
            1) : i < 3 ? 1 : +e;
            var r = -1
              , i = 0 | Math.max(0, Math.ceil((n - t) / e))
              , a = new Array(i);
            while (++r < i)
                a[r] = t + r * e;
            return a
        }
        function b(t) {
            return t
        }
        var x = 1
          , k = 2
          , M = 3
          , N = 4
          , S = 1e-6;
        function A(t) {
            return "translate(" + t + ",0)"
        }
        function $(t) {
            return "translate(0," + t + ")"
        }
        function E(t) {
            return n => +t(n)
        }
        function C(t, n) {
            return n = Math.max(0, t.bandwidth() - 2 * n) / 2,
            t.round() && (n = Math.round(n)),
            e => +t(e) + n
        }
        function F() {
            return !this.__axis
        }
        function P(t, n) {
            var e = []
              , r = null
              , i = null
              , a = 6
              , o = 6
              , s = 3
              , u = "undefined" !== typeof window && window.devicePixelRatio > 1 ? 0 : .5
              , l = t === x || t === N ? -1 : 1
              , c = t === N || t === k ? "x" : "y"
              , h = t === x || t === M ? A : $;
            function f(f) {
                var p = null == r ? n.ticks ? n.ticks.apply(n, e) : n.domain() : r
                  , d = null == i ? n.tickFormat ? n.tickFormat.apply(n, e) : b : i
                  , g = Math.max(a, 0) + s
                  , v = n.range()
                  , y = +v[0] + u
                  , m = +v[v.length - 1] + u
                  , _ = (n.bandwidth ? C : E)(n.copy(), u)
                  , w = f.selection ? f.selection() : f
                  , A = w.selectAll(".domain").data([null])
                  , $ = w.selectAll(".tick").data(p, n).order()
                  , P = $.exit()
                  , z = $.enter().append("g").attr("class", "tick")
                  , D = $.select("line")
                  , O = $.select("text");
                A = A.merge(A.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor")),
                $ = $.merge(z),
                D = D.merge(z.append("line").attr("stroke", "currentColor").attr(c + "2", l * a)),
                O = O.merge(z.append("text").attr("fill", "currentColor").attr(c, l * g).attr("dy", t === x ? "0em" : t === M ? "0.71em" : "0.32em")),
                f !== w && (A = A.transition(f),
                $ = $.transition(f),
                D = D.transition(f),
                O = O.transition(f),
                P = P.transition(f).attr("opacity", S).attr("transform", (function(t) {
                    return isFinite(t = _(t)) ? h(t + u) : this.getAttribute("transform")
                }
                )),
                z.attr("opacity", S).attr("transform", (function(t) {
                    var n = this.parentNode.__axis;
                    return h((n && isFinite(n = n(t)) ? n : _(t)) + u)
                }
                ))),
                P.remove(),
                A.attr("d", t === N || t === k ? o ? "M" + l * o + "," + y + "H" + u + "V" + m + "H" + l * o : "M" + u + "," + y + "V" + m : o ? "M" + y + "," + l * o + "V" + u + "H" + m + "V" + l * o : "M" + y + "," + u + "H" + m),
                $.attr("opacity", 1).attr("transform", (function(t) {
                    return h(_(t) + u)
                }
                )),
                D.attr(c + "2", l * a),
                O.attr(c, l * g).text(d),
                w.filter(F).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", t === k ? "start" : t === N ? "end" : "middle"),
                w.each((function() {
                    this.__axis = _
                }
                ))
            }
            return f.scale = function(t) {
                return arguments.length ? (n = t,
                f) : n
            }
            ,
            f.ticks = function() {
                return e = Array.from(arguments),
                f
            }
            ,
            f.tickArguments = function(t) {
                return arguments.length ? (e = null == t ? [] : Array.from(t),
                f) : e.slice()
            }
            ,
            f.tickValues = function(t) {
                return arguments.length ? (r = null == t ? null : Array.from(t),
                f) : r && r.slice()
            }
            ,
            f.tickFormat = function(t) {
                return arguments.length ? (i = t,
                f) : i
            }
            ,
            f.tickSize = function(t) {
                return arguments.length ? (a = o = +t,
                f) : a
            }
            ,
            f.tickSizeInner = function(t) {
                return arguments.length ? (a = +t,
                f) : a
            }
            ,
            f.tickSizeOuter = function(t) {
                return arguments.length ? (o = +t,
                f) : o
            }
            ,
            f.tickPadding = function(t) {
                return arguments.length ? (s = +t,
                f) : s
            }
            ,
            f.offset = function(t) {
                return arguments.length ? (u = +t,
                f) : u
            }
            ,
            f
        }
        function z(t) {
            return P(M, t)
        }
        function D(t) {
            return P(N, t)
        }
        function O() {}
        function I(t) {
            return null == t ? O : function() {
                return this.querySelector(t)
            }
        }
        function T(t) {
            "function" !== typeof t && (t = I(t));
            for (var n = this._groups, e = n.length, r = new Array(e), i = 0; i < e; ++i)
                for (var a, o, s = n[i], u = s.length, l = r[i] = new Array(u), c = 0; c < u; ++c)
                    (a = s[c]) && (o = t.call(a, a.__data__, c, s)) && ("__data__"in a && (o.__data__ = a.__data__),
                    l[c] = o);
            return new Pn(r,this._parents)
        }
        function q(t) {
            return null == t ? [] : Array.isArray(t) ? t : Array.from(t)
        }
        function H() {
            return []
        }
        function R(t) {
            return null == t ? H : function() {
                return this.querySelectorAll(t)
            }
        }
        function j(t) {
            return function() {
                return q(t.apply(this, arguments))
            }
        }
        function L(t) {
            t = "function" === typeof t ? j(t) : R(t);
            for (var n = this._groups, e = n.length, r = [], i = [], a = 0; a < e; ++a)
                for (var o, s = n[a], u = s.length, l = 0; l < u; ++l)
                    (o = s[l]) && (r.push(t.call(o, o.__data__, l, s)),
                    i.push(o));
            return new Pn(r,i)
        }
        function X(t) {
            return function() {
                return this.matches(t)
            }
        }
        function B(t) {
            return function(n) {
                return n.matches(t)
            }
        }
        var Y = Array.prototype.find;
        function V(t) {
            return function() {
                return Y.call(this.children, t)
            }
        }
        function Z() {
            return this.firstElementChild
        }
        function W(t) {
            return this.select(null == t ? Z : V("function" === typeof t ? t : B(t)))
        }
        var U = Array.prototype.filter;
        function K() {
            return Array.from(this.children)
        }
        function J(t) {
            return function() {
                return U.call(this.children, t)
            }
        }
        function G(t) {
            return this.selectAll(null == t ? K : J("function" === typeof t ? t : B(t)))
        }
        function Q(t) {
            "function" !== typeof t && (t = X(t));
            for (var n = this._groups, e = n.length, r = new Array(e), i = 0; i < e; ++i)
                for (var a, o = n[i], s = o.length, u = r[i] = [], l = 0; l < s; ++l)
                    (a = o[l]) && t.call(a, a.__data__, l, o) && u.push(a);
            return new Pn(r,this._parents)
        }
        function tt(t) {
            return new Array(t.length)
        }
        function nt() {
            return new Pn(this._enter || this._groups.map(tt),this._parents)
        }
        function et(t, n) {
            this.ownerDocument = t.ownerDocument,
            this.namespaceURI = t.namespaceURI,
            this._next = null,
            this._parent = t,
            this.__data__ = n
        }
        function rt(t) {
            return function() {
                return t
            }
        }
        function it(t, n, e, r, i, a) {
            for (var o, s = 0, u = n.length, l = a.length; s < l; ++s)
                (o = n[s]) ? (o.__data__ = a[s],
                r[s] = o) : e[s] = new et(t,a[s]);
            for (; s < u; ++s)
                (o = n[s]) && (i[s] = o)
        }
        function at(t, n, e, r, i, a, o) {
            var s, u, l, c = new Map, h = n.length, f = a.length, p = new Array(h);
            for (s = 0; s < h; ++s)
                (u = n[s]) && (p[s] = l = o.call(u, u.__data__, s, n) + "",
                c.has(l) ? i[s] = u : c.set(l, u));
            for (s = 0; s < f; ++s)
                l = o.call(t, a[s], s, a) + "",
                (u = c.get(l)) ? (r[s] = u,
                u.__data__ = a[s],
                c.delete(l)) : e[s] = new et(t,a[s]);
            for (s = 0; s < h; ++s)
                (u = n[s]) && c.get(p[s]) === u && (i[s] = u)
        }
        function ot(t) {
            return t.__data__
        }
        function st(t, n) {
            if (!arguments.length)
                return Array.from(this, ot);
            var e = n ? at : it
              , r = this._parents
              , i = this._groups;
            "function" !== typeof t && (t = rt(t));
            for (var a = i.length, o = new Array(a), s = new Array(a), u = new Array(a), l = 0; l < a; ++l) {
                var c = r[l]
                  , h = i[l]
                  , f = h.length
                  , p = ut(t.call(c, c && c.__data__, l, r))
                  , d = p.length
                  , g = s[l] = new Array(d)
                  , v = o[l] = new Array(d)
                  , y = u[l] = new Array(f);
                e(c, h, g, v, y, p, n);
                for (var m, _, w = 0, b = 0; w < d; ++w)
                    if (m = g[w]) {
                        w >= b && (b = w + 1);
                        while (!(_ = v[b]) && ++b < d)
                            ;
                        m._next = _ || null
                    }
            }
            return o = new Pn(o,r),
            o._enter = s,
            o._exit = u,
            o
        }
        function ut(t) {
            return "object" === typeof t && "length"in t ? t : Array.from(t)
        }
        function lt() {
            return new Pn(this._exit || this._groups.map(tt),this._parents)
        }
        function ct(t, n, e) {
            var r = this.enter()
              , i = this
              , a = this.exit();
            return "function" === typeof t ? (r = t(r),
            r && (r = r.selection())) : r = r.append(t + ""),
            null != n && (i = n(i),
            i && (i = i.selection())),
            null == e ? a.remove() : e(a),
            r && i ? r.merge(i).order() : i
        }
        function ht(t) {
            for (var n = t.selection ? t.selection() : t, e = this._groups, r = n._groups, i = e.length, a = r.length, o = Math.min(i, a), s = new Array(i), u = 0; u < o; ++u)
                for (var l, c = e[u], h = r[u], f = c.length, p = s[u] = new Array(f), d = 0; d < f; ++d)
                    (l = c[d] || h[d]) && (p[d] = l);
            for (; u < i; ++u)
                s[u] = e[u];
            return new Pn(s,this._parents)
        }
        function ft() {
            for (var t = this._groups, n = -1, e = t.length; ++n < e; )
                for (var r, i = t[n], a = i.length - 1, o = i[a]; --a >= 0; )
                    (r = i[a]) && (o && 4 ^ r.compareDocumentPosition(o) && o.parentNode.insertBefore(r, o),
                    o = r);
            return this
        }
        function pt(t) {
            function n(n, e) {
                return n && e ? t(n.__data__, e.__data__) : !n - !e
            }
            t || (t = dt);
            for (var e = this._groups, r = e.length, i = new Array(r), a = 0; a < r; ++a) {
                for (var o, s = e[a], u = s.length, l = i[a] = new Array(u), c = 0; c < u; ++c)
                    (o = s[c]) && (l[c] = o);
                l.sort(n)
            }
            return new Pn(i,this._parents).order()
        }
        function dt(t, n) {
            return t < n ? -1 : t > n ? 1 : t >= n ? 0 : NaN
        }
        function gt() {
            var t = arguments[0];
            return arguments[0] = this,
            t.apply(null, arguments),
            this
        }
        function vt() {
            return Array.from(this)
        }
        function yt() {
            for (var t = this._groups, n = 0, e = t.length; n < e; ++n)
                for (var r = t[n], i = 0, a = r.length; i < a; ++i) {
                    var o = r[i];
                    if (o)
                        return o
                }
            return null
        }
        function mt() {
            let t = 0;
            for (const n of this)
                ++t;
            return t
        }
        function _t() {
            return !this.node()
        }
        function wt(t) {
            for (var n = this._groups, e = 0, r = n.length; e < r; ++e)
                for (var i, a = n[e], o = 0, s = a.length; o < s; ++o)
                    (i = a[o]) && t.call(i, i.__data__, o, a);
            return this
        }
        et.prototype = {
            constructor: et,
            appendChild: function(t) {
                return this._parent.insertBefore(t, this._next)
            },
            insertBefore: function(t, n) {
                return this._parent.insertBefore(t, n)
            },
            querySelector: function(t) {
                return this._parent.querySelector(t)
            },
            querySelectorAll: function(t) {
                return this._parent.querySelectorAll(t)
            }
        };
        var bt = "http://www.w3.org/1999/xhtml"
          , xt = {
            svg: "http://www.w3.org/2000/svg",
            xhtml: bt,
            xlink: "http://www.w3.org/1999/xlink",
            xml: "http://www.w3.org/XML/1998/namespace",
            xmlns: "http://www.w3.org/2000/xmlns/"
        };
        function kt(t) {
            var n = t += ""
              , e = n.indexOf(":");
            return e >= 0 && "xmlns" !== (n = t.slice(0, e)) && (t = t.slice(e + 1)),
            xt.hasOwnProperty(n) ? {
                space: xt[n],
                local: t
            } : t
        }
        function Mt(t) {
            return function() {
                this.removeAttribute(t)
            }
        }
        function Nt(t) {
            return function() {
                this.removeAttributeNS(t.space, t.local)
            }
        }
        function St(t, n) {
            return function() {
                this.setAttribute(t, n)
            }
        }
        function At(t, n) {
            return function() {
                this.setAttributeNS(t.space, t.local, n)
            }
        }
        function $t(t, n) {
            return function() {
                var e = n.apply(this, arguments);
                null == e ? this.removeAttribute(t) : this.setAttribute(t, e)
            }
        }
        function Et(t, n) {
            return function() {
                var e = n.apply(this, arguments);
                null == e ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, e)
            }
        }
        function Ct(t, n) {
            var e = kt(t);
            if (arguments.length < 2) {
                var r = this.node();
                return e.local ? r.getAttributeNS(e.space, e.local) : r.getAttribute(e)
            }
            return this.each((null == n ? e.local ? Nt : Mt : "function" === typeof n ? e.local ? Et : $t : e.local ? At : St)(e, n))
        }
        function Ft(t) {
            return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView
        }
        function Pt(t) {
            return function() {
                this.style.removeProperty(t)
            }
        }
        function zt(t, n, e) {
            return function() {
                this.style.setProperty(t, n, e)
            }
        }
        function Dt(t, n, e) {
            return function() {
                var r = n.apply(this, arguments);
                null == r ? this.style.removeProperty(t) : this.style.setProperty(t, r, e)
            }
        }
        function Ot(t, n, e) {
            return arguments.length > 1 ? this.each((null == n ? Pt : "function" === typeof n ? Dt : zt)(t, n, null == e ? "" : e)) : It(this.node(), t)
        }
        function It(t, n) {
            return t.style.getPropertyValue(n) || Ft(t).getComputedStyle(t, null).getPropertyValue(n)
        }
        function Tt(t) {
            return function() {
                delete this[t]
            }
        }
        function qt(t, n) {
            return function() {
                this[t] = n
            }
        }
        function Ht(t, n) {
            return function() {
                var e = n.apply(this, arguments);
                null == e ? delete this[t] : this[t] = e
            }
        }
        function Rt(t, n) {
            return arguments.length > 1 ? this.each((null == n ? Tt : "function" === typeof n ? Ht : qt)(t, n)) : this.node()[t]
        }
        function jt(t) {
            return t.trim().split(/^|\s+/)
        }
        function Lt(t) {
            return t.classList || new Xt(t)
        }
        function Xt(t) {
            this._node = t,
            this._names = jt(t.getAttribute("class") || "")
        }
        function Bt(t, n) {
            var e = Lt(t)
              , r = -1
              , i = n.length;
            while (++r < i)
                e.add(n[r])
        }
        function Yt(t, n) {
            var e = Lt(t)
              , r = -1
              , i = n.length;
            while (++r < i)
                e.remove(n[r])
        }
        function Vt(t) {
            return function() {
                Bt(this, t)
            }
        }
        function Zt(t) {
            return function() {
                Yt(this, t)
            }
        }
        function Wt(t, n) {
            return function() {
                (n.apply(this, arguments) ? Bt : Yt)(this, t)
            }
        }
        function Ut(t, n) {
            var e = jt(t + "");
            if (arguments.length < 2) {
                var r = Lt(this.node())
                  , i = -1
                  , a = e.length;
                while (++i < a)
                    if (!r.contains(e[i]))
                        return !1;
                return !0
            }
            return this.each(("function" === typeof n ? Wt : n ? Vt : Zt)(e, n))
        }
        function Kt() {
            this.textContent = ""
        }
        function Jt(t) {
            return function() {
                this.textContent = t
            }
        }
        function Gt(t) {
            return function() {
                var n = t.apply(this, arguments);
                this.textContent = null == n ? "" : n
            }
        }
        function Qt(t) {
            return arguments.length ? this.each(null == t ? Kt : ("function" === typeof t ? Gt : Jt)(t)) : this.node().textContent
        }
        function tn() {
            this.innerHTML = ""
        }
        function nn(t) {
            return function() {
                this.innerHTML = t
            }
        }
        function en(t) {
            return function() {
                var n = t.apply(this, arguments);
                this.innerHTML = null == n ? "" : n
            }
        }
        function rn(t) {
            return arguments.length ? this.each(null == t ? tn : ("function" === typeof t ? en : nn)(t)) : this.node().innerHTML
        }
        function an() {
            this.nextSibling && this.parentNode.appendChild(this)
        }
        function on() {
            return this.each(an)
        }
        function sn() {
            this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild)
        }
        function un() {
            return this.each(sn)
        }
        function ln(t) {
            return function() {
                var n = this.ownerDocument
                  , e = this.namespaceURI;
                return e === bt && n.documentElement.namespaceURI === bt ? n.createElement(t) : n.createElementNS(e, t)
            }
        }
        function cn(t) {
            return function() {
                return this.ownerDocument.createElementNS(t.space, t.local)
            }
        }
        function hn(t) {
            var n = kt(t);
            return (n.local ? cn : ln)(n)
        }
        function fn(t) {
            var n = "function" === typeof t ? t : hn(t);
            return this.select((function() {
                return this.appendChild(n.apply(this, arguments))
            }
            ))
        }
        function pn() {
            return null
        }
        function dn(t, n) {
            var e = "function" === typeof t ? t : hn(t)
              , r = null == n ? pn : "function" === typeof n ? n : I(n);
            return this.select((function() {
                return this.insertBefore(e.apply(this, arguments), r.apply(this, arguments) || null)
            }
            ))
        }
        function gn() {
            var t = this.parentNode;
            t && t.removeChild(this)
        }
        function vn() {
            return this.each(gn)
        }
        function yn() {
            var t = this.cloneNode(!1)
              , n = this.parentNode;
            return n ? n.insertBefore(t, this.nextSibling) : t
        }
        function mn() {
            var t = this.cloneNode(!0)
              , n = this.parentNode;
            return n ? n.insertBefore(t, this.nextSibling) : t
        }
        function _n(t) {
            return this.select(t ? mn : yn)
        }
        function wn(t) {
            return arguments.length ? this.property("__data__", t) : this.node().__data__
        }
        function bn(t) {
            return function(n) {
                t.call(this, n, this.__data__)
            }
        }
        function xn(t) {
            return t.trim().split(/^|\s+/).map((function(t) {
                var n = ""
                  , e = t.indexOf(".");
                return e >= 0 && (n = t.slice(e + 1),
                t = t.slice(0, e)),
                {
                    type: t,
                    name: n
                }
            }
            ))
        }
        function kn(t) {
            return function() {
                var n = this.__on;
                if (n) {
                    for (var e, r = 0, i = -1, a = n.length; r < a; ++r)
                        e = n[r],
                        t.type && e.type !== t.type || e.name !== t.name ? n[++i] = e : this.removeEventListener(e.type, e.listener, e.options);
                    ++i ? n.length = i : delete this.__on
                }
            }
        }
        function Mn(t, n, e) {
            return function() {
                var r, i = this.__on, a = bn(n);
                if (i)
                    for (var o = 0, s = i.length; o < s; ++o)
                        if ((r = i[o]).type === t.type && r.name === t.name)
                            return this.removeEventListener(r.type, r.listener, r.options),
                            this.addEventListener(r.type, r.listener = a, r.options = e),
                            void (r.value = n);
                this.addEventListener(t.type, a, e),
                r = {
                    type: t.type,
                    name: t.name,
                    value: n,
                    listener: a,
                    options: e
                },
                i ? i.push(r) : this.__on = [r]
            }
        }
        function Nn(t, n, e) {
            var r, i, a = xn(t + ""), o = a.length;
            if (!(arguments.length < 2)) {
                for (s = n ? Mn : kn,
                r = 0; r < o; ++r)
                    this.each(s(a[r], n, e));
                return this
            }
            var s = this.node().__on;
            if (s)
                for (var u, l = 0, c = s.length; l < c; ++l)
                    for (r = 0,
                    u = s[l]; r < o; ++r)
                        if ((i = a[r]).type === u.type && i.name === u.name)
                            return u.value
        }
        function Sn(t, n, e) {
            var r = Ft(t)
              , i = r.CustomEvent;
            "function" === typeof i ? i = new i(n,e) : (i = r.document.createEvent("Event"),
            e ? (i.initEvent(n, e.bubbles, e.cancelable),
            i.detail = e.detail) : i.initEvent(n, !1, !1)),
            t.dispatchEvent(i)
        }
        function An(t, n) {
            return function() {
                return Sn(this, t, n)
            }
        }
        function $n(t, n) {
            return function() {
                return Sn(this, t, n.apply(this, arguments))
            }
        }
        function En(t, n) {
            return this.each(("function" === typeof n ? $n : An)(t, n))
        }
        function *Cn() {
            for (var t = this._groups, n = 0, e = t.length; n < e; ++n)
                for (var r, i = t[n], a = 0, o = i.length; a < o; ++a)
                    (r = i[a]) && (yield r)
        }
        Xt.prototype = {
            add: function(t) {
                var n = this._names.indexOf(t);
                n < 0 && (this._names.push(t),
                this._node.setAttribute("class", this._names.join(" ")))
            },
            remove: function(t) {
                var n = this._names.indexOf(t);
                n >= 0 && (this._names.splice(n, 1),
                this._node.setAttribute("class", this._names.join(" ")))
            },
            contains: function(t) {
                return this._names.indexOf(t) >= 0
            }
        };
        var Fn = [null];
        function Pn(t, n) {
            this._groups = t,
            this._parents = n
        }
        function zn() {
            return new Pn([[document.documentElement]],Fn)
        }
        function Dn() {
            return this
        }
        Pn.prototype = zn.prototype = {
            constructor: Pn,
            select: T,
            selectAll: L,
            selectChild: W,
            selectChildren: G,
            filter: Q,
            data: st,
            enter: nt,
            exit: lt,
            join: ct,
            merge: ht,
            selection: Dn,
            order: ft,
            sort: pt,
            call: gt,
            nodes: vt,
            node: yt,
            size: mt,
            empty: _t,
            each: wt,
            attr: Ct,
            style: Ot,
            property: Rt,
            classed: Ut,
            text: Qt,
            html: rn,
            raise: on,
            lower: un,
            append: fn,
            insert: dn,
            remove: vn,
            clone: _n,
            datum: wn,
            on: Nn,
            dispatch: En,
            [Symbol.iterator]: Cn
        };
        var On = zn
          , In = {
            value: () => {}
        };
        function Tn() {
            for (var t, n = 0, e = arguments.length, r = {}; n < e; ++n) {
                if (!(t = arguments[n] + "") || t in r || /[\s.]/.test(t))
                    throw new Error("illegal type: " + t);
                r[t] = []
            }
            return new qn(r)
        }
        function qn(t) {
            this._ = t
        }
        function Hn(t, n) {
            return t.trim().split(/^|\s+/).map((function(t) {
                var e = ""
                  , r = t.indexOf(".");
                if (r >= 0 && (e = t.slice(r + 1),
                t = t.slice(0, r)),
                t && !n.hasOwnProperty(t))
                    throw new Error("unknown type: " + t);
                return {
                    type: t,
                    name: e
                }
            }
            ))
        }
        function Rn(t, n) {
            for (var e, r = 0, i = t.length; r < i; ++r)
                if ((e = t[r]).name === n)
                    return e.value
        }
        function jn(t, n, e) {
            for (var r = 0, i = t.length; r < i; ++r)
                if (t[r].name === n) {
                    t[r] = In,
                    t = t.slice(0, r).concat(t.slice(r + 1));
                    break
                }
            return null != e && t.push({
                name: n,
                value: e
            }),
            t
        }
        qn.prototype = Tn.prototype = {
            constructor: qn,
            on: function(t, n) {
                var e, r = this._, i = Hn(t + "", r), a = -1, o = i.length;
                if (!(arguments.length < 2)) {
                    if (null != n && "function" !== typeof n)
                        throw new Error("invalid callback: " + n);
                    while (++a < o)
                        if (e = (t = i[a]).type)
                            r[e] = jn(r[e], t.name, n);
                        else if (null == n)
                            for (e in r)
                                r[e] = jn(r[e], t.name, null);
                    return this
                }
                while (++a < o)
                    if ((e = (t = i[a]).type) && (e = Rn(r[e], t.name)))
                        return e
            },
            copy: function() {
                var t = {}
                  , n = this._;
                for (var e in n)
                    t[e] = n[e].slice();
                return new qn(t)
            },
            call: function(t, n) {
                if ((e = arguments.length - 2) > 0)
                    for (var e, r, i = new Array(e), a = 0; a < e; ++a)
                        i[a] = arguments[a + 2];
                if (!this._.hasOwnProperty(t))
                    throw new Error("unknown type: " + t);
                for (r = this._[t],
                a = 0,
                e = r.length; a < e; ++a)
                    r[a].value.apply(n, i)
            },
            apply: function(t, n, e) {
                if (!this._.hasOwnProperty(t))
                    throw new Error("unknown type: " + t);
                for (var r = this._[t], i = 0, a = r.length; i < a; ++i)
                    r[i].value.apply(n, e)
            }
        };
        var Ln, Xn, Bn = Tn, Yn = 0, Vn = 0, Zn = 0, Wn = 1e3, Un = 0, Kn = 0, Jn = 0, Gn = "object" === typeof performance && performance.now ? performance : Date, Qn = "object" === typeof window && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
            setTimeout(t, 17)
        }
        ;
        function te() {
            return Kn || (Qn(ne),
            Kn = Gn.now() + Jn)
        }
        function ne() {
            Kn = 0
        }
        function ee() {
            this._call = this._time = this._next = null
        }
        function re(t, n, e) {
            var r = new ee;
            return r.restart(t, n, e),
            r
        }
        function ie() {
            te(),
            ++Yn;
            var t, n = Ln;
            while (n)
                (t = Kn - n._time) >= 0 && n._call.call(void 0, t),
                n = n._next;
            --Yn
        }
        function ae() {
            Kn = (Un = Gn.now()) + Jn,
            Yn = Vn = 0;
            try {
                ie()
            } finally {
                Yn = 0,
                se(),
                Kn = 0
            }
        }
        function oe() {
            var t = Gn.now()
              , n = t - Un;
            n > Wn && (Jn -= n,
            Un = t)
        }
        function se() {
            var t, n, e = Ln, r = 1 / 0;
            while (e)
                e._call ? (r > e._time && (r = e._time),
                t = e,
                e = e._next) : (n = e._next,
                e._next = null,
                e = t ? t._next = n : Ln = n);
            Xn = t,
            ue(r)
        }
        function ue(t) {
            if (!Yn) {
                Vn && (Vn = clearTimeout(Vn));
                var n = t - Kn;
                n > 24 ? (t < 1 / 0 && (Vn = setTimeout(ae, t - Gn.now() - Jn)),
                Zn && (Zn = clearInterval(Zn))) : (Zn || (Un = Gn.now(),
                Zn = setInterval(oe, Wn)),
                Yn = 1,
                Qn(ae))
            }
        }
        function le(t, n, e) {
            var r = new ee;
            return n = null == n ? 0 : +n,
            r.restart((e => {
                r.stop(),
                t(e + n)
            }
            ), n, e),
            r
        }
        ee.prototype = re.prototype = {
            constructor: ee,
            restart: function(t, n, e) {
                if ("function" !== typeof t)
                    throw new TypeError("callback is not a function");
                e = (null == e ? te() : +e) + (null == n ? 0 : +n),
                this._next || Xn === this || (Xn ? Xn._next = this : Ln = this,
                Xn = this),
                this._call = t,
                this._time = e,
                ue()
            },
            stop: function() {
                this._call && (this._call = null,
                this._time = 1 / 0,
                ue())
            }
        };
        var ce = Bn("start", "end", "cancel", "interrupt")
          , he = []
          , fe = 0
          , pe = 1
          , de = 2
          , ge = 3
          , ve = 4
          , ye = 5
          , me = 6;
        function _e(t, n, e, r, i, a) {
            var o = t.__transition;
            if (o) {
                if (e in o)
                    return
            } else
                t.__transition = {};
            ke(t, e, {
                name: n,
                index: r,
                group: i,
                on: ce,
                tween: he,
                time: a.time,
                delay: a.delay,
                duration: a.duration,
                ease: a.ease,
                timer: null,
                state: fe
            })
        }
        function we(t, n) {
            var e = xe(t, n);
            if (e.state > fe)
                throw new Error("too late; already scheduled");
            return e
        }
        function be(t, n) {
            var e = xe(t, n);
            if (e.state > ge)
                throw new Error("too late; already running");
            return e
        }
        function xe(t, n) {
            var e = t.__transition;
            if (!e || !(e = e[n]))
                throw new Error("transition not found");
            return e
        }
        function ke(t, n, e) {
            var r, i = t.__transition;
            function a(t) {
                e.state = pe,
                e.timer.restart(o, e.delay, e.time),
                e.delay <= t && o(t - e.delay)
            }
            function o(a) {
                var l, c, h, f;
                if (e.state !== pe)
                    return u();
                for (l in i)
                    if (f = i[l],
                    f.name === e.name) {
                        if (f.state === ge)
                            return le(o);
                        f.state === ve ? (f.state = me,
                        f.timer.stop(),
                        f.on.call("interrupt", t, t.__data__, f.index, f.group),
                        delete i[l]) : +l < n && (f.state = me,
                        f.timer.stop(),
                        f.on.call("cancel", t, t.__data__, f.index, f.group),
                        delete i[l])
                    }
                if (le((function() {
                    e.state === ge && (e.state = ve,
                    e.timer.restart(s, e.delay, e.time),
                    s(a))
                }
                )),
                e.state = de,
                e.on.call("start", t, t.__data__, e.index, e.group),
                e.state === de) {
                    for (e.state = ge,
                    r = new Array(h = e.tween.length),
                    l = 0,
                    c = -1; l < h; ++l)
                        (f = e.tween[l].value.call(t, t.__data__, e.index, e.group)) && (r[++c] = f);
                    r.length = c + 1
                }
            }
            function s(n) {
                var i = n < e.duration ? e.ease.call(null, n / e.duration) : (e.timer.restart(u),
                e.state = ye,
                1)
                  , a = -1
                  , o = r.length;
                while (++a < o)
                    r[a].call(t, i);
                e.state === ye && (e.on.call("end", t, t.__data__, e.index, e.group),
                u())
            }
            function u() {
                for (var r in e.state = me,
                e.timer.stop(),
                delete i[n],
                i)
                    return;
                delete t.__transition
            }
            i[n] = e,
            e.timer = re(a, 0, e.time)
        }
        function Me(t, n) {
            var e, r, i, a = t.__transition, o = !0;
            if (a) {
                for (i in n = null == n ? null : n + "",
                a)
                    (e = a[i]).name === n ? (r = e.state > de && e.state < ye,
                    e.state = me,
                    e.timer.stop(),
                    e.on.call(r ? "interrupt" : "cancel", t, t.__data__, e.index, e.group),
                    delete a[i]) : o = !1;
                o && delete t.__transition
            }
        }
        function Ne(t) {
            return this.each((function() {
                Me(this, t)
            }
            ))
        }
        function Se(t, n) {
            return t = +t,
            n = +n,
            function(e) {
                return t * (1 - e) + n * e
            }
        }
        var Ae, $e = 180 / Math.PI, Ee = {
            translateX: 0,
            translateY: 0,
            rotate: 0,
            skewX: 0,
            scaleX: 1,
            scaleY: 1
        };
        function Ce(t, n, e, r, i, a) {
            var o, s, u;
            return (o = Math.sqrt(t * t + n * n)) && (t /= o,
            n /= o),
            (u = t * e + n * r) && (e -= t * u,
            r -= n * u),
            (s = Math.sqrt(e * e + r * r)) && (e /= s,
            r /= s,
            u /= s),
            t * r < n * e && (t = -t,
            n = -n,
            u = -u,
            o = -o),
            {
                translateX: i,
                translateY: a,
                rotate: Math.atan2(n, t) * $e,
                skewX: Math.atan(u) * $e,
                scaleX: o,
                scaleY: s
            }
        }
        function Fe(t) {
            const n = new ("function" === typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(t + "");
            return n.isIdentity ? Ee : Ce(n.a, n.b, n.c, n.d, n.e, n.f)
        }
        function Pe(t) {
            return null == t ? Ee : (Ae || (Ae = document.createElementNS("http://www.w3.org/2000/svg", "g")),
            Ae.setAttribute("transform", t),
            (t = Ae.transform.baseVal.consolidate()) ? (t = t.matrix,
            Ce(t.a, t.b, t.c, t.d, t.e, t.f)) : Ee)
        }
        function ze(t, n, e, r) {
            function i(t) {
                return t.length ? t.pop() + " " : ""
            }
            function a(t, r, i, a, o, s) {
                if (t !== i || r !== a) {
                    var u = o.push("translate(", null, n, null, e);
                    s.push({
                        i: u - 4,
                        x: Se(t, i)
                    }, {
                        i: u - 2,
                        x: Se(r, a)
                    })
                } else
                    (i || a) && o.push("translate(" + i + n + a + e)
            }
            function o(t, n, e, a) {
                t !== n ? (t - n > 180 ? n += 360 : n - t > 180 && (t += 360),
                a.push({
                    i: e.push(i(e) + "rotate(", null, r) - 2,
                    x: Se(t, n)
                })) : n && e.push(i(e) + "rotate(" + n + r)
            }
            function s(t, n, e, a) {
                t !== n ? a.push({
                    i: e.push(i(e) + "skewX(", null, r) - 2,
                    x: Se(t, n)
                }) : n && e.push(i(e) + "skewX(" + n + r)
            }
            function u(t, n, e, r, a, o) {
                if (t !== e || n !== r) {
                    var s = a.push(i(a) + "scale(", null, ",", null, ")");
                    o.push({
                        i: s - 4,
                        x: Se(t, e)
                    }, {
                        i: s - 2,
                        x: Se(n, r)
                    })
                } else
                    1 === e && 1 === r || a.push(i(a) + "scale(" + e + "," + r + ")")
            }
            return function(n, e) {
                var r = []
                  , i = [];
                return n = t(n),
                e = t(e),
                a(n.translateX, n.translateY, e.translateX, e.translateY, r, i),
                o(n.rotate, e.rotate, r, i),
                s(n.skewX, e.skewX, r, i),
                u(n.scaleX, n.scaleY, e.scaleX, e.scaleY, r, i),
                n = e = null,
                function(t) {
                    var n, e = -1, a = i.length;
                    while (++e < a)
                        r[(n = i[e]).i] = n.x(t);
                    return r.join("")
                }
            }
        }
        var De = ze(Fe, "px, ", "px)", "deg)")
          , Oe = ze(Pe, ", ", ")", ")");
        function Ie(t, n) {
            var e, r;
            return function() {
                var i = be(this, t)
                  , a = i.tween;
                if (a !== e) {
                    r = e = a;
                    for (var o = 0, s = r.length; o < s; ++o)
                        if (r[o].name === n) {
                            r = r.slice(),
                            r.splice(o, 1);
                            break
                        }
                }
                i.tween = r
            }
        }
        function Te(t, n, e) {
            var r, i;
            if ("function" !== typeof e)
                throw new Error;
            return function() {
                var a = be(this, t)
                  , o = a.tween;
                if (o !== r) {
                    i = (r = o).slice();
                    for (var s = {
                        name: n,
                        value: e
                    }, u = 0, l = i.length; u < l; ++u)
                        if (i[u].name === n) {
                            i[u] = s;
                            break
                        }
                    u === l && i.push(s)
                }
                a.tween = i
            }
        }
        function qe(t, n) {
            var e = this._id;
            if (t += "",
            arguments.length < 2) {
                for (var r, i = xe(this.node(), e).tween, a = 0, o = i.length; a < o; ++a)
                    if ((r = i[a]).name === t)
                        return r.value;
                return null
            }
            return this.each((null == n ? Ie : Te)(e, t, n))
        }
        function He(t, n, e) {
            var r = t._id;
            return t.each((function() {
                var t = be(this, r);
                (t.value || (t.value = {}))[n] = e.apply(this, arguments)
            }
            )),
            function(t) {
                return xe(t, r).value[n]
            }
        }
        function Re(t, n, e) {
            t.prototype = n.prototype = e,
            e.constructor = t
        }
        function je(t, n) {
            var e = Object.create(t.prototype);
            for (var r in n)
                e[r] = n[r];
            return e
        }
        function Le() {}
        var Xe = .7
          , Be = 1 / Xe
          , Ye = "\\s*([+-]?\\d+)\\s*"
          , Ve = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*"
          , Ze = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*"
          , We = /^#([0-9a-f]{3,8})$/
          , Ue = new RegExp(`^rgb\\(${Ye},${Ye},${Ye}\\)$`)
          , Ke = new RegExp(`^rgb\\(${Ze},${Ze},${Ze}\\)$`)
          , Je = new RegExp(`^rgba\\(${Ye},${Ye},${Ye},${Ve}\\)$`)
          , Ge = new RegExp(`^rgba\\(${Ze},${Ze},${Ze},${Ve}\\)$`)
          , Qe = new RegExp(`^hsl\\(${Ve},${Ze},${Ze}\\)$`)
          , tr = new RegExp(`^hsla\\(${Ve},${Ze},${Ze},${Ve}\\)$`)
          , nr = {
            aliceblue: 15792383,
            antiquewhite: 16444375,
            aqua: 65535,
            aquamarine: 8388564,
            azure: 15794175,
            beige: 16119260,
            bisque: 16770244,
            black: 0,
            blanchedalmond: 16772045,
            blue: 255,
            blueviolet: 9055202,
            brown: 10824234,
            burlywood: 14596231,
            cadetblue: 6266528,
            chartreuse: 8388352,
            chocolate: 13789470,
            coral: 16744272,
            cornflowerblue: 6591981,
            cornsilk: 16775388,
            crimson: 14423100,
            cyan: 65535,
            darkblue: 139,
            darkcyan: 35723,
            darkgoldenrod: 12092939,
            darkgray: 11119017,
            darkgreen: 25600,
            darkgrey: 11119017,
            darkkhaki: 12433259,
            darkmagenta: 9109643,
            darkolivegreen: 5597999,
            darkorange: 16747520,
            darkorchid: 10040012,
            darkred: 9109504,
            darksalmon: 15308410,
            darkseagreen: 9419919,
            darkslateblue: 4734347,
            darkslategray: 3100495,
            darkslategrey: 3100495,
            darkturquoise: 52945,
            darkviolet: 9699539,
            deeppink: 16716947,
            deepskyblue: 49151,
            dimgray: 6908265,
            dimgrey: 6908265,
            dodgerblue: 2003199,
            firebrick: 11674146,
            floralwhite: 16775920,
            forestgreen: 2263842,
            fuchsia: 16711935,
            gainsboro: 14474460,
            ghostwhite: 16316671,
            gold: 16766720,
            goldenrod: 14329120,
            gray: 8421504,
            green: 32768,
            greenyellow: 11403055,
            grey: 8421504,
            honeydew: 15794160,
            hotpink: 16738740,
            indianred: 13458524,
            indigo: 4915330,
            ivory: 16777200,
            khaki: 15787660,
            lavender: 15132410,
            lavenderblush: 16773365,
            lawngreen: 8190976,
            lemonchiffon: 16775885,
            lightblue: 11393254,
            lightcoral: 15761536,
            lightcyan: 14745599,
            lightgoldenrodyellow: 16448210,
            lightgray: 13882323,
            lightgreen: 9498256,
            lightgrey: 13882323,
            lightpink: 16758465,
            lightsalmon: 16752762,
            lightseagreen: 2142890,
            lightskyblue: 8900346,
            lightslategray: 7833753,
            lightslategrey: 7833753,
            lightsteelblue: 11584734,
            lightyellow: 16777184,
            lime: 65280,
            limegreen: 3329330,
            linen: 16445670,
            magenta: 16711935,
            maroon: 8388608,
            mediumaquamarine: 6737322,
            mediumblue: 205,
            mediumorchid: 12211667,
            mediumpurple: 9662683,
            mediumseagreen: 3978097,
            mediumslateblue: 8087790,
            mediumspringgreen: 64154,
            mediumturquoise: 4772300,
            mediumvioletred: 13047173,
            midnightblue: 1644912,
            mintcream: 16121850,
            mistyrose: 16770273,
            moccasin: 16770229,
            navajowhite: 16768685,
            navy: 128,
            oldlace: 16643558,
            olive: 8421376,
            olivedrab: 7048739,
            orange: 16753920,
            orangered: 16729344,
            orchid: 14315734,
            palegoldenrod: 15657130,
            palegreen: 10025880,
            paleturquoise: 11529966,
            palevioletred: 14381203,
            papayawhip: 16773077,
            peachpuff: 16767673,
            peru: 13468991,
            pink: 16761035,
            plum: 14524637,
            powderblue: 11591910,
            purple: 8388736,
            rebeccapurple: 6697881,
            red: 16711680,
            rosybrown: 12357519,
            royalblue: 4286945,
            saddlebrown: 9127187,
            salmon: 16416882,
            sandybrown: 16032864,
            seagreen: 3050327,
            seashell: 16774638,
            sienna: 10506797,
            silver: 12632256,
            skyblue: 8900331,
            slateblue: 6970061,
            slategray: 7372944,
            slategrey: 7372944,
            snow: 16775930,
            springgreen: 65407,
            steelblue: 4620980,
            tan: 13808780,
            teal: 32896,
            thistle: 14204888,
            tomato: 16737095,
            turquoise: 4251856,
            violet: 15631086,
            wheat: 16113331,
            white: 16777215,
            whitesmoke: 16119285,
            yellow: 16776960,
            yellowgreen: 10145074
        };
        function er() {
            return this.rgb().formatHex()
        }
        function rr() {
            return this.rgb().formatHex8()
        }
        function ir() {
            return _r(this).formatHsl()
        }
        function ar() {
            return this.rgb().formatRgb()
        }
        function or(t) {
            var n, e;
            return t = (t + "").trim().toLowerCase(),
            (n = We.exec(t)) ? (e = n[1].length,
            n = parseInt(n[1], 16),
            6 === e ? sr(n) : 3 === e ? new hr(n >> 8 & 15 | n >> 4 & 240,n >> 4 & 15 | 240 & n,(15 & n) << 4 | 15 & n,1) : 8 === e ? ur(n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, (255 & n) / 255) : 4 === e ? ur(n >> 12 & 15 | n >> 8 & 240, n >> 8 & 15 | n >> 4 & 240, n >> 4 & 15 | 240 & n, ((15 & n) << 4 | 15 & n) / 255) : null) : (n = Ue.exec(t)) ? new hr(n[1],n[2],n[3],1) : (n = Ke.exec(t)) ? new hr(255 * n[1] / 100,255 * n[2] / 100,255 * n[3] / 100,1) : (n = Je.exec(t)) ? ur(n[1], n[2], n[3], n[4]) : (n = Ge.exec(t)) ? ur(255 * n[1] / 100, 255 * n[2] / 100, 255 * n[3] / 100, n[4]) : (n = Qe.exec(t)) ? mr(n[1], n[2] / 100, n[3] / 100, 1) : (n = tr.exec(t)) ? mr(n[1], n[2] / 100, n[3] / 100, n[4]) : nr.hasOwnProperty(t) ? sr(nr[t]) : "transparent" === t ? new hr(NaN,NaN,NaN,0) : null
        }
        function sr(t) {
            return new hr(t >> 16 & 255,t >> 8 & 255,255 & t,1)
        }
        function ur(t, n, e, r) {
            return r <= 0 && (t = n = e = NaN),
            new hr(t,n,e,r)
        }
        function lr(t) {
            return t instanceof Le || (t = or(t)),
            t ? (t = t.rgb(),
            new hr(t.r,t.g,t.b,t.opacity)) : new hr
        }
        function cr(t, n, e, r) {
            return 1 === arguments.length ? lr(t) : new hr(t,n,e,null == r ? 1 : r)
        }
        function hr(t, n, e, r) {
            this.r = +t,
            this.g = +n,
            this.b = +e,
            this.opacity = +r
        }
        function fr() {
            return `#${yr(this.r)}${yr(this.g)}${yr(this.b)}`
        }
        function pr() {
            return `#${yr(this.r)}${yr(this.g)}${yr(this.b)}${yr(255 * (isNaN(this.opacity) ? 1 : this.opacity))}`
        }
        function dr() {
            const t = gr(this.opacity);
            return `${1 === t ? "rgb(" : "rgba("}${vr(this.r)}, ${vr(this.g)}, ${vr(this.b)}${1 === t ? ")" : `, ${t})`}`
        }
        function gr(t) {
            return isNaN(t) ? 1 : Math.max(0, Math.min(1, t))
        }
        function vr(t) {
            return Math.max(0, Math.min(255, Math.round(t) || 0))
        }
        function yr(t) {
            return t = vr(t),
            (t < 16 ? "0" : "") + t.toString(16)
        }
        function mr(t, n, e, r) {
            return r <= 0 ? t = n = e = NaN : e <= 0 || e >= 1 ? t = n = NaN : n <= 0 && (t = NaN),
            new br(t,n,e,r)
        }
        function _r(t) {
            if (t instanceof br)
                return new br(t.h,t.s,t.l,t.opacity);
            if (t instanceof Le || (t = or(t)),
            !t)
                return new br;
            if (t instanceof br)
                return t;
            t = t.rgb();
            var n = t.r / 255
              , e = t.g / 255
              , r = t.b / 255
              , i = Math.min(n, e, r)
              , a = Math.max(n, e, r)
              , o = NaN
              , s = a - i
              , u = (a + i) / 2;
            return s ? (o = n === a ? (e - r) / s + 6 * (e < r) : e === a ? (r - n) / s + 2 : (n - e) / s + 4,
            s /= u < .5 ? a + i : 2 - a - i,
            o *= 60) : s = u > 0 && u < 1 ? 0 : o,
            new br(o,s,u,t.opacity)
        }
        function wr(t, n, e, r) {
            return 1 === arguments.length ? _r(t) : new br(t,n,e,null == r ? 1 : r)
        }
        function br(t, n, e, r) {
            this.h = +t,
            this.s = +n,
            this.l = +e,
            this.opacity = +r
        }
        function xr(t) {
            return t = (t || 0) % 360,
            t < 0 ? t + 360 : t
        }
        function kr(t) {
            return Math.max(0, Math.min(1, t || 0))
        }
        function Mr(t, n, e) {
            return 255 * (t < 60 ? n + (e - n) * t / 60 : t < 180 ? e : t < 240 ? n + (e - n) * (240 - t) / 60 : n)
        }
        function Nr(t, n, e, r, i) {
            var a = t * t
              , o = a * t;
            return ((1 - 3 * t + 3 * a - o) * n + (4 - 6 * a + 3 * o) * e + (1 + 3 * t + 3 * a - 3 * o) * r + o * i) / 6
        }
        function Sr(t) {
            var n = t.length - 1;
            return function(e) {
                var r = e <= 0 ? e = 0 : e >= 1 ? (e = 1,
                n - 1) : Math.floor(e * n)
                  , i = t[r]
                  , a = t[r + 1]
                  , o = r > 0 ? t[r - 1] : 2 * i - a
                  , s = r < n - 1 ? t[r + 2] : 2 * a - i;
                return Nr((e - r / n) * n, o, i, a, s)
            }
        }
        function Ar(t) {
            var n = t.length;
            return function(e) {
                var r = Math.floor(((e %= 1) < 0 ? ++e : e) * n)
                  , i = t[(r + n - 1) % n]
                  , a = t[r % n]
                  , o = t[(r + 1) % n]
                  , s = t[(r + 2) % n];
                return Nr((e - r / n) * n, i, a, o, s)
            }
        }
        Re(Le, or, {
            copy(t) {
                return Object.assign(new this.constructor, this, t)
            },
            displayable() {
                return this.rgb().displayable()
            },
            hex: er,
            formatHex: er,
            formatHex8: rr,
            formatHsl: ir,
            formatRgb: ar,
            toString: ar
        }),
        Re(hr, cr, je(Le, {
            brighter(t) {
                return t = null == t ? Be : Math.pow(Be, t),
                new hr(this.r * t,this.g * t,this.b * t,this.opacity)
            },
            darker(t) {
                return t = null == t ? Xe : Math.pow(Xe, t),
                new hr(this.r * t,this.g * t,this.b * t,this.opacity)
            },
            rgb() {
                return this
            },
            clamp() {
                return new hr(vr(this.r),vr(this.g),vr(this.b),gr(this.opacity))
            },
            displayable() {
                return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1
            },
            hex: fr,
            formatHex: fr,
            formatHex8: pr,
            formatRgb: dr,
            toString: dr
        })),
        Re(br, wr, je(Le, {
            brighter(t) {
                return t = null == t ? Be : Math.pow(Be, t),
                new br(this.h,this.s,this.l * t,this.opacity)
            },
            darker(t) {
                return t = null == t ? Xe : Math.pow(Xe, t),
                new br(this.h,this.s,this.l * t,this.opacity)
            },
            rgb() {
                var t = this.h % 360 + 360 * (this.h < 0)
                  , n = isNaN(t) || isNaN(this.s) ? 0 : this.s
                  , e = this.l
                  , r = e + (e < .5 ? e : 1 - e) * n
                  , i = 2 * e - r;
                return new hr(Mr(t >= 240 ? t - 240 : t + 120, i, r),Mr(t, i, r),Mr(t < 120 ? t + 240 : t - 120, i, r),this.opacity)
            },
            clamp() {
                return new br(xr(this.h),kr(this.s),kr(this.l),gr(this.opacity))
            },
            displayable() {
                return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1
            },
            formatHsl() {
                const t = gr(this.opacity);
                return `${1 === t ? "hsl(" : "hsla("}${xr(this.h)}, ${100 * kr(this.s)}%, ${100 * kr(this.l)}%${1 === t ? ")" : `, ${t})`}`
            }
        }));
        var $r = t => () => t;
        function Er(t, n) {
            return function(e) {
                return t + e * n
            }
        }
        function Cr(t, n, e) {
            return t = Math.pow(t, e),
            n = Math.pow(n, e) - t,
            e = 1 / e,
            function(r) {
                return Math.pow(t + r * n, e)
            }
        }
        function Fr(t) {
            return 1 === (t = +t) ? Pr : function(n, e) {
                return e - n ? Cr(n, e, t) : $r(isNaN(n) ? e : n)
            }
        }
        function Pr(t, n) {
            var e = n - t;
            return e ? Er(t, e) : $r(isNaN(t) ? n : t)
        }
        var zr = function t(n) {
            var e = Fr(n);
            function r(t, n) {
                var r = e((t = cr(t)).r, (n = cr(n)).r)
                  , i = e(t.g, n.g)
                  , a = e(t.b, n.b)
                  , o = Pr(t.opacity, n.opacity);
                return function(n) {
                    return t.r = r(n),
                    t.g = i(n),
                    t.b = a(n),
                    t.opacity = o(n),
                    t + ""
                }
            }
            return r.gamma = t,
            r
        }(1);
        function Dr(t) {
            return function(n) {
                var e, r, i = n.length, a = new Array(i), o = new Array(i), s = new Array(i);
                for (e = 0; e < i; ++e)
                    r = cr(n[e]),
                    a[e] = r.r || 0,
                    o[e] = r.g || 0,
                    s[e] = r.b || 0;
                return a = t(a),
                o = t(o),
                s = t(s),
                r.opacity = 1,
                function(t) {
                    return r.r = a(t),
                    r.g = o(t),
                    r.b = s(t),
                    r + ""
                }
            }
        }
        Dr(Sr),
        Dr(Ar);
        var Or = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g
          , Ir = new RegExp(Or.source,"g");
        function Tr(t) {
            return function() {
                return t
            }
        }
        function qr(t) {
            return function(n) {
                return t(n) + ""
            }
        }
        function Hr(t, n) {
            var e, r, i, a = Or.lastIndex = Ir.lastIndex = 0, o = -1, s = [], u = [];
            t += "",
            n += "";
            while ((e = Or.exec(t)) && (r = Ir.exec(n)))
                (i = r.index) > a && (i = n.slice(a, i),
                s[o] ? s[o] += i : s[++o] = i),
                (e = e[0]) === (r = r[0]) ? s[o] ? s[o] += r : s[++o] = r : (s[++o] = null,
                u.push({
                    i: o,
                    x: Se(e, r)
                })),
                a = Ir.lastIndex;
            return a < n.length && (i = n.slice(a),
            s[o] ? s[o] += i : s[++o] = i),
            s.length < 2 ? u[0] ? qr(u[0].x) : Tr(n) : (n = u.length,
            function(t) {
                for (var e, r = 0; r < n; ++r)
                    s[(e = u[r]).i] = e.x(t);
                return s.join("")
            }
            )
        }
        function Rr(t, n) {
            var e;
            return ("number" === typeof n ? Se : n instanceof or ? zr : (e = or(n)) ? (n = e,
            zr) : Hr)(t, n)
        }
        function jr(t) {
            return function() {
                this.removeAttribute(t)
            }
        }
        function Lr(t) {
            return function() {
                this.removeAttributeNS(t.space, t.local)
            }
        }
        function Xr(t, n, e) {
            var r, i, a = e + "";
            return function() {
                var o = this.getAttribute(t);
                return o === a ? null : o === r ? i : i = n(r = o, e)
            }
        }
        function Br(t, n, e) {
            var r, i, a = e + "";
            return function() {
                var o = this.getAttributeNS(t.space, t.local);
                return o === a ? null : o === r ? i : i = n(r = o, e)
            }
        }
        function Yr(t, n, e) {
            var r, i, a;
            return function() {
                var o, s, u = e(this);
                if (null != u)
                    return o = this.getAttribute(t),
                    s = u + "",
                    o === s ? null : o === r && s === i ? a : (i = s,
                    a = n(r = o, u));
                this.removeAttribute(t)
            }
        }
        function Vr(t, n, e) {
            var r, i, a;
            return function() {
                var o, s, u = e(this);
                if (null != u)
                    return o = this.getAttributeNS(t.space, t.local),
                    s = u + "",
                    o === s ? null : o === r && s === i ? a : (i = s,
                    a = n(r = o, u));
                this.removeAttributeNS(t.space, t.local)
            }
        }
        function Zr(t, n) {
            var e = kt(t)
              , r = "transform" === e ? Oe : Rr;
            return this.attrTween(t, "function" === typeof n ? (e.local ? Vr : Yr)(e, r, He(this, "attr." + t, n)) : null == n ? (e.local ? Lr : jr)(e) : (e.local ? Br : Xr)(e, r, n))
        }
        function Wr(t, n) {
            return function(e) {
                this.setAttribute(t, n.call(this, e))
            }
        }
        function Ur(t, n) {
            return function(e) {
                this.setAttributeNS(t.space, t.local, n.call(this, e))
            }
        }
        function Kr(t, n) {
            var e, r;
            function i() {
                var i = n.apply(this, arguments);
                return i !== r && (e = (r = i) && Ur(t, i)),
                e
            }
            return i._value = n,
            i
        }
        function Jr(t, n) {
            var e, r;
            function i() {
                var i = n.apply(this, arguments);
                return i !== r && (e = (r = i) && Wr(t, i)),
                e
            }
            return i._value = n,
            i
        }
        function Gr(t, n) {
            var e = "attr." + t;
            if (arguments.length < 2)
                return (e = this.tween(e)) && e._value;
            if (null == n)
                return this.tween(e, null);
            if ("function" !== typeof n)
                throw new Error;
            var r = kt(t);
            return this.tween(e, (r.local ? Kr : Jr)(r, n))
        }
        function Qr(t, n) {
            return function() {
                we(this, t).delay = +n.apply(this, arguments)
            }
        }
        function ti(t, n) {
            return n = +n,
            function() {
                we(this, t).delay = n
            }
        }
        function ni(t) {
            var n = this._id;
            return arguments.length ? this.each(("function" === typeof t ? Qr : ti)(n, t)) : xe(this.node(), n).delay
        }
        function ei(t, n) {
            return function() {
                be(this, t).duration = +n.apply(this, arguments)
            }
        }
        function ri(t, n) {
            return n = +n,
            function() {
                be(this, t).duration = n
            }
        }
        function ii(t) {
            var n = this._id;
            return arguments.length ? this.each(("function" === typeof t ? ei : ri)(n, t)) : xe(this.node(), n).duration
        }
        function ai(t, n) {
            if ("function" !== typeof n)
                throw new Error;
            return function() {
                be(this, t).ease = n
            }
        }
        function oi(t) {
            var n = this._id;
            return arguments.length ? this.each(ai(n, t)) : xe(this.node(), n).ease
        }
        function si(t, n) {
            return function() {
                var e = n.apply(this, arguments);
                if ("function" !== typeof e)
                    throw new Error;
                be(this, t).ease = e
            }
        }
        function ui(t) {
            if ("function" !== typeof t)
                throw new Error;
            return this.each(si(this._id, t))
        }
        function li(t) {
            "function" !== typeof t && (t = X(t));
            for (var n = this._groups, e = n.length, r = new Array(e), i = 0; i < e; ++i)
                for (var a, o = n[i], s = o.length, u = r[i] = [], l = 0; l < s; ++l)
                    (a = o[l]) && t.call(a, a.__data__, l, o) && u.push(a);
            return new qi(r,this._parents,this._name,this._id)
        }
        function ci(t) {
            if (t._id !== this._id)
                throw new Error;
            for (var n = this._groups, e = t._groups, r = n.length, i = e.length, a = Math.min(r, i), o = new Array(r), s = 0; s < a; ++s)
                for (var u, l = n[s], c = e[s], h = l.length, f = o[s] = new Array(h), p = 0; p < h; ++p)
                    (u = l[p] || c[p]) && (f[p] = u);
            for (; s < r; ++s)
                o[s] = n[s];
            return new qi(o,this._parents,this._name,this._id)
        }
        function hi(t) {
            return (t + "").trim().split(/^|\s+/).every((function(t) {
                var n = t.indexOf(".");
                return n >= 0 && (t = t.slice(0, n)),
                !t || "start" === t
            }
            ))
        }
        function fi(t, n, e) {
            var r, i, a = hi(n) ? we : be;
            return function() {
                var o = a(this, t)
                  , s = o.on;
                s !== r && (i = (r = s).copy()).on(n, e),
                o.on = i
            }
        }
        function pi(t, n) {
            var e = this._id;
            return arguments.length < 2 ? xe(this.node(), e).on.on(t) : this.each(fi(e, t, n))
        }
        function di(t) {
            return function() {
                var n = this.parentNode;
                for (var e in this.__transition)
                    if (+e !== t)
                        return;
                n && n.removeChild(this)
            }
        }
        function gi() {
            return this.on("end.remove", di(this._id))
        }
        function vi(t) {
            var n = this._name
              , e = this._id;
            "function" !== typeof t && (t = I(t));
            for (var r = this._groups, i = r.length, a = new Array(i), o = 0; o < i; ++o)
                for (var s, u, l = r[o], c = l.length, h = a[o] = new Array(c), f = 0; f < c; ++f)
                    (s = l[f]) && (u = t.call(s, s.__data__, f, l)) && ("__data__"in s && (u.__data__ = s.__data__),
                    h[f] = u,
                    _e(h[f], n, e, f, h, xe(s, e)));
            return new qi(a,this._parents,n,e)
        }
        function yi(t) {
            var n = this._name
              , e = this._id;
            "function" !== typeof t && (t = R(t));
            for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s)
                for (var u, l = r[s], c = l.length, h = 0; h < c; ++h)
                    if (u = l[h]) {
                        for (var f, p = t.call(u, u.__data__, h, l), d = xe(u, e), g = 0, v = p.length; g < v; ++g)
                            (f = p[g]) && _e(f, n, e, g, p, d);
                        a.push(p),
                        o.push(u)
                    }
            return new qi(a,o,n,e)
        }
        var mi = On.prototype.constructor;
        function _i() {
            return new mi(this._groups,this._parents)
        }
        function wi(t, n) {
            var e, r, i;
            return function() {
                var a = It(this, t)
                  , o = (this.style.removeProperty(t),
                It(this, t));
                return a === o ? null : a === e && o === r ? i : i = n(e = a, r = o)
            }
        }
        function bi(t) {
            return function() {
                this.style.removeProperty(t)
            }
        }
        function xi(t, n, e) {
            var r, i, a = e + "";
            return function() {
                var o = It(this, t);
                return o === a ? null : o === r ? i : i = n(r = o, e)
            }
        }
        function ki(t, n, e) {
            var r, i, a;
            return function() {
                var o = It(this, t)
                  , s = e(this)
                  , u = s + "";
                return null == s && (this.style.removeProperty(t),
                u = s = It(this, t)),
                o === u ? null : o === r && u === i ? a : (i = u,
                a = n(r = o, s))
            }
        }
        function Mi(t, n) {
            var e, r, i, a, o = "style." + n, s = "end." + o;
            return function() {
                var u = be(this, t)
                  , l = u.on
                  , c = null == u.value[o] ? a || (a = bi(n)) : void 0;
                l === e && i === c || (r = (e = l).copy()).on(s, i = c),
                u.on = r
            }
        }
        function Ni(t, n, e) {
            var r = "transform" === (t += "") ? De : Rr;
            return null == n ? this.styleTween(t, wi(t, r)).on("end.style." + t, bi(t)) : "function" === typeof n ? this.styleTween(t, ki(t, r, He(this, "style." + t, n))).each(Mi(this._id, t)) : this.styleTween(t, xi(t, r, n), e).on("end.style." + t, null)
        }
        function Si(t, n, e) {
            return function(r) {
                this.style.setProperty(t, n.call(this, r), e)
            }
        }
        function Ai(t, n, e) {
            var r, i;
            function a() {
                var a = n.apply(this, arguments);
                return a !== i && (r = (i = a) && Si(t, a, e)),
                r
            }
            return a._value = n,
            a
        }
        function $i(t, n, e) {
            var r = "style." + (t += "");
            if (arguments.length < 2)
                return (r = this.tween(r)) && r._value;
            if (null == n)
                return this.tween(r, null);
            if ("function" !== typeof n)
                throw new Error;
            return this.tween(r, Ai(t, n, null == e ? "" : e))
        }
        function Ei(t) {
            return function() {
                this.textContent = t
            }
        }
        function Ci(t) {
            return function() {
                var n = t(this);
                this.textContent = null == n ? "" : n
            }
        }
        function Fi(t) {
            return this.tween("text", "function" === typeof t ? Ci(He(this, "text", t)) : Ei(null == t ? "" : t + ""))
        }
        function Pi(t) {
            return function(n) {
                this.textContent = t.call(this, n)
            }
        }
        function zi(t) {
            var n, e;
            function r() {
                var r = t.apply(this, arguments);
                return r !== e && (n = (e = r) && Pi(r)),
                n
            }
            return r._value = t,
            r
        }
        function Di(t) {
            var n = "text";
            if (arguments.length < 1)
                return (n = this.tween(n)) && n._value;
            if (null == t)
                return this.tween(n, null);
            if ("function" !== typeof t)
                throw new Error;
            return this.tween(n, zi(t))
        }
        function Oi() {
            for (var t = this._name, n = this._id, e = Ri(), r = this._groups, i = r.length, a = 0; a < i; ++a)
                for (var o, s = r[a], u = s.length, l = 0; l < u; ++l)
                    if (o = s[l]) {
                        var c = xe(o, n);
                        _e(o, t, e, l, s, {
                            time: c.time + c.delay + c.duration,
                            delay: 0,
                            duration: c.duration,
                            ease: c.ease
                        })
                    }
            return new qi(r,this._parents,t,e)
        }
        function Ii() {
            var t, n, e = this, r = e._id, i = e.size();
            return new Promise((function(a, o) {
                var s = {
                    value: o
                }
                  , u = {
                    value: function() {
                        0 === --i && a()
                    }
                };
                e.each((function() {
                    var e = be(this, r)
                      , i = e.on;
                    i !== t && (n = (t = i).copy(),
                    n._.cancel.push(s),
                    n._.interrupt.push(s),
                    n._.end.push(u)),
                    e.on = n
                }
                )),
                0 === i && a()
            }
            ))
        }
        var Ti = 0;
        function qi(t, n, e, r) {
            this._groups = t,
            this._parents = n,
            this._name = e,
            this._id = r
        }
        function Hi(t) {
            return On().transition(t)
        }
        function Ri() {
            return ++Ti
        }
        var ji = On.prototype;
        function Li(t) {
            return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2
        }
        qi.prototype = Hi.prototype = {
            constructor: qi,
            select: vi,
            selectAll: yi,
            selectChild: ji.selectChild,
            selectChildren: ji.selectChildren,
            filter: li,
            merge: ci,
            selection: _i,
            transition: Oi,
            call: ji.call,
            nodes: ji.nodes,
            node: ji.node,
            size: ji.size,
            empty: ji.empty,
            each: ji.each,
            on: pi,
            attr: Zr,
            attrTween: Gr,
            style: Ni,
            styleTween: $i,
            text: Fi,
            textTween: Di,
            remove: gi,
            tween: qe,
            delay: ni,
            duration: ii,
            ease: oi,
            easeVarying: ui,
            end: Ii,
            [Symbol.iterator]: ji[Symbol.iterator]
        };
        var Xi = {
            time: null,
            delay: 0,
            duration: 250,
            ease: Li
        };
        function Bi(t, n) {
            var e;
            while (!(e = t.__transition) || !(e = e[n]))
                if (!(t = t.parentNode))
                    throw new Error(`transition ${n} not found`);
            return e
        }
        function Yi(t) {
            var n, e;
            t instanceof qi ? (n = t._id,
            t = t._name) : (n = Ri(),
            (e = Xi).time = te(),
            t = null == t ? null : t + "");
            for (var r = this._groups, i = r.length, a = 0; a < i; ++a)
                for (var o, s = r[a], u = s.length, l = 0; l < u; ++l)
                    (o = s[l]) && _e(o, t, n, l, s, e || Bi(o, n));
            return new qi(r,this._parents,t,n)
        }
        On.prototype.interrupt = Ne,
        On.prototype.transition = Yi;
        const {abs: Vi, max: Zi, min: Wi} = Math;
        function Ui(t) {
            return [+t[0], +t[1]]
        }
        function Ki(t) {
            return [Ui(t[0]), Ui(t[1])]
        }
        ["w", "e"].map(Ji),
        ["n", "s"].map(Ji),
        ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(Ji);
        function Ji(t) {
            return {
                type: t
            }
        }
        function Gi(t) {
            if (!t.ok)
                throw new Error(t.status + " " + t.statusText);
            return t.text()
        }
        function Qi(t, n) {
            return fetch(t, n).then(Gi)
        }
        function ta(t) {
            return (n, e) => Qi(n, e).then((n => (new DOMParser).parseFromString(n, t)))
        }
        ta("application/xml"),
        ta("text/html");
        var na = ta("image/svg+xml");
        function ea(t, n) {
            switch (arguments.length) {
            case 0:
                break;
            case 1:
                this.range(t);
                break;
            default:
                this.range(n).domain(t);
                break
            }
            return this
        }
        class ra extends Map {
            constructor(t, n=sa) {
                if (super(),
                Object.defineProperties(this, {
                    _intern: {
                        value: new Map
                    },
                    _key: {
                        value: n
                    }
                }),
                null != t)
                    for (const [e,r] of t)
                        this.set(e, r)
            }
            get(t) {
                return super.get(ia(this, t))
            }
            has(t) {
                return super.has(ia(this, t))
            }
            set(t, n) {
                return super.set(aa(this, t), n)
            }
            delete(t) {
                return super.delete(oa(this, t))
            }
        }
        Set;
        function ia({_intern: t, _key: n}, e) {
            const r = n(e);
            return t.has(r) ? t.get(r) : e
        }
        function aa({_intern: t, _key: n}, e) {
            const r = n(e);
            return t.has(r) ? t.get(r) : (t.set(r, e),
            e)
        }
        function oa({_intern: t, _key: n}, e) {
            const r = n(e);
            return t.has(r) && (e = t.get(r),
            t.delete(r)),
            e
        }
        function sa(t) {
            return null !== t && "object" === typeof t ? t.valueOf() : t
        }
        const ua = Symbol("implicit");
        function la() {
            var t = new ra
              , n = []
              , e = []
              , r = ua;
            function i(i) {
                let a = t.get(i);
                if (void 0 === a) {
                    if (r !== ua)
                        return r;
                    t.set(i, a = n.push(i) - 1)
                }
                return e[a % e.length]
            }
            return i.domain = function(e) {
                if (!arguments.length)
                    return n.slice();
                n = [],
                t = new ra;
                for (const r of e)
                    t.has(r) || t.set(r, n.push(r) - 1);
                return i
            }
            ,
            i.range = function(t) {
                return arguments.length ? (e = Array.from(t),
                i) : e.slice()
            }
            ,
            i.unknown = function(t) {
                return arguments.length ? (r = t,
                i) : r
            }
            ,
            i.copy = function() {
                return la(n, e).unknown(r)
            }
            ,
            ea.apply(i, arguments),
            i
        }
        function ca() {
            var t, n, e = la().unknown(void 0), r = e.domain, i = e.range, a = 0, o = 1, s = !1, u = 0, l = 0, c = .5;
            function h() {
                var e = r().length
                  , h = o < a
                  , f = h ? o : a
                  , p = h ? a : o;
                t = (p - f) / Math.max(1, e - u + 2 * l),
                s && (t = Math.floor(t)),
                f += (p - f - t * (e - u)) * c,
                n = t * (1 - u),
                s && (f = Math.round(f),
                n = Math.round(n));
                var d = w(e).map((function(n) {
                    return f + t * n
                }
                ));
                return i(h ? d.reverse() : d)
            }
            return delete e.unknown,
            e.domain = function(t) {
                return arguments.length ? (r(t),
                h()) : r()
            }
            ,
            e.range = function(t) {
                return arguments.length ? ([a,o] = t,
                a = +a,
                o = +o,
                h()) : [a, o]
            }
            ,
            e.rangeRound = function(t) {
                return [a,o] = t,
                a = +a,
                o = +o,
                s = !0,
                h()
            }
            ,
            e.bandwidth = function() {
                return n
            }
            ,
            e.step = function() {
                return t
            }
            ,
            e.round = function(t) {
                return arguments.length ? (s = !!t,
                h()) : s
            }
            ,
            e.padding = function(t) {
                return arguments.length ? (u = Math.min(1, l = +t),
                h()) : u
            }
            ,
            e.paddingInner = function(t) {
                return arguments.length ? (u = Math.min(1, t),
                h()) : u
            }
            ,
            e.paddingOuter = function(t) {
                return arguments.length ? (l = +t,
                h()) : l
            }
            ,
            e.align = function(t) {
                return arguments.length ? (c = Math.max(0, Math.min(1, t)),
                h()) : c
            }
            ,
            e.copy = function() {
                return ca(r(), [a, o]).round(s).paddingInner(u).paddingOuter(l).align(c)
            }
            ,
            ea.apply(h(), arguments)
        }
        var ha = Math.sqrt(50)
          , fa = Math.sqrt(10)
          , pa = Math.sqrt(2);
        function da(t, n, e) {
            var r, i, a, o, s = -1;
            if (n = +n,
            t = +t,
            e = +e,
            t === n && e > 0)
                return [t];
            if ((r = n < t) && (i = t,
            t = n,
            n = i),
            0 === (o = ga(t, n, e)) || !isFinite(o))
                return [];
            if (o > 0) {
                let e = Math.round(t / o)
                  , r = Math.round(n / o);
                e * o < t && ++e,
                r * o > n && --r,
                a = new Array(i = r - e + 1);
                while (++s < i)
                    a[s] = (e + s) * o
            } else {
                o = -o;
                let e = Math.round(t * o)
                  , r = Math.round(n * o);
                e / o < t && ++e,
                r / o > n && --r,
                a = new Array(i = r - e + 1);
                while (++s < i)
                    a[s] = (e + s) / o
            }
            return r && a.reverse(),
            a
        }
        function ga(t, n, e) {
            var r = (n - t) / Math.max(0, e)
              , i = Math.floor(Math.log(r) / Math.LN10)
              , a = r / Math.pow(10, i);
            return i >= 0 ? (a >= ha ? 10 : a >= fa ? 5 : a >= pa ? 2 : 1) * Math.pow(10, i) : -Math.pow(10, -i) / (a >= ha ? 10 : a >= fa ? 5 : a >= pa ? 2 : 1)
        }
        function va(t, n, e) {
            var r = Math.abs(n - t) / Math.max(0, e)
              , i = Math.pow(10, Math.floor(Math.log(r) / Math.LN10))
              , a = r / i;
            return a >= ha ? i *= 10 : a >= fa ? i *= 5 : a >= pa && (i *= 2),
            n < t ? -i : i
        }
        function ya(t, n) {
            return null == t || null == n ? NaN : t < n ? -1 : t > n ? 1 : t >= n ? 0 : NaN
        }
        function ma(t, n) {
            return null == t || null == n ? NaN : n < t ? -1 : n > t ? 1 : n >= t ? 0 : NaN
        }
        function _a(t) {
            let n, e, r;
            function i(t, r, i=0, a=t.length) {
                if (i < a) {
                    if (0 !== n(r, r))
                        return a;
                    do {
                        const n = i + a >>> 1;
                        e(t[n], r) < 0 ? i = n + 1 : a = n
                    } while (i < a)
                }
                return i
            }
            function a(t, r, i=0, a=t.length) {
                if (i < a) {
                    if (0 !== n(r, r))
                        return a;
                    do {
                        const n = i + a >>> 1;
                        e(t[n], r) <= 0 ? i = n + 1 : a = n
                    } while (i < a)
                }
                return i
            }
            function o(t, n, e=0, a=t.length) {
                const o = i(t, n, e, a - 1);
                return o > e && r(t[o - 1], n) > -r(t[o], n) ? o - 1 : o
            }
            return 2 !== t.length ? (n = ya,
            e = (n, e) => ya(t(n), e),
            r = (n, e) => t(n) - e) : (n = t === ya || t === ma ? t : wa,
            e = t,
            r = t),
            {
                left: i,
                center: o,
                right: a
            }
        }
        function wa() {
            return 0
        }
        function ba(t) {
            return null === t ? NaN : +t
        }
        const xa = _a(ya)
          , ka = xa.right;
        xa.left,
        _a(ba).center;
        var Ma = ka;
        function Na(t, n) {
            var e, r = n ? n.length : 0, i = t ? Math.min(r, t.length) : 0, a = new Array(i), o = new Array(r);
            for (e = 0; e < i; ++e)
                a[e] = Ca(t[e], n[e]);
            for (; e < r; ++e)
                o[e] = n[e];
            return function(t) {
                for (e = 0; e < i; ++e)
                    o[e] = a[e](t);
                return o
            }
        }
        function Sa(t, n) {
            var e = new Date;
            return t = +t,
            n = +n,
            function(r) {
                return e.setTime(t * (1 - r) + n * r),
                e
            }
        }
        function Aa(t, n) {
            var e, r = {}, i = {};
            for (e in null !== t && "object" === typeof t || (t = {}),
            null !== n && "object" === typeof n || (n = {}),
            n)
                e in t ? r[e] = Ca(t[e], n[e]) : i[e] = n[e];
            return function(t) {
                for (e in r)
                    i[e] = r[e](t);
                return i
            }
        }
        function $a(t, n) {
            n || (n = []);
            var e, r = t ? Math.min(n.length, t.length) : 0, i = n.slice();
            return function(a) {
                for (e = 0; e < r; ++e)
                    i[e] = t[e] * (1 - a) + n[e] * a;
                return i
            }
        }
        function Ea(t) {
            return ArrayBuffer.isView(t) && !(t instanceof DataView)
        }
        function Ca(t, n) {
            var e, r = typeof n;
            return null == n || "boolean" === r ? $r(n) : ("number" === r ? Se : "string" === r ? (e = or(n)) ? (n = e,
            zr) : Hr : n instanceof or ? zr : n instanceof Date ? Sa : Ea(n) ? $a : Array.isArray(n) ? Na : "function" !== typeof n.valueOf && "function" !== typeof n.toString || isNaN(n) ? Aa : Se)(t, n)
        }
        function Fa(t, n) {
            return t = +t,
            n = +n,
            function(e) {
                return Math.round(t * (1 - e) + n * e)
            }
        }
        function Pa(t) {
            return function() {
                return t
            }
        }
        function za(t) {
            return +t
        }
        var Da = [0, 1];
        function Oa(t) {
            return t
        }
        function Ia(t, n) {
            return (n -= t = +t) ? function(e) {
                return (e - t) / n
            }
            : Pa(isNaN(n) ? NaN : .5)
        }
        function Ta(t, n) {
            var e;
            return t > n && (e = t,
            t = n,
            n = e),
            function(e) {
                return Math.max(t, Math.min(n, e))
            }
        }
        function qa(t, n, e) {
            var r = t[0]
              , i = t[1]
              , a = n[0]
              , o = n[1];
            return i < r ? (r = Ia(i, r),
            a = e(o, a)) : (r = Ia(r, i),
            a = e(a, o)),
            function(t) {
                return a(r(t))
            }
        }
        function Ha(t, n, e) {
            var r = Math.min(t.length, n.length) - 1
              , i = new Array(r)
              , a = new Array(r)
              , o = -1;
            t[r] < t[0] && (t = t.slice().reverse(),
            n = n.slice().reverse());
            while (++o < r)
                i[o] = Ia(t[o], t[o + 1]),
                a[o] = e(n[o], n[o + 1]);
            return function(n) {
                var e = Ma(t, n, 1, r) - 1;
                return a[e](i[e](n))
            }
        }
        function Ra(t, n) {
            return n.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp()).unknown(t.unknown())
        }
        function ja() {
            var t, n, e, r, i, a, o = Da, s = Da, u = Ca, l = Oa;
            function c() {
                var t = Math.min(o.length, s.length);
                return l !== Oa && (l = Ta(o[0], o[t - 1])),
                r = t > 2 ? Ha : qa,
                i = a = null,
                h
            }
            function h(n) {
                return null == n || isNaN(n = +n) ? e : (i || (i = r(o.map(t), s, u)))(t(l(n)))
            }
            return h.invert = function(e) {
                return l(n((a || (a = r(s, o.map(t), Se)))(e)))
            }
            ,
            h.domain = function(t) {
                return arguments.length ? (o = Array.from(t, za),
                c()) : o.slice()
            }
            ,
            h.range = function(t) {
                return arguments.length ? (s = Array.from(t),
                c()) : s.slice()
            }
            ,
            h.rangeRound = function(t) {
                return s = Array.from(t),
                u = Fa,
                c()
            }
            ,
            h.clamp = function(t) {
                return arguments.length ? (l = !!t || Oa,
                c()) : l !== Oa
            }
            ,
            h.interpolate = function(t) {
                return arguments.length ? (u = t,
                c()) : u
            }
            ,
            h.unknown = function(t) {
                return arguments.length ? (e = t,
                h) : e
            }
            ,
            function(e, r) {
                return t = e,
                n = r,
                c()
            }
        }
        function La() {
            return ja()(Oa, Oa)
        }
        var Xa, Ba = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
        function Ya(t) {
            if (!(n = Ba.exec(t)))
                throw new Error("invalid format: " + t);
            var n;
            return new Va({
                fill: n[1],
                align: n[2],
                sign: n[3],
                symbol: n[4],
                zero: n[5],
                width: n[6],
                comma: n[7],
                precision: n[8] && n[8].slice(1),
                trim: n[9],
                type: n[10]
            })
        }
        function Va(t) {
            this.fill = void 0 === t.fill ? " " : t.fill + "",
            this.align = void 0 === t.align ? ">" : t.align + "",
            this.sign = void 0 === t.sign ? "-" : t.sign + "",
            this.symbol = void 0 === t.symbol ? "" : t.symbol + "",
            this.zero = !!t.zero,
            this.width = void 0 === t.width ? void 0 : +t.width,
            this.comma = !!t.comma,
            this.precision = void 0 === t.precision ? void 0 : +t.precision,
            this.trim = !!t.trim,
            this.type = void 0 === t.type ? "" : t.type + ""
        }
        function Za(t) {
            return Math.abs(t = Math.round(t)) >= 1e21 ? t.toLocaleString("en").replace(/,/g, "") : t.toString(10)
        }
        function Wa(t, n) {
            if ((e = (t = n ? t.toExponential(n - 1) : t.toExponential()).indexOf("e")) < 0)
                return null;
            var e, r = t.slice(0, e);
            return [r.length > 1 ? r[0] + r.slice(2) : r, +t.slice(e + 1)]
        }
        function Ua(t) {
            return t = Wa(Math.abs(t)),
            t ? t[1] : NaN
        }
        function Ka(t, n) {
            return Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor(Ua(n) / 3))) - Ua(Math.abs(t)))
        }
        function Ja(t, n) {
            return function(e, r) {
                var i = e.length
                  , a = []
                  , o = 0
                  , s = t[0]
                  , u = 0;
                while (i > 0 && s > 0) {
                    if (u + s + 1 > r && (s = Math.max(1, r - u)),
                    a.push(e.substring(i -= s, i + s)),
                    (u += s + 1) > r)
                        break;
                    s = t[o = (o + 1) % t.length]
                }
                return a.reverse().join(n)
            }
        }
        function Ga(t) {
            return function(n) {
                return n.replace(/[0-9]/g, (function(n) {
                    return t[+n]
                }
                ))
            }
        }
        function Qa(t) {
            t: for (var n, e = t.length, r = 1, i = -1; r < e; ++r)
                switch (t[r]) {
                case ".":
                    i = n = r;
                    break;
                case "0":
                    0 === i && (i = r),
                    n = r;
                    break;
                default:
                    if (!+t[r])
                        break t;
                    i > 0 && (i = 0);
                    break
                }
            return i > 0 ? t.slice(0, i) + t.slice(n + 1) : t
        }
        function to(t, n) {
            var e = Wa(t, n);
            if (!e)
                return t + "";
            var r = e[0]
              , i = e[1]
              , a = i - (Xa = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1
              , o = r.length;
            return a === o ? r : a > o ? r + new Array(a - o + 1).join("0") : a > 0 ? r.slice(0, a) + "." + r.slice(a) : "0." + new Array(1 - a).join("0") + Wa(t, Math.max(0, n + a - 1))[0]
        }
        function no(t, n) {
            var e = Wa(t, n);
            if (!e)
                return t + "";
            var r = e[0]
              , i = e[1];
            return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0")
        }
        Ya.prototype = Va.prototype,
        Va.prototype.toString = function() {
            return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (void 0 === this.width ? "" : Math.max(1, 0 | this.width)) + (this.comma ? "," : "") + (void 0 === this.precision ? "" : "." + Math.max(0, 0 | this.precision)) + (this.trim ? "~" : "") + this.type
        }
        ;
        var eo = {
            "%": (t, n) => (100 * t).toFixed(n),
            b: t => Math.round(t).toString(2),
            c: t => t + "",
            d: Za,
            e: (t, n) => t.toExponential(n),
            f: (t, n) => t.toFixed(n),
            g: (t, n) => t.toPrecision(n),
            o: t => Math.round(t).toString(8),
            p: (t, n) => no(100 * t, n),
            r: no,
            s: to,
            X: t => Math.round(t).toString(16).toUpperCase(),
            x: t => Math.round(t).toString(16)
        };
        function ro(t) {
            return t
        }
        var io, ao, oo, so = Array.prototype.map, uo = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
        function lo(t) {
            var n = void 0 === t.grouping || void 0 === t.thousands ? ro : Ja(so.call(t.grouping, Number), t.thousands + "")
              , e = void 0 === t.currency ? "" : t.currency[0] + ""
              , r = void 0 === t.currency ? "" : t.currency[1] + ""
              , i = void 0 === t.decimal ? "." : t.decimal + ""
              , a = void 0 === t.numerals ? ro : Ga(so.call(t.numerals, String))
              , o = void 0 === t.percent ? "%" : t.percent + ""
              , s = void 0 === t.minus ? "−" : t.minus + ""
              , u = void 0 === t.nan ? "NaN" : t.nan + "";
            function l(t) {
                t = Ya(t);
                var l = t.fill
                  , c = t.align
                  , h = t.sign
                  , f = t.symbol
                  , p = t.zero
                  , d = t.width
                  , g = t.comma
                  , v = t.precision
                  , y = t.trim
                  , m = t.type;
                "n" === m ? (g = !0,
                m = "g") : eo[m] || (void 0 === v && (v = 12),
                y = !0,
                m = "g"),
                (p || "0" === l && "=" === c) && (p = !0,
                l = "0",
                c = "=");
                var _ = "$" === f ? e : "#" === f && /[boxX]/.test(m) ? "0" + m.toLowerCase() : ""
                  , w = "$" === f ? r : /[%p]/.test(m) ? o : ""
                  , b = eo[m]
                  , x = /[defgprs%]/.test(m);
                function k(t) {
                    var e, r, o, f = _, k = w;
                    if ("c" === m)
                        k = b(t) + k,
                        t = "";
                    else {
                        t = +t;
                        var M = t < 0 || 1 / t < 0;
                        if (t = isNaN(t) ? u : b(Math.abs(t), v),
                        y && (t = Qa(t)),
                        M && 0 === +t && "+" !== h && (M = !1),
                        f = (M ? "(" === h ? h : s : "-" === h || "(" === h ? "" : h) + f,
                        k = ("s" === m ? uo[8 + Xa / 3] : "") + k + (M && "(" === h ? ")" : ""),
                        x) {
                            e = -1,
                            r = t.length;
                            while (++e < r)
                                if (o = t.charCodeAt(e),
                                48 > o || o > 57) {
                                    k = (46 === o ? i + t.slice(e + 1) : t.slice(e)) + k,
                                    t = t.slice(0, e);
                                    break
                                }
                        }
                    }
                    g && !p && (t = n(t, 1 / 0));
                    var N = f.length + t.length + k.length
                      , S = N < d ? new Array(d - N + 1).join(l) : "";
                    switch (g && p && (t = n(S + t, S.length ? d - k.length : 1 / 0),
                    S = ""),
                    c) {
                    case "<":
                        t = f + t + k + S;
                        break;
                    case "=":
                        t = f + S + t + k;
                        break;
                    case "^":
                        t = S.slice(0, N = S.length >> 1) + f + t + k + S.slice(N);
                        break;
                    default:
                        t = S + f + t + k;
                        break
                    }
                    return a(t)
                }
                return v = void 0 === v ? 6 : /[gprs]/.test(m) ? Math.max(1, Math.min(21, v)) : Math.max(0, Math.min(20, v)),
                k.toString = function() {
                    return t + ""
                }
                ,
                k
            }
            function c(t, n) {
                var e = l((t = Ya(t),
                t.type = "f",
                t))
                  , r = 3 * Math.max(-8, Math.min(8, Math.floor(Ua(n) / 3)))
                  , i = Math.pow(10, -r)
                  , a = uo[8 + r / 3];
                return function(t) {
                    return e(i * t) + a
                }
            }
            return {
                format: l,
                formatPrefix: c
            }
        }
        function co(t) {
            return io = lo(t),
            ao = io.format,
            oo = io.formatPrefix,
            io
        }
        function ho(t, n) {
            return t = Math.abs(t),
            n = Math.abs(n) - t,
            Math.max(0, Ua(n) - Ua(t)) + 1
        }
        function fo(t) {
            return Math.max(0, -Ua(Math.abs(t)))
        }
        function po(t, n, e, r) {
            var i, a = va(t, n, e);
            switch (r = Ya(null == r ? ",f" : r),
            r.type) {
            case "s":
                var o = Math.max(Math.abs(t), Math.abs(n));
                return null != r.precision || isNaN(i = Ka(a, o)) || (r.precision = i),
                oo(r, o);
            case "":
            case "e":
            case "g":
            case "p":
            case "r":
                null != r.precision || isNaN(i = ho(a, Math.max(Math.abs(t), Math.abs(n)))) || (r.precision = i - ("e" === r.type));
                break;
            case "f":
            case "%":
                null != r.precision || isNaN(i = fo(a)) || (r.precision = i - 2 * ("%" === r.type));
                break
            }
            return ao(r)
        }
        function go(t) {
            var n = t.domain;
            return t.ticks = function(t) {
                var e = n();
                return da(e[0], e[e.length - 1], null == t ? 10 : t)
            }
            ,
            t.tickFormat = function(t, e) {
                var r = n();
                return po(r[0], r[r.length - 1], null == t ? 10 : t, e)
            }
            ,
            t.nice = function(e) {
                null == e && (e = 10);
                var r, i, a = n(), o = 0, s = a.length - 1, u = a[o], l = a[s], c = 10;
                l < u && (i = u,
                u = l,
                l = i,
                i = o,
                o = s,
                s = i);
                while (c-- > 0) {
                    if (i = ga(u, l, e),
                    i === r)
                        return a[o] = u,
                        a[s] = l,
                        n(a);
                    if (i > 0)
                        u = Math.floor(u / i) * i,
                        l = Math.ceil(l / i) * i;
                    else {
                        if (!(i < 0))
                            break;
                        u = Math.ceil(u * i) / i,
                        l = Math.floor(l * i) / i
                    }
                    r = i
                }
                return t
            }
            ,
            t
        }
        function vo() {
            var t = La();
            return t.copy = function() {
                return Ra(t, vo())
            }
            ,
            ea.apply(t, arguments),
            go(t)
        }
        function yo(t) {
            return "string" === typeof t ? new Pn([[document.querySelector(t)]],[document.documentElement]) : new Pn([[t]],Fn)
        }
        function mo(t, n, e) {
            this.k = t,
            this.x = n,
            this.y = e
        }
        co({
            thousands: ",",
            grouping: [3],
            currency: ["$", ""]
        }),
        mo.prototype = {
            constructor: mo,
            scale: function(t) {
                return 1 === t ? this : new mo(this.k * t,this.x,this.y)
            },
            translate: function(t, n) {
                return 0 === t & 0 === n ? this : new mo(this.k,this.x + this.k * t,this.y + this.k * n)
            },
            apply: function(t) {
                return [t[0] * this.k + this.x, t[1] * this.k + this.y]
            },
            applyX: function(t) {
                return t * this.k + this.x
            },
            applyY: function(t) {
                return t * this.k + this.y
            },
            invert: function(t) {
                return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k]
            },
            invertX: function(t) {
                return (t - this.x) / this.k
            },
            invertY: function(t) {
                return (t - this.y) / this.k
            },
            rescaleX: function(t) {
                return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t))
            },
            rescaleY: function(t) {
                return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t))
            },
            toString: function() {
                return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")"
            }
        };
        var _o = new mo(1,0,0);
        function wo(t) {
            while (!t.__zoom)
                if (!(t = t.parentNode))
                    return _o;
            return t.__zoom
        }
        wo.prototype = mo.prototype;
        const bo = {
            class: "snr-title"
        }
          , xo = {
            class: "snr-title__count"
        };
        function ko(t, n, e, i, a, o) {
            return (0,
            r.wg)(),
            (0,
            r.iD)("div", bo, [(0,
            r._)("h5", null, (0,
            r.zw)(t.system), 1), (0,
            r._)("div", xo, (0,
            r.zw)(t.rover), 1)])
        }
        var Mo = (0,
        r.aZ)({
            name: "SNRChartTitle",
            props: {
                system: String,
                rover: Number,
                base: Number
            },
            setup() {
                const t = (0,
                h.QT)();
                return {
                    t: t
                }
            }
        })
          , No = e(83744);
        const So = (0,
        No.Z)(Mo, [["render", ko], ["__scopeId", "data-v-2590d124"]]);
        var Ao = So;
        const $o = {
            scaleBand: ca,
            scaleLinear: vo,
            axisLeft: D,
            axisBottom: z,
            select: yo
        }
          , Eo = (t, n) => {
            for (const e of t)
                if (e.satellite_index === n)
                    return e.signal_to_noise_ratio;
            return 0
        }
        ;
        var Co = (0,
        r.aZ)({
            name: "Chart",
            components: {
                ChartTitle: Ao
            },
            props: {
                observationData: {
                    required: !0,
                    type: Object
                }
            },
            setup(t) {
                const {observationData: n} = (0,
                r.BK)(t)
                  , e = {
                    top: 5,
                    right: 15,
                    bottom: 25,
                    left: 20
                }
                  , i = (0,
                r.iH)(null)
                  , a = (0,
                r.Fl)(( () => `${n.value.system} rover: ${n.value.count.rover}\n       base: ${n.value.count.base}`))
                  , o = (0,
                r.iH)(300)
                  , s = (0,
                r.iH)(100)
                  , u = (0,
                r.Fl)(( () => {
                    const {rover: t} = n.value
                      , e = t.map((t => ({
                        satellite_index: t.satellite_index,
                        signal_to_noise_ratio: t.signal_to_noise_ratio
                    })));
                    return e.sort(( (t, n) => parseInt(t.satellite_index.substr(1), 10) - parseInt(n.satellite_index.substr(1), 10)))
                }
                ))
                  , l = (0,
                r.Fl)(( () => {
                    const t = 12
                      , n = 20
                      , e = u.value
                      , r = []
                      , i = o.value / n > t ? t : parseInt((o.value / n).toString(10), 10);
                    for (let a = 0; a < i; a += 1) {
                        const t = `_${a}`
                          , n = void 0 !== e[a] ? e[a].satellite_index : t;
                        r.push(n)
                    }
                    return r
                }
                ))
                  , c = (0,
                r.Fl)(( () => {
                    const {base: t} = n.value;
                    return u.value.filter((t => l.value.includes(t.satellite_index))).map((n => {
                        const e = n.satellite_index
                          , r = n.signal_to_noise_ratio
                          , i = Eo(t, e);
                        return {
                            satelliteName: e,
                            values: [{
                                source: "rover",
                                snr: r,
                                index: e
                            }, {
                                source: "base",
                                snr: i,
                                index: e
                            }]
                        }
                    }
                    ))
                }
                ))
                  , h = (0,
                r.Fl)(( () => ({
                    width: o.value - (e.left + e.right),
                    height: s.value - (e.top + e.bottom)
                })))
                  , f = (0,
                r.Fl)(( () => {
                    const t = $o.scaleBand().paddingInner(.2)
                      , n = $o.scaleBand().paddingInner(.1)
                      , e = $o.scaleLinear()
                      , r = 54;
                    return t.domain(l.value).rangeRound([0, h.value.width]),
                    n.domain(["rover", "base"]).range([0, t.bandwidth()]),
                    e.domain([0, r]).range([h.value.height, 0]),
                    {
                        xScale: t,
                        xInScale: n,
                        yScale: e
                    }
                }
                ))
                  , p = (0,
                r.Fl)(( () => `${f.value.xInScale.bandwidth()}px`))
                  , d = t => {
                    const n = h.value.height - f.value.yScale(t);
                    return `${n}px`
                }
                  , g = (t, n=0) => {
                    let e = "";
                    return "base" === t ? e = "base" : (n < 30 && (e = "rover-low"),
                    n >= 30 && n < 45 && (e = "rover-medium"),
                    n >= 45 && (e = "rover-high")),
                    `snr-chart__bar--${e}`
                }
                  , v = (0,
                r.Fl)(( () => ({
                    x: `translate(${e.left}, ${h.value.height + e.top})`,
                    y: `translate(${e.left}, ${e.top})`
                })))
                  , y = () => {
                    const t = $o.select(`#axis_${n.value.system}`);
                    t.selectAll("*").remove();
                    const e = t.append("g").attr("class", "snr-chart__axis snr-chart__axis--x").attr("transform", v.value.x)
                      , r = $o.axisBottom(f.value.xScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(7).tickFormat((t => t.toString().startsWith("_") ? "" : t.toString().substr(1)));
                    e.call(r);
                    const i = t.append("g").attr("class", "snr-chart__axis snr-chart__axis--y").attr("transform", v.value.y)
                      , a = $o.axisLeft(f.value.yScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(7).ticks(2).tickValues([0, 45]);
                    i.call(a)
                }
                  , m = (t=0, n=0) => `translate(${t}, ${n})`
                  , w = {
                    rover: 0,
                    base: 0
                }
                  , b = (t, n) => {
                    const e = JSON.stringify(t.rover) === JSON.stringify(n.rover)
                      , r = JSON.stringify(t.base) === JSON.stringify(n.base);
                    e ? w.rover += 1 : w.rover = 0,
                    r ? w.base += 1 : w.base = 0
                }
                ;
                return (0,
                r.YP)(n, ( (t, n) => {
                    b(t, n),
                    y()
                }
                )),
                (0,
                _.yU7)(i, (t => {
                    o.value = t[0].contentRect.width,
                    y()
                }
                )),
                {
                    container: i,
                    margin: e,
                    title: a,
                    containerWidth: o,
                    containerHeight: s,
                    chartEntries: c,
                    chartSize: h,
                    scales: f,
                    barWidth: p,
                    getBarHeight: d,
                    getBarClass: g,
                    drawAxes: y,
                    getTransformTranslate: m,
                    countSameObs: b
                }
            }
        });
        const Fo = (0,
        No.Z)(Co, [["render", m]]);
        var Po = Fo
          , zo = e(49781);
        const Do = {
            [f.ay.gps]: "G",
            [f.ay.glonass]: "R",
            [f.ay.galileo]: "E",
            [f.ay.beidou]: "C",
            [f.ay.qzss]: "J",
            [f.ay.sbas]: "S"
        };
        var Oo = (0,
        r.aZ)({
            name: "SNRChart",
            components: {
                Chart: Po
            },
            setup() {
                const {t: t} = (0,
                h.QT)()
                  , n = (0,
                zo.Z)()
                  , e = (0,
                r.Fl)(( () => n.observations))
                  , i = {
                    [f.ay.gps]: t("common.gnss.gps"),
                    [f.ay.glonass]: t("common.gnss.glonass"),
                    [f.ay.galileo]: t("common.gnss.galileo"),
                    [f.ay.beidou]: t("common.gnss.beidou"),
                    [f.ay.qzss]: t("common.gnss.qzss"),
                    [f.ay.sbas]: t("common.gnss.sbas")
                }
                  , a = (t, n) => {
                    const {rover: e, base: r} = t
                      , a = Do[n]
                      , o = e.filter((t => t.satellite_index.indexOf(a) >= 0))
                      , s = r.filter((t => t.satellite_index.indexOf(a) >= 0));
                    return {
                        rover: o,
                        base: s,
                        system: i[n],
                        count: {
                            rover: o.length,
                            base: s.length
                        }
                    }
                }
                  , o = (0,
                r.Fl)(( () => a(e.value, f.ay.gps)))
                  , s = (0,
                r.Fl)(( () => a(e.value, f.ay.glonass)))
                  , u = (0,
                r.Fl)(( () => a(e.value, f.ay.galileo)))
                  , l = (0,
                r.Fl)(( () => a(e.value, f.ay.beidou)))
                  , c = (0,
                r.Fl)(( () => a(e.value, f.ay.qzss)))
                  , p = (0,
                r.Fl)(( () => a(e.value, f.ay.sbas)))
                  , d = [o, s, u, l, c, p];
                return {
                    t: t,
                    observations: e,
                    satellitesData: d
                }
            }
        });
        const Io = (0,
        No.Z)(Oo, [["render", c], ["__scopeId", "data-v-46c351ea"]]);
        var To = Io;
        const qo = {
            class: "sky-plot",
            ref: "container",
            id: "sky-plot-container"
        }
          , Ho = ["viewBox"]
          , Ro = ["transform"]
          , jo = ["cx", "cy"]
          , Lo = ["x", "y"];
        function Xo(t, n, e, i, a, o) {
            return (0,
            r.wg)(),
            (0,
            r.iD)("div", qo, [((0,
            r.wg)(),
            (0,
            r.iD)("svg", {
                viewBox: `0 0 ${t.containerSize} ${t.containerSize}`
            }, [(0,
            r._)("g", {
                class: "sky-plot__canvas",
                transform: t.transformTranslate
            }, [(0,
            r._)("g", {
                class: (0,
                r.C_)(["sky-plot__axis", t.lineStyle]),
                id: "sky-plot-axis"
            }, null, 2), ((0,
            r.wg)(!0),
            (0,
            r.iD)(r.HY, null, (0,
            r.Ko)(t.roverObservations, (n => ((0,
            r.wg)(),
            (0,
            r.iD)("g", {
                class: (0,
                r.C_)(`sky-plot__sat-${n.satellite_index}`),
                key: n.satellite_index
            }, [(0,
            r._)("circle", {
                class: (0,
                r.C_)([t.getCircleClass(n), "sky-plot__sat"]),
                cx: t.getXFromSat(n),
                cy: t.getYFromSat(n),
                r: "5"
            }, null, 10, jo), (0,
            r._)("text", {
                class: "sky-plot__text",
                x: t.getXFromSat(n) + 5,
                y: t.getYFromSat(n)
            }, (0,
            r.zw)(n.satellite_index), 9, Lo)], 2)))), 128))], 8, Ro)], 8, Ho))], 512)
        }
        var Bo = e(88401);
        const Yo = {
            scaleLinear: vo,
            select: yo,
            range: w,
            svg: na
        };
        var Vo = (0,
        r.aZ)({
            name: "SkyPlot",
            setup() {
                const t = (0,
                Bo.f)()
                  , n = (0,
                zo.Z)()
                  , e = (0,
                r.iH)(null)
                  , i = (0,
                r.iH)(0)
                  , a = 20
                  , o = 3
                  , s = 90
                  , u = 12
                  , l = 1.03
                  , c = 90
                  , h = 90
                  , f = (0,
                r.Fl)(( () => t.isThemeLight ? "sky-plot__line--light" : "sky-plot__line--dark"))
                  , p = (0,
                r.Fl)(( () => {
                    const t = i.value - 2 * a;
                    return {
                        width: t,
                        height: t
                    }
                }
                ))
                  , d = (0,
                r.Fl)(( () => p.value.width / 2))
                  , g = (0,
                r.Fl)(( () => d.value + a))
                  , v = (0,
                r.Fl)(( () => `translate(${g.value}, ${g.value})`))
                  , y = (0,
                r.Fl)(( () => n.observations.rover.filter((t => 0 !== t.elevation))))
                  , m = (0,
                r.Fl)(( () => Yo.scaleLinear().domain([0, s]).range([0, d.value])))
                  , w = Yo.scaleLinear().domain([0, 360]).range([0, 2 * Math.PI])
                  , b = t => {
                    const n = h - t.elevation
                      , e = c - t.azimuth;
                    return m.value(n) * Math.cos(w(e))
                }
                  , x = t => {
                    const n = h - t.elevation
                      , e = c - t.azimuth;
                    return -m.value(n) * Math.sin(w(e))
                }
                  , k = (0,
                r.Fl)(( () => d.value / o))
                  , M = s / o
                  , N = 2 * Math.PI / u
                  , S = () => {
                    const t = Yo.select(".sky-plot__axis");
                    t.selectAll("*").remove();
                    const n = t.append("g").attr("class", "axisWrapper");
                    n.selectAll(".elevations").data(Yo.range(0, o)).enter().append("circle").attr("r", (t => d.value - d.value * (t / o))),
                    n.selectAll(".axisLabel").data(Yo.range(0, o)).enter().append("text").attr("class", "sky-plot__text").attr("x", 3).attr("y", (t => -t * k.value - k.value + 10)).attr("dy", "0.4em").text((t => s - t * M - M + "°"));
                    const e = n.selectAll(".axis").data(Yo.range(0, u)).enter().append("g");
                    e.append("line").attr("x1", 0).attr("y1", 0).attr("x2", (t => m.value(s) * Math.cos(N * t - Math.PI / 2))).attr("y2", (t => m.value(s) * Math.sin(N * t - Math.PI / 2))),
                    e.append("text").attr("class", "sky-plot__text").attr("text-anchor", "middle").attr("dy", "0.4em").attr("x", (t => m.value(s * l) * Math.cos(N * t - Math.PI / 2))).attr("y", (t => m.value(s * l) * Math.sin(N * t - Math.PI / 2))).text((t => {
                        const n = t * (360 / u);
                        return 0 === n ? "N" : 90 === n ? "E" : 180 === n ? "S" : 270 === n ? "W" : `${n}°`
                    }
                    ))
                }
                  , A = t => {
                    let n = "";
                    return n = t.elevation < 0 ? "below-horizon" : t.signal_to_noise_ratio < 30 ? "low" : t.signal_to_noise_ratio >= 30 && t.signal_to_noise_ratio < 45 ? "medium" : "high",
                    `sky-plot__sat--${n}`
                }
                ;
                return (0,
                _.yU7)(e, (t => {
                    i.value = t[0].contentRect.width,
                    S()
                }
                )),
                {
                    container: e,
                    containerSize: i,
                    transformTranslate: v,
                    roverObservations: y,
                    getXFromSat: b,
                    getYFromSat: x,
                    getCircleClass: A,
                    lineStyle: f
                }
            }
        });
        const Zo = (0,
        No.Z)(Vo, [["render", Xo]]);
        var Wo = Zo
          , Uo = e(30320)
          , Ko = e(81775)
          , Jo = (0,
        r.aZ)({
            name: "Satellites",
            components: {
                SkyPlot: Wo,
                SNRChart: To,
                Panel: o.Z
            },
            setup() {
                const t = (0,
                Uo.p)()
                  , n = (0,
                r.Fl)(( () => !t.viewsPassed || t.views.includes(Ko.rY.SNRView)))
                  , e = (0,
                r.Fl)(( () => !t.viewsPassed || t.views.includes(Ko.rY.skyPlotView)));
                return {
                    showSNR: n,
                    showSkyPlot: e
                }
            }
        });
        const Go = (0,
        No.Z)(Jo, [["render", a], ["__scopeId", "data-v-6f00f4e2"]]);
        var Qo = Go
    }
}]);