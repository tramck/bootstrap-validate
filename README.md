### Via data attributes

Add `data-spy="validate"` to the `<form>` element you would like to add validation to. Add `required` to any `.form-control` element that you want to require. 

```
<form role="form" data-spy="validate">
  <div class="form-group">
    <label for="exampleEmail">Email address</label>
    <input type="email" class="form-control" id="exampleEmail" placeholder="Enter email" required data-pattern="email">
  </div>
</form>
```
### Via JavaScript

<script>
  
  $('form').validate({
    rules: {
      '#exampleEmail': 'email',
      'selector': {
        pattern: /pattern/,
        message: 'error message'
      }
    }
  });

</script>