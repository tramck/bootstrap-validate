function setupFixtures() {
  $('body').append(
    '<form role="form">' +
      '<div class="form-group">' +
        '<label for="exampleEmail">Email address</label>' +
        '<input type="email" class="form-control" id="exampleEmail" placeholder="Enter email" required data-pattern="email">' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="exampleAlpha">Email address</label>' +
        '<input type="email" class="form-control" id="exampleAlpha" placeholder="Enter email" required data-pattern="alpha">' +
      '</div>' +
    '</form>'
  );
}

describe("Plugin", function() {

  beforeEach(function() {
    setupFixtures();
  });

  afterEach(function() {
    $('form').remove();
  });

  it("should be defined on jquery object", function() {
    expect($(document.body).validate).toBeDefined();
  });

  it("should return a jquery object", function() {
    var $form = $('form');
    expect($form instanceof $).toBeTruthy();
  });

  it("should return jquery collection containing the element", function() {
    var $form = $('form');
    var $el = $form.validate();
    expect($form[0]).toEqual($el[0]);
  });

  it("should store validate instance in validate data object", function() {
    var $form = $('form');
    $form.validate();
    expect($form.data('bs.validate')).toBeTruthy();
  });

  describe("set children", function() {
    
    it("should set children", function() {
      var $form = $('form');
      $form.validate();
      expect($form.data('bs.validate').children.toArray()).toEqual($('input[type="email"]').toArray());
    });

  });

  describe("set rules", function() {

    it("should set rules via plugin", function() {
      var $form = $('form'),
          rules = {
            '#exampleEmail': {
              required: true,
              pattern: 'alpha_numeric'
            }
          };
      $form.validate({ rules: rules });
      expect($form.data('bs.validate').options.rules).toEqual(rules);
    });

    it("should set rules via data api", function() {
      var $form = $('form'),
          rules = { 
            '#exampleAlpha': { 
              required: 'required', 
              pattern: {
                regex: 'alpha' 
              }
            }, 
            '#exampleEmail': { 
              required: 'required', 
              pattern: {
                regex: 'email' 
              }
            } 
          };
      $form.validate();
      expect($form.data('bs.validate').options.rules).toEqual(rules);
    });

    it("should attach required attribute via plugin to elements", function() {
      var $form = $('form'),
          rules = {
            '#exampleEmail': {
              required: true,
              pattern: 'alpha_numeric'
            }
          };
      $('#exampleEmail').removeAttr('required');
      $form.validate({ rules: rules });
      expect($('#exampleEmail').attr('required')).toBeTruthy();
    });

    it("should attach data attributes via plugin to elements", function() {
      var $form = $('form'),
          rules = {
            '#exampleEmail': {
              required: true,
              pattern: 'alpha_numeric'
            }
          };
      $form.validate({ rules: rules });
      expect($('#exampleEmail').data('pattern')).toBe('alpha_numeric');
    });

  });

  describe("validation", function() {

    it("should throw if pattern doesn't exist", function() {
      var $input = $('#exampleEmail');
      $input.data('pattern', 'randomstringadsfadfa');
      $('form').validate();
      $input.trigger('focus');
      $input.val('notanemail');
      expect(function() { $('form').data('bs.validate').validateElement($input) }).toThrow();
    });
    
    it("should not validate on keypress until blur", function() {
      $('form').validate();
      var $input = $('#exampleEmail');
      $input.trigger('focus');
      $input.val('notanemail');
      $input.trigger('keypress');
      expect($('form').data('bs.validate').errors['#exampleEmail']).toBeFalsy();
    });

    it("should validate on blur", function() {
      var $form = $('form');
      $form.validate();
      var $input = $('#exampleEmail');
      $input.trigger('focus');
      $input.val('notanemail');
      $input.trigger('blur');
      expect($form.data('bs.validate').errors['#exampleEmail']).toBe('Please enter a valid email.');
    });

    it("should validate on keypress after has been blurred", function() {
      var $form = $('form');
      $form.validate();
      var $input = $('#exampleEmail');
      $input.trigger('focus');
      $input.val('notanemail');
      $input.trigger('blur');
      $input.val('an@email.com');
      $input.trigger('keypress');
      expect($form.data('bs.validate').errors['#exampleEmail']).toBeFalsy();
    });

    it("should validate everything on submit", function() {
      var $form = $('form');
      $form.validate();
      $form.trigger('submit');
      var errors = {
        '#exampleAlpha': 'This field is required.',
        '#exampleEmail': 'This field is required.'
      };
      expect($form.data('bs.validate').errors['#exampleEmail']).toEqual(errors);
    });

    it("should not allow submit if invalid", function() {
      
    });

  });

  describe("display status", function() {
    
    it("should display success", function() {
      var $form = $('form');
      $form.validate();
      var $input = $('#exampleEmail');
      $input.trigger('focus');
      $input.val('notanemail');
      $input.trigger('blur');
      // expect().toBe('Please enter a valid email.');
    });

    it("should display error", function() {
      // var $form = $('form');
      // $form.validate();
      // var $input = $('#exampleEmail');
      // $input.trigger('focus');
      // $input.val('notanemail');
      // $input.trigger('blur');
      // expect($form.data('bs.validate').errors['#exampleEmail']).toBe('Please enter a valid email.');
    });


  });

  describe("validation types", function() {

    describe("alpha", function() {

    });

    describe("alpha_numeric", function() {

    });
    
    describe("integer", function() {

    });
    
    describe("number", function() {

    });
    
    describe("card", function() {

    });
    
    describe("cvv", function() {

    });

    describe("email", function() {

    });

    describe("url", function() {

    });

    describe("domain", function() {

    });

    describe("datetime", function() {

    });
    
    describe("date", function() {

    });
    
    describe("time", function() {

    });
    
    describe("dateISO", function() {

    });
    
    describe("month_day_year", function() {

    });
    
    describe("day_month_year", function() {

    });
    
    describe("color", function() {

    });

    describe("custom regex", function() {

    });

  });
  
});

