import { render } from './renderer'
import { createVNode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      //先转成vnode: component => vnode
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer)
    },
  }
} 

