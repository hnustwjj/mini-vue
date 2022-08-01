export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  };
  return component;
}

export function setupComponent(instance) {
  //TODO
  // initProps()
  // initSlots

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  //执行setup获取返回值进行不同处理
  const Component = instance.type;

  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        const { setupState } = instance;
        if (key in setupState) {
          return setupState[key];
        }
      },
    }
  );
  const { setup } = Component;
  if (setup) {
    // function Object
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  //TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  // 进行初始化组件最终的操作（主要是获取render）
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  // 判断组件对象有没有定义render方法，如果有的话就直接复用
  if (Component.render) {
    instance.render = Component.render;
  }
}
