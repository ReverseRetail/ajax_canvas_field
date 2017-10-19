# AjaxCanvasField


## Installation

Add this line to your application's Gemfile:

```ruby
gem 'ajax_canvas_field'
```

And then execute:
```shell
$ bundle
```
Or install it yourself as:
```shell
$ gem install ajax_canvas_field
```

##### After bundle
```shell
$ rails g ajax_canvas_field
```
This add the following:
* `initializers/ajax_canvas_field.rb`
```ruby
AjaxCanvasField.configure(default_height: 400,
                            default_width: 400,
                            default_left_color: '#ff0000',
                            default_middle_color: '#00ff00',
                            default_right_color: '#0000ff')
```

* `assets/javascripts/application.js`
```js
//= require ajax_canvas_field
```

* `assets/stylesheets/application.scss`
  `assets/stylesheets/application.scss.erb`
  `assets/stylesheets/application.css.scss`
```sass
*= require ajax_canvas_field
```

## Usage
This Gem provides you with some View-Helper for Rails

1. `canvas_field`
Provides the main canvas_field with id: #canvas_field
```ruby
# options
:namespace # URL Namespace for ajax-POST e.g. 'api/v1'
:controller # URL Controller for ajax-POST e.g. 'canvas_fields'
:background_url # File-Path for background image
```

1. `canvas_data_field(active)`
Provides a data-Field for different datasets
```ruby
# args
:active (bool) # Is this the active data field?
# options
:additional_data # Additional Data to provide to the AJAX-POST
:initial_data # The Initial-Data that is loaded
:content # Symbol that appears in the Dot
```
1. `canvas_legend_field`
Renders a Legend Table for the Field
```ruby
# options
:left_text # Text for left Click
:middle_text # Text for middle Click
:right_text # Text for right Click
:left_color # Color for left Click e.g. '#ffff00'
:middle_color # Color for middle Click e.g. '#ffff00'
:right_color # Color for right Click e.g. '#ffff00'
:no_icon # Hide Mouse-Icon-Row
:no_header # Hide Header
```
1. `ro_canvas_field`
Provides readonly canvas_fields with class: .canvas_field, for showing the results of all datasets on one Page
```ruby
# options
:background_url # File-Path for background image
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/datyv/ajax_canvas_field. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
