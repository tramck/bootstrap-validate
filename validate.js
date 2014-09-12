(function ($) {
  'use strict';

  // VALIDATE CLASS DEFINITION
  // ==========================

  function Validate(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Validate.DEFAULTS, options);
    this.children = setChildren.call(this);
    this.options.rules = this.options.rules ? this.options.rules : setRules.call(this);
    this.errors = {};
    attachRulesToChildren.call(this);
    setListeners.call(this);
  }

  Validate.VERSION  = '0.0.1';

  Validate.DEFAULTS = {
    requiredMessage: 'This field is required.',
    patterns: {
      alpha: {
        regex: /^[a-zA-Z]+$/,
        message: 'Please use only letter characters.'
      },
      alpha_numeric: {
        regex: /^[a-zA-Z0-9]+$/,
        message: 'Please use only letter and number characters.'
      },
      integer: {
        regex: /^[-+]?\d+$/,
        message: 'Please enter a valid integer.'
      },
      number: {
        regex: /^[-+]?\d*(?:[\.\,]\d+)?$/,
        message: 'Please enter a valid number.'
      },
      card: {
        regex: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        message: 'Please enter a valid credit card number.'
      },
      cvv: {
        regex: /^([0-9]){3,4}$/,
        message: 'Please enter a valid CVV.'
      },
      email: {
        regex: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
        message: 'Please enter a valid email.'
      },
      url: {
        regex: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
        message: 'Please enter a valid url.'
      },
      domain: {
        regex: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
        message: 'Please enter a valid domain.'
      },
      datetime: {
        regex: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
        message: 'Please enter a valid Datetime'
      },
      date: {
        regex: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
        message: 'Please enter a valid date using YYYY-MM-DD.'
      },
      time: {
        regex: /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
        message: 'Please enter a valid time using HH:MM:SS'
      },
      date_iso: {
        regex: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        message: 'Please enter a valid date.'
      },
      month_day_year: {
        regex: /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
        message: 'Please enter a valid date using MM/DD/YYYY.'
      },
      day_month_year: {
        regex: /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,
        message: 'Please enter a valid date using DD/MM/YYYY.'
      },
      color_hex: {
        regex: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
        message: 'Please enter a valid hex color code (#fff or #ffffff)'
      }
    }
  };

  Validate.prototype.validateElement = function(el) {
    var $el = $(el),
        id = '#' + $el.attr('id');

    this.errors[id] = false;
    
    if ($el.attr('required')) {
      if (!$el.val()) {
        this.errors[id] = this.options.requiredMessage;
        return this.errors;
      }
    }

    var regex = setRegExp.call(this, $el.data('pattern'));

    if (regex) {
      if (!regex.test($el.val())) {
        var message = $el.data('message') ? $el.data('message') : this.options.patterns[$el.data('pattern')].message;
        this.errors[id] = message;
        return this.errors;
      }
    }

    return false;
  };

  Validate.prototype.displayStatus = function() {
    var $el;
    for (var error in this.errors) {
      if (this.errors.hasOwnProperty(error)) {
        $el = $(error);
        if (this.errors[error]) {
          $el
            .parents('.form-group')
              .addClass('has-feedback')
              .addClass('has-error')
              .end()
            .siblings('.help-block')
              .remove()
              .end()
            .siblings('.glyphicon')
              .remove()
              .end()
            .after('<span class="glyphicon glyphicon-remove form-control-feedback"></span> <span class="help-block">' + this.errors[error] + '</span>');
        } else {
          $el
            .parents('.form-group')
              .removeClass('has-error')
              .end()
            .siblings('.help-block')
              .remove()
              .end()
            .siblings('.glyphicon')
              .remove()
              .end()
            .after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
        }
      }
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
        pattern: {
          regex: $child.data('pattern')
        }
      };
      if ($child.data('message')) {
        rules['#' + $child.attr('id')].pattern.message = $child.data('message');
      }
    }
    return rules;
  }

  function attachRulesToChildren() {
    var rules = this.options.rules; 
    for (var child in rules) {
      if (rules.hasOwnProperty(child)) {
        $(child).attr('required', rules[child].required);
        if (typeof rules[child].pattern === 'object') {
          $(child).data('pattern', rules[child].pattern.regex);
          $(child).data('message', rules[child].pattern.message);
        } else {
          $(child).data('pattern', rules[child].pattern);
        }
      }
    }
  }

  function setListeners() {
    var _this = this;
    this.children.on('blur.bs.validate', function() {
      $(this).on('keypress.bs.validate', function() {
        _this.validateElement(this);
        _this.displayStatus();
      });
      _this.validateElement(this);
      _this.displayStatus();
    });
    this.$element.on('submit.bs.validate', function(e) {
      e.preventDefault();
      _this.children.each( function() {
        _this.validateElement(this);
      });
      _this.displayStatus();
      if (!hasErrors.call(_this)) {
        _this.$element[0].submit();
      }
    });
  }

  function setRegExp(pattern) {
    var patterns = this.options.patterns;
    if (pattern instanceof RegExp) {
      return pattern;
    } else if (patterns.hasOwnProperty(pattern)) {
      return patterns[pattern].regex;
    } else {
      throw new Error(pattern + ' is neither a RegExp nor found in the available patterns.');
    }
  }

  function hasErrors() {
    for (var error in this.errors) {
      if (this.errors.hasOwnProperty(error)) {
        if (this.errors[error]) {
          return true;
        }
      }
    }
    return false;
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