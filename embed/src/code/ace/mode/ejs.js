/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

import * as $_____lib_oop from '../lib/oop'
import * as $____html_highlight_rules from './html_highlight_rules'
import * as $____javascript_highlight_rules from './javascript_highlight_rules'
import * as $____html from './html'
import * as $____javascript from './javascript'
import * as $____css from './css'
import * as $____ruby from './ruby'

var oop = $_____lib_oop
var HtmlHighlightRules = $____html_highlight_rules.HtmlHighlightRules
var JavaScriptHighlightRules =
  $____javascript_highlight_rules.JavaScriptHighlightRules

export var EjsHighlightRules = function(start, end) {
  HtmlHighlightRules.call(this)

  if (!start) start = '(?:<%|<\\?|{{)'
  if (!end) end = '(?:%>|\\?>|}})'

  for (var i in this.$rules) {
    this.$rules[i].unshift({
      token: 'markup.list.meta.tag',
      regex: start + '(?![>}])[-=]?',
      push: 'ejs-start',
    })
  }

  this.embedRules(
    new JavaScriptHighlightRules({ jsx: false }).getRules(),
    'ejs-',
    [
      {
        token: 'markup.list.meta.tag',
        regex: '-?' + end,
        next: 'pop',
      },
      {
        token: 'comment',
        regex: '//.*?' + end,
        next: 'pop',
      },
    ]
  )

  this.normalizeRules()
}

oop.inherits(EjsHighlightRules, HtmlHighlightRules)

var oop = $_____lib_oop
var HtmlMode = $____html.Mode
var JavaScriptMode = $____javascript.Mode
var CssMode = $____css.Mode
var RubyMode = $____ruby.Mode

export var Mode = function() {
  HtmlMode.call(this)
  this.HighlightRules = EjsHighlightRules
  this.createModeDelegates({
    'js-': JavaScriptMode,
    'css-': CssMode,
    'ejs-': JavaScriptMode,
  })
}
oop.inherits(Mode, HtmlMode)
;(function() {
  this.$id = 'ace/mode/ejs'
}.call(Mode.prototype))