require_relative 'common'

module Voom
  module Presenters
    module DSL
      module Components
        class Grid < Base
          attr_accessor :columns, :color

          def initialize(color: nil, **attribs_, &block)
            super(type: :grid, **attribs_, &block)
            @columns = []
            @color = h(color)
            expand!
          end

          def column(size, color: nil, **attribs, &block)
            @columns << Column.new(size: size, color: color,
                                   router: @router, context: @context,
                                   dependencies: @dependencies,
                                   helpers: @helpers, **attribs, &block)
          end

          class Column < Base
            include Components::Common
            attr_accessor :size, :color

            def initialize(**attribs_, &block)
              super(type: :column, **attribs_, &block)
              @size = attribs.delete(:size) || 1
              @color = attribs.delete(:color)
              expand!
            end
          end
        end
      end
    end
  end
end