function RREvents(g, v, r, u) {
    var e,
        f,
        t,
        w = this,
        b =
            ((this.isMobile = !1),
                (e = navigator.userAgent || navigator.vendor || window.opera),
                (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                    e
                ) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                        e.substr(0, 4)
                    )) &&
                (w.isMobile = !0),
                g && o(g),
                this.eventType,
                this.year,
                this.month,
                this.day,
                this.country,
                this.filter,
                (this.searchMode = 0),
                (this.activeevents = 0),
                (this.group = 0),
                (this.user = 0),
                this.eventlink,
                (this.openInNewWindow = !1),
                (this.server = ""),
                (this.geoLocation = "IP"),
                (this.loading = function () {
                    return y;
                }),
                ""),
        y = !1,
        k = [],
        x = function () {
            var e = this;
            e.getPosition();
            t.setContent(e.content), t.open(f, e);
        };
    function i() {
        var e;
        v &&
            ((t = new google.maps.InfoWindow()),
                (e = { zoom: 4, center: new google.maps.LatLng(40, 0) }),
                (f = new google.maps.Map(v, e)),
                google.maps.event.addListener(f, "click", function () {
                    t.close();
                }));
    }
    function L() {
        for (var e = g.childNodes.length - 1; 0 <= e; e--)
            0 === g.childNodes[e].childNodes.length && g.removeChild(g.childNodes[e]);
        for (; 1 < g.childNodes.length;) g.removeChild(g.lastChild);
    }
    function N(e) {
        var e = e.split("-"),
            t = u.dateFormat;
        return (t = (t = (t = (t = (t = (t = t.replace(/yyyy/gi, "Y")).replace(
            /mm/gi,
            "m"
        )).replace(/dd/gi, "d")).replace(/Y/gi, e[0])).replace(
            /m/gi,
            e[1]
        )).replace(/d/gi, e[2]));
    }
    window.addEventListener
        ? window.addEventListener("load", i, !1)
        : window.attachEvent && window.attachEvent("onload", i);
    var n = !(this.loadEvents = function (m) {
        if (y) return !1;
        (y = !0),
            window.setTimeout(function () {
                var e;
                y &&
                    (L(),
                        ((e = g.ac(E())).className = "Loading"),
                        (e.style.backgroundImage = "url('/RREvents/loading.gif')"));
            }, 350);
        var e = {
            type: this.eventType,
            year: 0 < this.year ? this.year : void 0,
            month: 0 < this.month ? this.month : void 0,
            day: 0 < this.day ? this.day : void 0,
            country: this.country,
            filter: this.filter,
            searchMode: this.searchMode,
            recentevents: this.recentevents,
            activeevents: this.activeevents,
            group: this.group,
            user: this.user,
            geoLocation: this.geoLocation,
            lang: r,
        },
            t = ((b = this.server), this.server + "/RREvents/list"),
            i = e,
            e = void 0,
            n = function (e) {
                if (((y = !1), (e = e || []), !m || m(e.length))) {
                    if (g) {
                        var t = e;
                        if ((L(), 0 === t.length)) {
                            var i = E();
                            g.ac(i), (i.className = "Loading"), i.at(u.labelNoMatch);
                        } else
                            for (var n = 0; n < t.length; n++) {
                                var o = t[n];
                                ((i = g.ac(E())).EventID = o[0]),
                                    w.eventlink
                                        ? (i.url = w.eventlink.replace(/\[eventid\]/gi, i.EventID))
                                        : 0 <= window.location.href.indexOf("my.raceresult.com")
                                            ? (i.url = "/" + i.EventID + "/")
                                            : (i.url = "https://my.raceresult.com/" + i.EventID + "/"),
                                    (i.onclick = function () {
                                        w.openInNewWindow
                                            ? window.open(this.url)
                                            : (window.location.href = this.url);
                                    });
                                var a = (s = i.ac(M())).cc("img"),
                                    s =
                                        ((a.src = b + "/RREvents/eventtypes/" + o[1] + ".png"),
                                            (a.title = o[10]),
                                            i.ac(M())),
                                    s =
                                        (o[6] &&
                                            (((a = s.cc("img")).src =
                                                b + "/graphics/flags/" + o[6] + ".gif"),
                                                (a.title = o[9])),
                                            i.ac(M())),
                                    a = o[5];
                                o[11] && a.indexOf(",") < 0 && (a += ", " + o[11]), s.at(a);
                                (a = (s = i.ac(M())).cc("a")),
                                    (s =
                                        ((a.href = i.url),
                                            w.openInNewWindow && (a.target = "_blank"),
                                            a.at(o[2]),
                                            i.ac(M())));
                                o[3] == o[4]
                                    ? s.at(N(o[3]))
                                    : ((i.className = "hasDateSpan"),
                                        s.at(N(o[3])),
                                        s.cc("br"),
                                        s.at("-" + N(o[4])));
                            }
                    }
                    if (v) {
                        for (var r = e, c = 0; c < k.length; c++) k[c].setMap(null);
                        k = [];
                        for (
                            var l = new google.maps.LatLngBounds(), c = 0;
                            c < r.length;
                            c++
                        ) {
                            var d,
                                h,
                                p = r[c];
                            (-1 == p[7] && -1 == p[8]) ||
                                (0 == p[7] && 0 == p[8]) ||
                                ((d = new google.maps.LatLng(p[7], p[8])),
                                    ((h = new google.maps.Marker({ position: d, map: f })).content =
                                        "<b>" +
                                        p[2] +
                                        "</b><br>" +
                                        p[5] +
                                        ", " +
                                        N(p[3]) +
                                        (p[4] > p[3] ? "-" + N(p[4]) : "") +
                                        '<br><br><a href="/' +
                                        p[0] +
                                        '/">' +
                                        u.labelDetails +
                                        "</a>"),
                                    k.push(h),
                                    google.maps.event.addListener(h, "click", x),
                                    l.extend(d));
                        }
                        0 < r.length && f.fitBounds(l);
                    }
                }
            },
            o = void 0;
        if (void 0 !== i)
            for (var a in i)
                void 0 !== i[a] &&
                    (t +=
                        (0 <= t.indexOf("?") ? "&" : "?") +
                        a +
                        "=" +
                        encodeURIComponent(i[a]));
        var s = (function () {
            if (window.XMLHttpRequest) http_request = new XMLHttpRequest();
            else if (window.ActiveXObject)
                try {
                    http_request = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        http_request = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) { }
                }
            return http_request;
        })();
        try {
            s.timeout = 2e4;
        } catch (e) { }
        o && (s.ontimeout = o),
            o && (s.onerror = o),
            (s.onload = function (e) {
                if (4 === s.readyState)
                    if (200 === s.status) {
                        var t = s.responseText,
                            i = s.getResponseHeader("content-type");
                        if (i && "application/json" === i.toLowerCase().substr(0, 16))
                            try {
                                t = JSON.parse(t);
                            } catch (e) { }
                        n && n(t);
                    } else o && o();
            }),
            void 0 === e
                ? (s.open("GET", t, !0), s.send(null))
                : (s.open("POST", t, !0), s.send(e));
    });
    function E() {
        return c(n ? "tr" : "div");
    }
    function M() {
        return c(n ? "td" : "div");
    }
    function c(e, t, i) {
        e = document.createElement(e);
        return t && (e.id = t), i && (e.name = i), e && o(e), e;
    }
    function o(e) {
        (e.ac = function (e, t) {
            if (null != e)
                if (e.constructor === Array)
                    for (var i in e)
                        t ? this.appendChild(c(t)).ac(e[i]) : this.appendChild(e[i]);
                else {
                    if ("object" == typeof e) return this.appendChild(e), e;
                    this.appendChild(document.createTextNode(e));
                }
        }),
            (e.at = function (e) {
                this.ac(e);
            }),
            (e.css = function (e, t) {
                this.style[e] = t;
            }),
            (e.cc = function (e, t, i) {
                return this.ac(c(e, t, i));
            });
        try {
            e.clear = function (e) {
                for (; this.firstChild;) this.removeChild(this.firstChild);
                return void 0 !== e && this.ac(e), this;
            };
        } catch (e) { }
        e.at2 = function (e, t) {
            if ("[img:" === e.substr(0, 5) && "]" === e.substr(e.length - 1)) {
                var i = c("img"),
                    n = e.substr(5, e.length - 6).split("|");
                if (n[1])
                    for (var o = n[1].split(";"), a = 0; a < o.length; a++) {
                        var s = o[a].split(":");
                        2 <= s.length && (i.style[s[0].trim()] = s[1].trim());
                    }
                else
                    (i.style.maxHeight = "16px"),
                        (i.style.verticalAlign = "top"),
                        (i.className = "img16");
                "http" === n[0].substr(0, 4)
                    ? (i.src = n[0])
                    : 0 <= n[0].indexOf("flags/")
                        ? (i.src = rrp_server + "/graphics/" + n[0])
                        : (i.src =
                            rrp_server +
                            "/RRPublish/picture.php?eventid=" +
                            eventid +
                            "&name=" +
                            encodeURIComponent(n[0]));
            } else {
                var r = e.split("\n");
                if (1 === r.length) i = document.createTextNode(r[0]);
                else {
                    i = c("span");
                    for (a = 0; a < r.length; a++)
                        i.ac(document.createTextNode(r[a])), a < e.length - 1 && i.cc("br");
                }
            }
            if (t) return (n = c("b")).ac(i), this.ac(n), n;
            this.ac(i);
        };
    }
    g && "[object HTMLTableSectionElement]" == g.toString() && (n = !0);
}
