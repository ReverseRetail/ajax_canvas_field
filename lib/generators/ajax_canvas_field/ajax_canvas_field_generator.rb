require 'rails/generators/base'

class AjaxCanvasFieldGenerator < Rails::Generators::Base
  source_root File.expand_path("../templates", __FILE__)

  desc "Copy the initializer for AjaxCanvasField"
  def copy_initializer_file
    copy_file "initializer.rb", "config/initializers/ajax_canvas_field.rb"

    inject_into_file 'app/assets/javascripts/application.js', "//= require ajax_canvas_field\n", before: "//= require_tree ."
    inject_into_file 'app/assets/stylesheets/application.scss', " *= require ajax_canvas_field\n", before: " *= require_tree ."
  end
end
