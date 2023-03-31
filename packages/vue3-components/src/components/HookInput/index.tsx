import type { PropType } from 'vue'

export interface Props {
  hook: { url: string; method: string }
}

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<Props['hook']>,
      default() {
        return { method: '', url: '' }
      }
    }
  },
  setup(props, { emit, attrs }) {
    const url = computed({
      get() {
        return props.modelValue.url
      },
      set(v) {
        emit('update:modelValue', { ...props.modelValue, url: v })
      }
    })

    const method = computed({
      get() {
        return props.modelValue.method
      },
      set(v) {
        emit('update:modelValue', { ...props.modelValue, method: v })
      }
    })

    const methods = [
      { label: 'GET', value: 'get' },
      { label: 'POST', value: 'post' },
      { label: 'PUT', value: 'put' },
      { label: 'UPDATE', value: 'update' },
      { label: 'DELETE', value: 'delete' }
    ]

    return () => {
      return (
        <el-input {...attrs} v-model={url.value}>
          {{
            prepend: () => (
              <el-select v-model={method.value} placeholder="Method" style="width: 95px">
                {methods.map(({ label, value }) => {
                  return <el-option label={label} value={value} />
                })}
              </el-select>
            )
          }}
        </el-input>
      )
    }
  }
})
