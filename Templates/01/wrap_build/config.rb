require 'lib/lorem'
require 'lib/number_helper'
require 'lib/sidebar_helper'
require 'lib/id_helper'
require 'lib/panel_helper'
require 'lib/assets_helper'
require 'lib/jump_to_helper'
require 'active_support/all'
require 'css_splitter/splitter'
require 'css_splitter/sprockets_engine'

###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
page 'doc/*', layout: :docs
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###
helpers ::NumberHelper
helpers ::SidebarHelper
helpers ::IdHelper
helpers ::PanelHelper
helpers ::AssetsHelper
helpers ::JumpToHelper

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# activate :livereload
activate :livereload

# use bower for frontend package management
activate :bower

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

set :debug_assets, true

ready do
  sprockets.register_bundle_processor 'text/css', CssSplitter::SprocketsEngine
end

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment

  if ENV['EMERALD_BUILD'] == 'DEPLOY'
    activate :minify_css
    activate :minify_javascript
    activate :gzip
  end

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets
  activate :relative_assets
  set :relative_links, true
  set :debug_assets, false

  @polyfilter_demo_url = '/themes/emerald/polyfills/filters/'

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
