(function ($) {
  'use strict';

  // VALIDATE CLASS DEFINITION
  // ==========================

  function Validate(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, options);
    this.children = setChildren.call(this);
    this.options.rules = this.options.rules ? this.options.rules : setRules.call(this);
    attachRulesToChildren.call(this);
    setListeners.call(this);
  }

  Validate.VERSION  = '0.0.1';

  Validate.PATTERNS = {
    alpha: /^[a-zA-Z]+$/,
    alpha_numeric : /^[a-zA-Z0-9]+$/,
    integer: /^[-+]?\d+$/,
    number: /^[-+]?\d*(?:[\.\,]\d+)?$/,

    // amex, visa, diners
    card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
    cvv : /^([0-9]){3,4}$/,

    // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
    email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

    url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
    // abc.de
    domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,

    datetime: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
    // YYYY-MM-DD
    date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
    // HH:MM:SS
    time : /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
    dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
    // MM/DD/YYYY
    month_day_year : /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
    // DD/MM/YYYY
    day_month_year : /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,

    // #FFF or #FFFFFF
    color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
  };

  Validate.prototype.validateElement = function(el) {
    var $el = $(el);
    
    if ($el.attr('required')) {
      if ($el.val()) {}
    }

    if ($el.data('pattern')) {

    }
  };

  function setChildren() {
    return this.$element.find('[data-pattern], [required]');
  }

  function setRules() {
    var rules = {},
        $child;
    for (var i = this.children.length - 1; i >= 0; i -= 1) {
      $child = $(this.children[i]);
      rules['#' + $child.attr('id')] = {
        required: $child.attr('required'),
        pattern: $child.data('pattern')
      };
    }
    return rules;
  }

  function attachRulesToChildren() {
    var rules = this.options.rules; 
    for (var child in rules) {
      if (rules.hasOwnProperty(child)) {
        $(child).attr('required', rules[child].required);
        $(child).data('pattern', rules[child].pattern);
      }
    }
  }

  function setListeners() {
    var _this = this;
    this.children.on('blur.bs.validate', function() {
      _this.validateElement(this);
    });
  }


  // VALIDATE PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('bs.validate'),
          options = typeof option === 'object' && option;

      if (!data) {
        $this.data('bs.validate', (data = new Validate(this, options)));
      }
      if (typeof option === 'string') {
        data[option]();
      }
    });
  }

  var old = $.fn.validate;

  $.fn.validate = Plugin;
  $.fn.validate.Constructor = Validate;


  // VALIDATE NO CONFLICT
  // =====================

  $.fn.validate.noConflict = function () {
    $.fn.validate = old;
    return this;
  };


  // VALIDATE DATA-API
  // ==================

  $(window).on('load.bs.validate.data-api', function () {
    $('form[data-spy="validate"]').each(function () {
      var $this = $(this);
      Plugin.call($this, $this.data());
    });
  });

}(jQuery));