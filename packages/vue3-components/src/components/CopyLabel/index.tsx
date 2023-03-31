import './style.css'

import { PropType } from 'vue';

export interface Props {
  text: PropType<string>
}

export default defineComponent({
  props: {
    text: { type: String as Props['text'], required: true, default: '' }
  },
  setup (props) {
    function copyText() {
      navigator.clipboard.writeText(props.text)
    }

    return (
      <div class="copy-label">
        <span>{props.text}</span>
        <el-icon on={{ click: copyText }} class="pl-1">
          <copy></copy>
        </el-icon>
      </div>
    )
  }
})