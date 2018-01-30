module AssetsHelper
  def javascripts(*sources)
    # loop through all sources and the dependencies and
    # output each as script tag in the correct order
    sources.map do |source|
      source_file_name = source.to_s

      dependencies_paths = if source_file_name.start_with?('//', 'http')
        # Don't touch external sources
        source_file_name
      else
        source_file_name << ".js" unless source_file_name.end_with?(".js")

        sprockets[source_file_name].to_a.map do |dependency|
          # if sprockets sees "?body=1" it only gives back the body
          # of the script without the dependencies included
          dependency.logical_path + "?body=1"
        end
      end
      dependencies_paths
    end.flatten.map { |source| asset_path(:js, source) }
  end
  
  def stylesheets(*sources)
    sources.map do |source|
      source_file_name = source.to_s

      dependencies_paths = if source_file_name.start_with?('//', 'http')
        # Don't touch external sources
        source_file_name
      else
        source_file_name << ".css" unless source_file_name.end_with?(".css")

        dependencies_paths = sprockets[source_file_name].to_a.map do |dependency|
          # if sprockets sees "?body=1" it only gives back the body
          # of the script without the dependencies included
          dependency.logical_path + "?body=1"
        end
      end

      dependencies_paths
    end.flatten.map { |source| asset_path(:css, source) }
  end
  
  def debug_assets=(v)
    @debug_assets = v
  end
  
  def debug_assets
    @debug_assets.nil? ? super : @debug_assets
  end
  
  def split_stylesheet_link_tag(*sources)
    options     = sources.extract_options!
    split_count = options.delete(:split_count) || 2

    sources.map do |source|
      split_sources = (2..split_count).map { |index| "#{source}_split#{index}" }
      split_sources << options

      old = self.debug_assets
      self.debug_assets = false
      stylesheet_link_tag_split = stylesheet_link_tag(*split_sources)
      self.debug_assets = old
      [
        stylesheet_link_tag(source, options),
        "<!--[if lte IE 9]>",
        stylesheet_link_tag_split,
        "<![endif]-->"
      ]
    end.flatten.join("\n").html_safe
  end
end