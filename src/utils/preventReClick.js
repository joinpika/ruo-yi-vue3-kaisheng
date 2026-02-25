// Vue 3 版本 - 指令配置对象
const preventReClick = {
    mounted(el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 1500)
            }
        })
    }
}

export { preventReClick }