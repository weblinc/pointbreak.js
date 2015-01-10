/* pointbreak.js - PointBreak provides a friendly interface to matchMedia with named media queries and easy to create callbacks. Authors & copyright (c) 2013: WebLinc, David Knight. */

(function(win) {
    'use strict';

    var EVENT_TYPE_MATCH    = 'match',
        EVENT_TYPE_UNMATCH  = 'unmatch';

    // Create a point object which contains the functionality to trigger events and name alias for the media query
    function createPoint() {
        return {
            name      : null,

            media     : '',

            mql       : null,

            listeners : {
                once        : {
                    match   : null,
                    unmatch : null
                },
                match       : [],
                unmatch     : []
            },

            trigger   : function(type) {
                var listenerType = this.listeners[type];

                for (var i = 0, len = listenerType.length; i < len; i++) {
                    var listener = listenerType[i];

                    if (typeof(listener.callback) === 'function') {
                        listener.callback.call(win, this, listener.data);
                    }
                }
            },

            handleListener: null,

            // Fires 'callback' that matches the 'type' immediately
            now   : function(type, callback, data) {
                var matches = this.mql && this.mql.matches;

                if ((type === EVENT_TYPE_MATCH && matches) || (type === EVENT_TYPE_UNMATCH && !matches)) {
                    callback.call(win, this, data || {});
                }

                return this;
            },

            // Fired the first time the conditions are matched or unmatched
            once  : function(type, callback, data) {
                var matches = this.mql && this.mql.matches;

                if ((type === EVENT_TYPE_MATCH && matches) || (type === EVENT_TYPE_UNMATCH && !matches)) {
                    this.once[type] = null;
                    callback.call(win, this, data || {});
                } else {
                    this.once[type] = {
                        callback    : callback,
                        data        : data
                    };
                }

                return this;
            },

            // Fired each time the conditions are matched or unmatched which could be multiple times during a session
            on    : function(type, callback, data) {
                this.listeners[type].push({
                    callback    : callback,
                    data        : data || {}
                });

                return this;
            },

            // Removes a specific callback or all callbacks if 'callback' is undefined for 'match' or 'unmatch'
            off   : function(type, callback) {
                if (callback) {
                    var listenerType = this.listeners[type];

                    for (var i = 0; i < listenerType.length; i++) {
                        if (listenerType[i].callback === callback) {
                            listenerType.splice(i, 1);
                            i--;
                        }
                    }
                } else {
                    this.listeners[type]  = [];
                    this.once[type]       = null;
                }

                return this;
            }
        };
    }

    // Interface for points that provides easy get/set methods and storage in the 'points' object
    win.PointBreak = {
        // Contains alias for media queries
        points: {},

        // PointBreak.set('xsmall', '(min-width: 320px) and (max-width: 480px)')
        set: function (name, value) {
            var point = this.points[name];

            // Reset 'listeners' and removeListener from 'mql' (MediaQueryList)
            // else create point object and add 'name' property
            if (point) {
                point.mql.removeListener(point.handleListener);
                point
                    .off(EVENT_TYPE_MATCH)
                    .off(EVENT_TYPE_UNMATCH);
            } else {
                point       = this.points[name] = createPoint();
                point.name  = name;
            }

            // Set up listener function for 'mql'
            point.handleListener = function(mql) {
                var type  = (mql.matches && EVENT_TYPE_MATCH) || EVENT_TYPE_UNMATCH,
                    once  = point.once[type];

                // 'point' comes from the 'set' scope
                if (typeof(once) === 'function') {
                    point.once[type] = null;
                    once.call(win, point);
                }

                point.trigger(type);
            };

            // Set up matchMedia and listener, requires matchMedia support or equivalent polyfill to evaluate media query
            // See https://github.com/weblinc/media-match or https://github.com/paulirish/matchMedia.js for matchMedia polyfill
            point.media = value || 'all';
            point.mql   = (win.matchMedia && win.matchMedia(point.media)) || {
                matches         : false,
                media           : point.media,
                addListener     : function() {},
                removeListener  : function() {}
            };
            point.mql.addListener(point.handleListener);

            return point;
        },

        // PointBreak.get('xsmall')
        get: function(name) {
            return this.points[name] || null;
        },

        // PointBreak.matches('xsmall')
        matches: function(name) {
            return (this.points[name] && this.points[name].mql.matches) || false;
        },

        // PointBreak.lastMatch('xsmall small medium')
        lastMatch: function(nameList) {
            var list    = nameList.indexOf(' ') ? nameList.split(' ') : [nameList],
                name    = '',
                result = '';

            for (var i = 0, len = list.length; i < len; i++) {
                name = list[i];
                if (this.points[name] && this.points[name].mql.matches) {
                    result = name;
                }
            }

            return result;
        }
    };
})(window);