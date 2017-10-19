# frozen_string_literal: true

module CanvasFieldHelper
  def canvas_field(options = {})
    url = '/'
    url += options[:namespace].to_s + '/' if options[:namespace]
    url += options[:controller] || 'canvas_fields'

    background_url = options[:background_url].blank? ? '' : "url(#{options[:background_url]})"
    background = "background: #fff #{background_url} no-repeat center top"
    failure_message = 'Your browser does not support the canvas element.'

    content_tag :canvas, failure_message, id: :canvas_field, data: collect_data(url, options), style: background
  end

  def canvas_data_field(active = false, options = {})
    klass = active ? 'active' : ''
    data = { additional_data: options[:additional_data].to_json,
             initial_data: options[:initial_data].to_json,
             content: options[:content] || '' }
    content_tag(:span, '', class: "#{klass} canvas_data_field", data: data)
  end

  def canvas_legend_field(options = {})
    locals = {
      left_text: options[:left_text] || '',
      middle_text: options[:middle_text] || '',
      right_text: options[:right_text] || '',
      left_color: options[:left_color] || '#ff0000',
      middle_color: options[:middle_color] || '#00ff00',
      right_color: options[:right_color] || '#0000ff',
      no_icon: options[:no_icon] || false,
      no_header: options[:no_header] || false
    }
    render partial: 'ajax_canvas_field/canvas_legend', locals: locals
  end

  def ro_canvas_field(options = {})
    background_url = options[:background_url].blank? ? '' : "url(#{options[:background_url]})"
    background = "background: #fff #{background_url} no-repeat center top"
    failure_message = 'Your browser does not support the canvas element.'

    content_tag :canvas, failure_message, data: collect_ro_data(options), style: background, class: 'canvas_field'
  end

  private

  def collect_data(url, options)
    { url: url,
      strong_param: options[:param] || options[:controller]&.singularize || 'canvas_field',
      token: options[:token],
      width: options[:width] || AjaxCanvasField.config[:default_width],
      height: options[:height] || AjaxCanvasField.config[:default_height],
      left_color: options[:left_color] || '#ff0000',
      middle_color: options[:middle_color] || '#00ff00',
      right_color: options[:right_color] || '#0000ff' }
  end

  def collect_ro_data(options)
    { width: options[:width] || AjaxCanvasField.config[:default_width],
      height: options[:height] || AjaxCanvasField.config[:default_height],
      left_color: options[:left_color] || '#ff0000',
      middle_color: options[:middle_color] || '#00ff00',
      right_color: options[:right_color] || '#0000ff',
      initial_data: options[:initial_data].to_json }
  end
end
