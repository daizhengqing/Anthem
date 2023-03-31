import { PropType } from 'vue'

export interface Props {
  content: PropType<string>
  beforeRequest: PropType<() => Promise<boolean>>
  request: PropType<() => any>
  afterRequest: PropType<(data: any) => void>
}

export default defineComponent({
  name: 'Submitter',
  props: {
    content: { type: String as Props['content'], default: 'Submit' },
    beforeRequest: { type: Function as Props['beforeRequest'], default: () => () => {} },
    request: { type: Function as Props['request'], default: () => () => {} },
    afterRequest: { type: Function as Props['afterRequest'], default: () => () => {} }
  },
  setup(props, { attrs }) {
    const loading = ref(false)

    async function handleClick() {
      loading.value = true

      try {
        if ((await props.beforeRequest()) === false) return

        const res = await props.request()

        props.afterRequest(res)
      } catch (err) {
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    return () => {
      return (
        <el-button loading={loading.value} {...attrs} onClick={handleClick}>
          {props.content}
        </el-button>
      )
    }
  }
})
