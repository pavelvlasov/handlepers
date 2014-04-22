Handlepers [![Build Status](https://travis-ci.org/freakycue/handlepers.svg?branch=master)](https://travis-ci.org/freakycue/handlepers)
===================

A small collection of usefull helpers collection for [express-hbs](https://github.com/barc/express-hbs)
and [Handlebars.js](https://github.com/wycats/handlebars.js).

Forked from [danharper/Handlebars-Helpers](https://github.com/danharper/Handlebars-Helpers)

To use, just include `helpers.js` after you include Handlebars. Or, if you're using AMD/Node, just require the file.

## Provided Helpers

### Comparisons

Given one argument, `is` acts exactly like `if`:

```
{{#is x}} ... {{else}} ... {{/is}}
```

Given two arguments, `is` compares the two are equal (a non-strict, `==` comparison, so `5 == '5'` is true)

```
{{#is x y}} ... {{else}} ... {{/is}}
```

Given three arguments, the second argument becomes the comparator.

```
{{#is x "not" y}} ... {{else}} ... {{/is}}
{{#is 5 ">=" 2}} ... {{else}} ... {{/is}}
```

Several comparators are built-in:

* `==` (same as not providing a comparator)
* `!=`
* `not` (alias for `!=`)
* `===`
* `!==`
* `>`
* `>=`
* `<`
* `<=`
* `in` (check a value exists in either a comma-separated string, or an array, see below)

```
// Loose equality checking
{{#is x y}} ... {{else}} ... {{/is}}
{{#is x "==" y}} ... {{else}} ... {{/is}}

{{#is x "!=" y}} ... {{else}} ... {{/is}}
{{#is x "not" y}} ... {{else}} ... {{/is}}

// Strict equality checking
{{#is x "===" y}} ... {{else}} ... {{/is}}
{{#is x "!==" y}} ... {{else}} ... {{/is}}

// Greater/Less Than
{{#is x ">" y}} ... {{else}} ... {{/is}}
{{#is x ">=" y}} ... {{else}} ... {{/is}}

{{#is x "<" y}} ... {{else}} ... {{/is}}
{{#is x "<=" y}} ... {{else}} ... {{/is}}

// In comma separated list, or array
{{#is x "in" "foo,bar"}} ... {{else}} ... {{/is}}
{{#is x "in" anArray}} ... {{else}} ... {{/is}}
```

#### Registering Custom `is` comparators
You can extend the provided comparators by registering your own, like so:

```js
// in browser
HandlebarsHelpersRegistry.add('same', function (left, right) { return left === right; });

// with AMD/Node
var HandlebarsHelpersRegistry = require('path/to/helpers');
HandlebarsHelpersRegistry.add('same', function (left, right) { return left === right; });

// usage
var template = '{{#is x "same" y}} Are the same {{else}} Not the same {{/is}}';
Handlebars.compile(template)({ x: 5, y: '5' }); // => " Not the same "
```

### With
You can change context of the block
```
{{#with newContext}} ... {{/with}}
// or
{{#with newContextVar=oldContextVar}} ... {{/with}}
// or both
{{#with newContext var1=oldVar1 var2=oldVar2}} ... {{/with}}
```

### Switch
Returns value, that matches one of hash key or default value
```
{{switch conditionVar X='val1' Y=var1 default='default value'}}
```

### Logging

Log one or multiple values to the console:

```
{{log foo bar}}
```

Log one or multiple values to the console, _with the current context_:

```
{{debug foo bar}}
```

### nl2br

Convert new lines (`\r\n`, `\n\r`, `\r`, `\n`) to line breaks

```
{{nl2br description}}
```
=====================
