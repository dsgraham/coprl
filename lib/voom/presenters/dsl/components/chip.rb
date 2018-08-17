require_relative 'icon_base'
require_relative 'mixins/event'
require_relative 'mixins/tooltips'

module Voom
  module Presenters
    module DSL
      module Components
        class Chip < EventBase
          include Mixins::Tooltips
          attr_reader :icons, :color, :name, :value
          
          def initialize(**attribs_, &block)
            super(type: :chip,
                  context: context,
                  **attribs_, &block)
            @icons = []
            self.text(attribs.delete(:text)) if attribs.key?(:text)
            self.icon(attribs.delete(:icon)) if attribs.key?(:icon)
            @color = attribs.delete(:color)
            @name = attribs.delete(:name)
            @value = attribs.delete(:value)
            expand!
          end

          def text(*text, **attribs, &block)
            return @text if locked?
            @text = Components::Typography.new(parent: self, type: :text, text: text, context: context, **attribs, &block)
          end

          def icon(icon=nil, **attribs, &block)
            @icons << Icon.new(parent: self, icon: icon,
                               context: context,
                               **attribs, &block)
          end

          def menu(**attributes, &block)
            return @menu if locked?
            @menu = Components::Menu.new(parent: self, context: context, **attributes, &block)
          end
          
          class Icon < Components::IconBase

            def initialize(**attribs_, &block)
              super(context: context,
                    **attribs_, &block)
              @position = [:left] if position.empty?
              expand!
            end
          end
        end
      end
    end
  end
end
