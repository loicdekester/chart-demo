import { shallowMount } from '@vue/test-utils';
import AlertVue from '@/components/Alert';

describe('Alert.vue', () => {
  it('should display the message passed as a prop', () => {
    const wrapper = shallowMount(AlertVue, {
      propsData: {
        message: `Random error message`
      }
    });
    expect(wrapper.find('#error-message').text()).toEqual('Random error message');
  });
});
