# frozen_string_literal: true

lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'ajax_canvas_field/rails/version'

Gem::Specification.new do |spec|
  spec.name          = 'ajax_canvas_field'
  spec.version       = AjaxCanvasField::Rails::VERSION
  spec.authors       = ['datyv']
  spec.email         = ['yvesgoizet@gmail.com']

  spec.summary       = 'HTML5 CanvasField Support'
  spec.description   = 'Add a CanvasField to point out errors in three different colors'
  spec.homepage      = ''

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = ''
  else
    raise 'RubyGems 2.0 or newer is required to protect against public gem pushes.'
  end

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = %w[app lib]

  spec.add_development_dependency 'bundler', '~> 1.15'
  spec.add_development_dependency 'rake', '~> 10.0'
end
