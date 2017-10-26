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
    locals = { no_icon: (options[:no_icon] || false), no_header: (options[:no_header] || false) }
    %w[left middle right].each do |side|
      locals["#{side}_text".to_sym] = options["#{side}_text"] || ''
      locals["#{side}_initial".to_sym] = options["#{side}_initial"] || ''
      locals["#{side}_color".to_sym] = options["#{side}_color"] || '#ff0000'
      locals["#{side}_active".to_sym] = options["#{side}_active"] || false
    end
    render partial: 'ajax_canvas_field/canvas_legend', locals: locals
  end

  def ro_canvas_field(options = {})
    data = collect_ro_data(options)
    background_url = options[:background_url].blank? ? '' : "url(#{options[:background_url]})"
    background = "background: #fff #{background_url} no-repeat center top"
    if options[:half_size]
      data[:width] = data[:width] / 2
      data[:height] = data[:height] / 2
      background += "; background_size: #{data[:width]}px #{data[:height]}px"
    end
    failure_message = 'Your browser does not support the canvas element.'

    content_tag :canvas, failure_message, data: data, style: background, class: 'canvas_field'
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
      right_color: options[:right_color] || '#0000ff',
      left_active: options[:left_active] || false,
      middle_active: options[:middle_active] || false,
      right_active: options[:right_active] || false }
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
