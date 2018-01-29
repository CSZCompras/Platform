module JumpToHelper
  def grid_of(objects, options = { cols: 3 }, &block)
    cols = options[:cols]
    out = ''
    i = 0
    objects.each do |k, v|
      if i % cols == 0
        out << '<div class="row text-center vpadded-row">'
      end
      out << capture { block.call(k, v) }
      if i % cols == cols - 1
        out << '</div>'
      end
      i = i + 1
    end
    if objects.length % cols != cols
      out << '</div>'
    end
    concat out.html_safe
  end
end