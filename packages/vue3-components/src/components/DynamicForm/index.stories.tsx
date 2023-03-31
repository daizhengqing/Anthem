import DynamicForm from './index';
// import type { Props } from './index';

import { Meta, StoryFn } from '@storybook/vue3'

export default {
  title: 'Example/DynamicForm',
  component: DynamicForm,
} as Meta<typeof DynamicForm>

const Template: StoryFn<typeof DynamicForm> = (args) => ({
  components: { DynamicForm },
  setup () {
    return {args}
  },
  template: '<DynamicForm v-bind=args" />'
})

export const Normal = Template.bind({});
Reflect.set(Normal, 'args', {
  form: {
    name: 'John',
    age: 18
  },
  formItems: [
    { prop: 'name', type: 'input', label: 'Name' },
    { prop: 'age', type: 'input', label: 'Age' }
  ]
})