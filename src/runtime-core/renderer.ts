import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  //patch
  patch(vnode, container);
}

export function patch(vnode, container) {
  // 如果是element类型，那么type是"div"这种字符串
  // 如果是组件类型，那么type是组件对象
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    // 处理组件
    processComponent(vnode, container);
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  // 创建元素
  const el = document.createElement(vnode.type);

  //处理props
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }

  //处理children,有string和array两种情况
  const { children } = vnode;
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  container.append(el);
}

function mountChildren(vnode, container) {
  //因为不知道children是element还是组件，所以遍历children，调用patch进行处理
  vnode.children.forEach(child => {
    patch(child, container);
  });
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  // 初始化组件
  setupComponent(instance);
  // 设置渲染有关的副作用函数
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const { proxy } = instance;
  // 获取到render之后，直接调用，获取该组件内部要渲染的内容，也就是children
  const subTree = instance.render.call(proxy);
  // patch里面判断
  patch(subTree, container);
}
