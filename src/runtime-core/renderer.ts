import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  //patch
  patch(vnode, container)
}

export function patch(vnode, container) {
  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)
  // 初始化组件
  setupComponent(instance)
  // 设置渲染有关的副作用函数
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  // 获取到render之后，直接调用，获取该组件内部要渲染的内容，也就是children
  const subTree = instance.render()
  // patch里面判断
  patch(subTree, container)
}
