module AjaxCanvasField #:nodoc:
  module Rails #:nodoc:
    class Engine < ::Rails::Engine
      initializer 'ajax_canvas_field.assets.precompile' do |app|
        %w(stylesheets javascripts images).each do |sub|
          app.config.assets.paths << root.join('app/assets', sub).to_s
        end
        app.config.assets.precompile += %w( mouse_left.png mouse_right.png mouse_middle.png )
      end
    end
  end
end
