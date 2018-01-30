module NumberHelper
  def number_to_delimited(number, options = {})
    options = options.symbolize_keys
    parts = number.to_s.split('.')
    parts[0].gsub!(/(\d)(?=(\d\d\d)+(?!\d))/, "\\1#{options[:delimiter]}")
    parts.join(options[:separator])
  end
end