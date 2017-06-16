/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
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
import * as $_____lib_lang from '../lib/lang'
import * as $____text_highlight_rules from './text_highlight_rules'

var oop = $_____lib_oop
var lang = $_____lib_lang
var TextHighlightRules = $____text_highlight_rules.TextHighlightRules

/* Exports are for Stylus and Less highlighters */
var supportType = (supportType =
  'align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration|animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|backface-visibility|background|background-attachment|background-blend-mode|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|border|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|bottom|box-shadow|box-sizing|caption-side|clear|clip|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|cursor|direction|display|empty-cells|filter|flex|flex-basis|flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|font|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|hanging-punctuation|height|justify-content|left|letter-spacing|line-height|list-style|list-style-image|list-style-position|list-style-type|margin|margin-bottom|margin-left|margin-right|margin-top|max-height|max-width|min-height|min-width|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|order|outline|outline-color|outline-offset|outline-style|outline-width|overflow|overflow-x|overflow-y|padding|padding-bottom|padding-left|padding-right|padding-top|page-break-after|page-break-before|page-break-inside|perspective|perspective-origin|position|quotes|resize|right|tab-size|table-layout|text-align|text-align-last|text-decoration|text-decoration-color|text-decoration-line|text-decoration-style|text-indent|text-justify|text-overflow|text-shadow|text-transform|top|transform|transform-origin|transform-style|transition|transition-delay|transition-duration|transition-property|transition-timing-function|unicode-bidi|vertical-align|visibility|white-space|width|word-break|word-spacing|word-wrap|z-index')
var supportFunction = (supportFunction = 'rgb|rgba|url|attr|counter|counters')
var supportConstant = (supportConstant =
  'absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero')
var supportConstantColor = (supportConstantColor =
  'aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow')
var supportConstantFonts = (supportConstantFonts =
  'arial|century|comic|courier|cursive|fantasy|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace')

var numRe = (numRe = '\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))')
var pseudoElements = (pseudoElements =
  '(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b')
var pseudoClasses = (pseudoClasses =
  '(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b')

export var CssHighlightRules = function() {
  var keywordMapper = this.createKeywordMapper(
    {
      'support.function': supportFunction,
      'support.constant': supportConstant,
      'support.type': supportType,
      'support.constant.color': supportConstantColor,
      'support.constant.fonts': supportConstantFonts,
    },
    'text',
    true
  )

  // regexp must not have capturing parentheses. Use (?:) instead.
  // regexps are ordered -> the first match is used

  this.$rules = {
    start: [
      {
        token: 'comment', // multi line comment
        regex: '\\/\\*',
        push: 'comment',
      },
      {
        token: 'paren.lparen',
        regex: '\\{',
        push: 'ruleset',
      },
      {
        token: 'string',
        regex: '@.*?{',
        push: 'media',
      },
      {
        token: 'keyword',
        regex: '#[a-z0-9-_]+',
      },
      {
        token: 'variable',
        regex: '\\.[a-z0-9-_]+',
      },
      {
        token: 'string',
        regex: ':[a-z0-9-_]+',
      },
      {
        token: 'constant',
        regex: '[a-z0-9-_]+',
      },
      {
        caseInsensitive: true,
      },
    ],

    media: [
      {
        token: 'comment', // multi line comment
        regex: '\\/\\*',
        push: 'comment',
      },
      {
        token: 'paren.lparen',
        regex: '\\{',
        push: 'ruleset',
      },
      {
        token: 'string',
        regex: '\\}',
        next: 'pop',
      },
      {
        token: 'keyword',
        regex: '#[a-z0-9-_]+',
      },
      {
        token: 'variable',
        regex: '\\.[a-z0-9-_]+',
      },
      {
        token: 'string',
        regex: ':[a-z0-9-_]+',
      },
      {
        token: 'constant',
        regex: '[a-z0-9-_]+',
      },
      {
        caseInsensitive: true,
      },
    ],

    comment: [
      {
        token: 'comment',
        regex: '\\*\\/',
        next: 'pop',
      },
      {
        defaultToken: 'comment',
      },
    ],

    ruleset: [
      {
        token: 'paren.rparen',
        regex: '\\}',
        next: 'pop',
      },
      {
        token: 'comment', // multi line comment
        regex: '\\/\\*',
        push: 'comment',
      },
      {
        token: 'string', // single line
        regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
      },
      {
        token: 'string', // single line
        regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
      },
      {
        token: ['constant.numeric', 'keyword'],
        regex:
          '(' +
            numRe +
            ')(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)',
      },
      {
        token: 'constant.numeric',
        regex: numRe,
      },
      {
        token: 'constant.numeric', // hex6 color
        regex: '#[a-f0-9]{6}',
      },
      {
        token: 'constant.numeric', // hex3 color
        regex: '#[a-f0-9]{3}',
      },
      {
        token: [
          'punctuation',
          'entity.other.attribute-name.pseudo-element.css',
        ],
        regex: pseudoElements,
      },
      {
        token: ['punctuation', 'entity.other.attribute-name.pseudo-class.css'],
        regex: pseudoClasses,
      },
      {
        token: ['support.function', 'string', 'support.function'],
        regex: '(url\\()(.*)(\\))',
      },
      {
        token: keywordMapper,
        regex: '\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*',
      },
      {
        caseInsensitive: true,
      },
    ],
  }

  this.normalizeRules()
}

oop.inherits(CssHighlightRules, TextHighlightRules)