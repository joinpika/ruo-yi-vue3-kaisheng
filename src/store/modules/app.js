import Cookies from 'js-cookie'

const useAppStore = defineStore(
  'app',
  {
    state: () => ({
      sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false,
        hide: false
      },
      device: 'desktop',
      size: Cookies.get('size') || 'default'
    }),
    getters: {
      // 直接在这里定义，不需要单独文件
      sidebar: (state) => state.sidebar,
      size: (state) => state.size,
      device: (state) => state.device
    },
    actions: {
      toggleSideBar(withoutAnimation) {
        if (!this.sidebar || this.sidebar.hide) {
          return false
        }
        this.sidebar.opened = !this.sidebar.opened
        this.sidebar.withoutAnimation = withoutAnimation
        if (this.sidebar.opened) {
          Cookies.set('sidebarStatus', 1)
        } else {
          Cookies.set('sidebarStatus', 0)
        }
      },
      closeSideBar({ withoutAnimation } = {}) {
        Cookies.set('sidebarStatus', 0)
        if (this.sidebar) {
          this.sidebar.opened = false
          this.sidebar.withoutAnimation = withoutAnimation
        }
      },
      toggleDevice(device) {
        this.device = device
      },
      setSize(size) {
        this.size = size
        Cookies.set('size', size)
      },
      toggleSideBarHide(status) {
        if (this.sidebar) {
          this.sidebar.hide = status
        }
      }
    }
  })

export default useAppStore
