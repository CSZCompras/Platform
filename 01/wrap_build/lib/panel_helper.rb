module PanelHelper
  OPTIONS = {
    kind: 'panel-default',
    actions: 'hover'
  }
  def panel(title, options = {}, &block)
    options = options.reverse_merge(
      title: title,
      content: capture_html(&block)
    ).reverse_merge(OPTIONS)
    concat partial('htmls/panels/panel', locals: options)
  end

  def gradient_panel(title, options = {}, &block)
    options = options.reverse_merge(
        title: title,
        content: capture_html(&block)
    ).reverse_merge(OPTIONS)
    concat partial('htmls/panels/gradient_panel', locals: options)
  end
end