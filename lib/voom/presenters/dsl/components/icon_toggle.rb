module Voom
  module Presenters
    module DSL
      module Components
        class IconToggle < ToggleBase
          attr_accessor :icon
          def initialize(**attribs_, &block)
            super(type: :icon_toggle, **attribs_, &block)
            @icon = attribs.delete(:icon)
            expand!
          end
        end
      end
    end
  end
end