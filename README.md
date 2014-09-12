### Via Data-API

Add `data-spy="validate"` to the `<form>` element you would like to add validation to.

```
<form role="form" data-spy="validate">
  <div class="form-group">
    <label for="exampleEmail">Email address</label>
    <input type="email" class="form-control" id="exampleEmail" placeholder="Enter email" required data-pattern="email">
  </div>
  <div class="form-group">
    <label for="exampleAlpha">Alpha</label>
    <input type="text" class="form-control" id="exampleAlpha" placeholder="Enter alpha" required data-pattern="alpha">
  </div>
  <div class="form-group">
    <label for="exampleCustom">Alpha</label>
    <input type="text" class="form-control" id="exampleCustom" placeholder="Enter custom" required data-pattern="/customregexpattern/" data-message="Please enter a valid custom!">
  </div>
</form>
```
### Via JavaScript

```
$('form').validate({
  rules: {
    '#exampleEmail': 'email',
    '#exampleAlpha': 'alpha',
    '#exampleCustom': {
      pattern: /customregexpattern/,
      message: 'Please enter a valid custom!'
    }
  }
});
```

### JavaScript Options

- `rules`: (type: `object`, default: `undefined`)An object of validation rules. Keys should be a string containing the input `id` (e.g. `'#exampleEmail'`), values can be a string of the built pattern to use (e.g. `'alpha_numeric'`) or an object containing `pattern` and `message` properties; within this object `pattern` should be a regular expression and message should be a string
  ```
  rules: {
    '#exampleEmail': 'email',
    '#exampleAlpha': 'alpha',
    '#exampleCustom': {
      pattern: /customregexpattern/,
      message: 'Please enter a valid custom!'
    }
  }
  ```
- `requiredMessage`: (type: `string`, default: `'This field is required.'`) The default required error message.
- `patterns`: (type: `object`, default: See Built-In Patterns section below) An object of rule objects, the key being the name of the rule, the value being an object containing `pattern` (regular expression) and `message` (string) properties.

### Built-In Patterns

The following pattern options are built-in to validate against:

- `alpha`
- `alpha_numeric`
- `integer`
- `number`
- `card`
- `cvv`
- `email`
- `url`
- `domain`
- `datetime`
- `date`
- `time`
- `date_iso`
- `month_day_year`
- `day_month_year`
- `color_hex`

### Custom Pattern & Error Messages

Custom patterns and messages can be defined via JavaScript (see JavaScript Options section) or using the data-api by setting the `data-pattern` attribute to a regular expression string, and `data-message` to a string:
```
<input type="text" class="form-control" id="exampleCustom" placeholder="Enter custom" required data-pattern="/customregexpattern/" data-message="Please enter a valid custom!">
```