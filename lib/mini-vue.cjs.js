'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    //TODO
    // initProps()
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    //执行setup获取返回值进行不同处理
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        // function Object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    //TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    // 进行初始化组件最终的操作（主要是获取render）
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const { Component } = instance.type;
    // 判断组件对象有没有定义render方法，如果有的话就直接复用
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    //patch
    patch(vnode);
}
function patch(vnode, container) {
    // 处理组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    // 初始化组件
    setupComponent(instance);
    // 设置渲染有关的副作用函数
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    // 获取到render之后，直接调用，获取该组件内部要渲染的内容，也就是children
    const subTree = instance.render();
    // patch里面判断
    patch(subTree);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //先转成vnode: component => vnode
            const vnode = createVNode(rootComponent);
            render(vnode);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
