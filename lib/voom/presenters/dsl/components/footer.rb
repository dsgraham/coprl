module Voom
  module Presenters
    module DSL
      module Components
        class Footer < Base
          attr_accessor :footer_type, :menus

          def initialize(type: nil, **attribs_, &block)
            @footer_type = h(type) ||  :small
            super(type: :footer, **attribs_, &block)
            @menus = []
            expand!
          end

          def menu(title=nil, **attribs, &block)
            return @menus if frozen?
            @menus << Menu.new(title,router: @router, context: @context,
                             dependencies: @dependencies,
                             helpers: @helpers, **attribs, &block)
          end

        end
      end
    end
  end
end