require 'ostruct'

module SidebarHelper
  def sidebar_menu
    path = Middleman::Application.root_path.join("conf", "sidebar.yml")
    YAML.load_file(path)
  end

  def active_level_links(hash)

    hash.each do |k,v|
      if highlighted? [v['highlight'] || v['href']]
        links = [v]

        if v['children']
          links << active_level_links(v['children'])
        end

        return links.flatten
      end
    end
  end

  def highlighted?(rules)
    result = false

    rules.each do |rule|
      highlighted = true

      case rule
        when String
          highlighted &= '/' + request.path == rule
        when Proc
          h = instance_eval(&rule)
          unless (h.is_a?(TrueClass) || h.is_a?(FalseClass))
            raise 'proc highlighting rules must evaluate to TrueClass or FalseClass'
          end
          highlighted &= h
        when Regexp
          highlighted &= request.path.match(rule)
        else
          raise 'highlighting rules should be a String, Proc, Regexp or a Hash'
      end

      result |= highlighted
    end

    return result
  end
end
