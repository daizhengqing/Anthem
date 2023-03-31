import type { ElForm } from 'element-plus'
type FormInstance = InstanceType<typeof ElForm>

import type { PropType } from 'vue'

export interface FormItem {
  prop: string
  type: 'readonly' | 'input' | 'select' | 'switch' | 'checkbox' | 'radio' | 'time' | 'date' | 'custom'
  label?: string
  labelPosition?: FormInstance['labelPosition']
  labelWidth?: FormInstance['labelWidth']
  showMessage?: FormInstance['showMessage']
  options?: {
    label?: string
    name?: string
    value: any
  }[]
  formInputProperties?: {}
  formInputEventListener?: {}
  ref?: string
  component?: any
  show?: (form: any) => boolean
}

export interface Props {
  formItems: PropType<FormItem[]>
  labelPosition?: PropType<FormInstance['labelPosition']>
  labelWidth?: PropType<FormInstance['labelWidth']>
  rules?: PropType<FormInstance['rules']>
  value: PropType<{}>
  useDialog?: PropType<boolean>
  dialogAttrs?: PropType<{}>
  visible?: PropType<boolean>
  resetOnClose?: PropType<boolean>
  loading?: PropType<boolean>
}

export default defineComponent({
  name: 'DynamicForm',
  props: {
    formItems: {
      type: Array as Props['formItems'],
      required: true,
      default() {
        return []
      }
    },
    labelPosition: { type: String as Props['labelPosition'], default: 'top' },
    labelWidth: { type: String as Props['labelWidth'] },
    rules: {
      type: Object as Props['rules'],
      default() {
        return {}
      }
    },
    modelValue: {
      type: Object as Props['value'],
      required: true,
      default() {
        return {}
      }
    },
    useDialog: { type: Boolean as Props['useDialog'], default: false },
    dialogAttrs: {
      type: Object as Props['dialogAttrs'],
      default() {
        return {}
      }
    },
    visible: { type: Boolean as Props['visible'], default: false },
    resetOnClose: { type: Boolean as Props['resetOnClose'], default: true },
    loading: { type: Boolean as Props['loading'], default: false }
  },
  emits: ['update:modelValue', 'update:visible'],
  setup(props, { emit, expose, slots }) {
    const formRef: Ref<FormInstance | null> = ref(null)

    const form: Ref<Record<string, any>> = computed({
      get() {
        return props.modelValue
      },
      set(v) {
        emit('update:modelValue', { ...v })
      }
    })

    watch(
      () => props.visible,
      (nv) => {
        if (nv === false && props.resetOnClose === true) formRef?.value?.resetFields?.()
      }
    )

    async function validate() {
      return await formRef?.value?.validate?.()
    }

    expose({
      validate
    })

    function generateFormItem(item: FormItem) {
      const fn = Reflect.get(formItemRenderer, item.type) ?? (() => (<div>error type</div>))

      return fn(item)
    }

    const formItemRenderer = {
      readonly: (item: FormItem) => <span>{form.value[item.prop]}</span>,
      input: (item: FormItem) => <el-input {...(item.formInputProperties ?? {})} v-model={form.value[item.prop]}></el-input>,
      select: (item: FormItem) => {
        return (
          <el-select {...item.formInputProperties} v-model={form.value[item.prop]}>
            {(item.options ?? []).map((option) => (
              <el-option label={option.label} value={option.value}></el-option>
            ))}
          </el-select>
        )
      },
      switch: (item: FormItem) => <el-switch {...(item.formInputProperties ?? {})} v-model={form.value[item.prop]}></el-switch>,
      checkbox: (item: FormItem) => {
        return (
          <el-checkbox {...(item.formInputProperties ?? {})} v-model={form.value[item.prop]}>
            {(item.options ?? []).map((option) => (
              <el-checkbox label={option.label} name={option.name}></el-checkbox>
            ))}
          </el-checkbox>
        )
      },
      radio: (item: FormItem) => {
        return (
          <el-radio-group {...(item.formInputProperties ?? {})} v-model={form.value[item.prop]}>
            {(item.options ?? []).map((option) => (
              <el-radio label={option.label}></el-radio>
            ))}
          </el-radio-group>
        )
      },
      time: (item: FormItem) => <el-time-picker {...(item.formInputProperties ?? {})} v-model={form.value[item.prop]}></el-time-picker>,
      date: (item: FormItem) => <el-date-picker {...(item.formInputProperties ?? {})} v-model={form.value[item.prop]}></el-date-picker>,
      custom: (item: FormItem) => (
        <item.component ref={item.ref} {...(item.formInputProperties ?? {})} v-model={form.value[item.prop]}></item.component>
      )
    }

    return () => {
      const FormItemNodes = () =>
        (props?.formItems ?? []).map((item) => {
          return item?.show?.(form.value) ?? true ? (
            <el-form-item
              prop={item.prop}
              label={item.label}
              labelPosition={item.labelPosition}
              labelWidth={item.labelWidth}
              showMessage={item.showMessage}
              style="width: 100%"
            >
              {generateFormItem(item)}
            </el-form-item>
          ) : null
        })

      const FormNode = () => (
        <div v-loading={props.loading}>
          <el-form ref={formRef} model={form} rules={props?.rules} labelPosition={props?.labelPosition} labelWidth={props?.labelWidth}>
            {FormItemNodes()}
          </el-form>
        </div>
      )

      const DialogNode = (node: JSX.Element) => {
        return (
          <el-dialog modelValue={props.visible} onUpdate:modelValue={(v: boolean) => emit('update:visible', v)} {...props.dialogAttrs}>
            {slots?.title?.()}
            {node}
            <div style="text-align:right">{slots?.footer?.()}</div>
          </el-dialog>
        )
      }

      return <div>{props.useDialog ? DialogNode(FormNode()) : FormNode()}</div>
    }
  }
})
