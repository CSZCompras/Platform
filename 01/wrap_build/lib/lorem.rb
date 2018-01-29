require "pathname"

module Middleman::Extensions::Lorem::LoremObject
  class << self

    def avatars
      @@avatars ||= begin
        avatars = {}
        relative = File.join('images', 'faker', 'avatars')
        avatars_path = Middleman::Application.root_path.join('source', relative)
        Dir.entries(avatars_path).select {|f| !f.start_with?('.')}.each do |dir|
          avatars[dir] = []
          Dir.glob(File.join(avatars_path, dir, '/**/*.png')).each do |png|
            avatars[dir] << File.join('/', relative, dir, Pathname.new(png).basename.to_s).to_s
          end
        end
        avatars
      end
    end

    def avatar(res)
      res = res.to_s
      el = avatars[res].shift
      avatars[res] << el
      el
    end
    
    def person(res)
      relative = File.join("images", "faker", "persons", res.to_s)
      path = Middleman::Application.root_path.join("source", relative, "*.*")
      sample = Dir[path].sample
      basename = Pathname.new(sample).basename.to_s
      File.join("/", relative, basename).to_s
    end

    def number(digits)
      lower = 10 ** (digits - 1)
      upper = 10 ** (digits) - 1
      rand(lower..upper)
    end

    def digit
      rand(9)
    end
    
    # Get a placeholder date
    # @param [String] fmt
    # @return [String]
    def time
      y = Date.today.year
      m = rand(12) + 1
      d = rand(31) + 1
      Time.local(y,m,d)
    end
  end
end
