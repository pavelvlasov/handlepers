(function (root, factory) {
    if (typeof exports === 'object') {
        var Handlebars;
        try {
            Handlebars = require('handlebars');
        } catch (err) {
            Handlebars = require('express-hbs');
        }
        module.exports = factory(Handlebars);
    } else if (typeof define === 'function' && define.amd) {
        define(['handlebars'], factory);
    } else {
        root.HandlebarsHelpersRegistry = factory(root.Handlebars);
    }
}(this, function (Handlebars) {

    var isArray = function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    var ExpressionRegistry = function() {
        this.expressions = [];
    };

    ExpressionRegistry.prototype.add = function (operator, method) {
        this.expressions[operator] = method;
    };

    ExpressionRegistry.prototype.call = function (operator, left, right) {
        if ( ! this.expressions.hasOwnProperty(operator)) {
            throw new Error('Unknown operator "'+operator+'"');
        }

        return this.expressions[operator](left, right);
    };

    var eR = new ExpressionRegistry;
    eR.add('not', function(left, right) {
        return left != right;
    });
    eR.add('>', function(left, right) {
        return left > right;
    });
    eR.add('<', function(left, right) {
        return left < right;
    });
    eR.add('>=', function(left, right) {
        return left >= right;
    });
    eR.add('<=', function(left, right) {
        return left <= right;
    });
    eR.add('===', function(left, right) {
        return left === right;
    });
    eR.add('!==', function(left, right) {
        return left !== right;
    });
    eR.add('in', function(left, right) {
        if ( ! isArray(right)) {
            right = right.split(',');
        }
        return right.indexOf(left) !== -1;
    });

    var isHelper = function() {
        var args = arguments
        ,   left = args[0]
        ,   operator = args[1]
        ,   right = args[2]
        ,   options = args[3]
        ;

        if (args.length == 2) {
            options = args[1];
            if (left) return options.fn(this);
            return options.inverse(this);
        }

        if (args.length == 3) {
            right = args[1];
            options = args[2];
            if (left == right) return options.fn(this);
            return options.inverse(this);
        }

        if (eR.call(operator, left, right)) {
            return options.fn(this);
        }
        return options.inverse(this);
    };

    Handlebars.registerHelper('is', isHelper);

    Handlebars.registerHelper('with', function(context, options) {
        if (!options) {
            options = context;
            context = null;

            return options.fn(options.hash);
        } else {
            var newContext = {};
            for (var prop in context) {
                newContext[prop] = context[prop];
            }
            if (options.hash) {
                for(var prop in options.hash) {
                    newContext[prop] = options.hash[prop];
                }
            }

            return options.fn(newContext);
        }
    });

    Handlebars.registerHelper('switch', function(val, options) {
        var hash = options.hash;
        return options.hash[val] || options.hash['default'];
    });

    Handlebars.registerHelper('nl2br', function(text) {
        var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new Handlebars.SafeString(nl2br);
    });

    Handlebars.registerHelper('log', function() {
        console.log(['Values:'].concat(
            Array.prototype.slice.call(arguments, 0, -1)
        ));
    });

    Handlebars.registerHelper('debug', function() {
        console.log('Context:', this);
        console.log(['Values:'].concat(
            Array.prototype.slice.call(arguments, 0, -1)
        ));
    });

    return eR;

}));