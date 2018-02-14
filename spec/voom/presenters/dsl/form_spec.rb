require 'spec_helper'

describe 'dsl' do
  describe 'form' do
    before do
      load_presenters('presenters', spec_dir)
    end

    after do
      reset_presenters!
    end

    let(:pom) {Voom::Presenters[:form1].call.render(router: nil, context: {})}
    let(:form) {pom.components.first}
    describe 'type' do
      it 'text' do
        expect(form.fields[:firstname].type).to eq(:text)
      end
      it 'hidden' do
        expect(form.fields[:ssn].type).to eq(:hidden)
      end
      it 'button' do
        expect(form.actions.first.type).to eq(:button)
      end
    end
  end
end