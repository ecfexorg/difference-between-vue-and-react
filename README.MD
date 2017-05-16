# React和Vue特性和书写差异

> Vue均使用ES6语法，主要以单文件组件为例，写法上优先使用缩写。
>
> React使用TS语法。

## 生命周期

* Vue

![vue-lifecyle](./images/vue-lifecycle.png)

* React

![react-lifecyle](./images/react-lifecycle.png)

## 入口&根实例

* Vue

```js
const app = new Vue({
  /* 选项 */
  render: (h) => h(App) // App为根组件
}).$mount('#app')
```

* React

```js
ReactDOM.render(
  <App/>, // App为根组件
  document.getElementById('app')
)
```

## 组件定义

* Vue

```js
// 定义组件构造器
var MyComponent = Vue.extend({/* 选项 */})

// 注册全局组件
Vue.component('my-component', {/* 选项 */})
```

```html
<!-- 单文件组件 -->
<template>
  <div class="my-component">hello</div>
</template>
<script>
  export default {
    /* 选项 */
  }
</script>
```

* React

```js
class Foo extends React.Component<{}, void> {
  render () {
    return <div className='foo'>hello</div>
  }
}
```

## 组件引用

* Vue

```html
<!-- 以单文件组件为例：Foo.js -->
<template>
  <div class="Foo">
    <!-- 必须小写，不能自闭合 -->
    <bar></bar>
  </div>
</template>
<script>
  // 引入组件
  import Bar from './Bar'

  export default {
    name: 'Foo',
    components: {Bar}
  }
</script>
```

* React

```js
import Bar from './Bar'

class Foo extends React.Component<{}, void> {
  render () {
    return (
      <div className='foo'>
        {/* 组件约定大写开头，可自闭合 */}
        <Bar/>
      </div>
    )
  }
}
```

## 组件内部状态

* Vue

```html
<template>
  <div class="foo">
    <p class='name'>{{name}}</p>
    <p class='age'>
      {{age}}
      <button @click="onAdd">add</button>
    </p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: 'Tom',
        age: 18
      }
    },
    methods {
      onAdd () {
        // 直接修改
        this.age++
      }
    }
  }
</script>
```

* React

```js
interface IFooState {
  name: string,
  age: number
}

class Foo extends React.Component<{}, IFooState> {
  state = {
    name: 'tom',
    age: 18
  }

  onAdd = () => {
    // 必须通过setState修改
    this.setState({
      age: this.state.age + 1
    })
  }

  render () {
    const {name, age} = this.state

    return (
      <div className='foo'>
        <p class='name'>{name}</p>
        <p class='age'>
          {age}
          <button onClick={this.onAdd}>add</button>
        </p>
      </div>
    )
  }
}
```

## 父子组件通讯

* Vue

```html
<!-- Parent.vue -->
<template>
  <div class="parent">
    <child name='tom' :age='18' @click="onAdd"></child>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        age: 18
      }
    },
    methods {
      onAdd () {
        this.age++
      }
    }
  }
</script>
```

```html
<!-- Child.vue -->
<template>
  <div class="child">
    <p class='name'>{{name}}</p>
    <p class='age'>
      {{age}}
      <button @click="onAdd">add</button>
    </p>
  </div>
</template>
<script>
  export default {
    props: {
      name: {type: String},
      age: {type: Number, default: 18}
    },
    methods {
      onAdd () {
        this.$emit('click')
      }
    }
  }
</script>
```

* React

```js

interface IChildProps {
  name: string,
  age?: number,
  onAdd?: () => void
}

class Child extends React.Component<IChildProps, void> {
  static defaultProps = {
    age = 18,
    onAdd: () => {}
  }

  render () {
    const {name, age} = this.props

    return (
      <div className='child'>
        <p class='name'>{name}</p>
        <p class='age'>
          {age}
          <button onClick={this.onAdd}>add</button>
        </p>
      </div>
    )
  }
}

interface IParentState {
  age: number
}

class Parent extends React.Component<{}, IParentState> {
  state = {
    age: 18
  }

  onAdd = () => {
    this.setState({
      age: this.state.age + 1
    })
  }

  render () {
    const {name, age} = this.state

    return (
      <div className='parent'>
        <Child name='Tom' age={18} onAdd={this.onAdd}></Child>
      </div>
    )
  }
}
```

## 模板/JSX语法

* Vue

```html
<!-- 可搭配其他模板语言，如Pug等 -->
<template>
  <!-- 变量 -->
  <div>{{name}}</div>
  <!-- 表达式 -->
  <div>{{ ok ? 'YES' : 'NO' }}</div>
  <!-- HTML -->
  <div v-html="rawHtml"></div>
  <!-- 属性：属性名必须小写（kebab-case） -->
  <div id="app"></div>
  <div :id="dynamicId"></div>
  <foo :task-count="18"></foo>
  <foo :class="['item', foo]"></foo>
  <foo :style="{'margin-top': '10px'}"></foo>
  <!-- 事件 -->
  <foo @action="onAction"></foo>
</template>
```

* React

```js
render () {
  return (
    <!-- 变量 -->
    <div>{name}</div>
    <!-- 表达式 -->
    <div>{ ok ? 'YES' : 'NO' }</div>
    <!-- HTML -->
    <div dangerouslySetInnerHTML={rawHtml}></div>
    <!-- 属性 -->
    <div id='app'></div>
    <div id={dynamicId}></div>
    <foo taskCount={18}></foo>
    <foo className={'item ' + foo}></foo>
    <foo style={{marginTop: 10}}></foo>
    <!-- 事件 -->
    <foo onAction="onAction"></foo>
  )
}
```

## 条件渲染

* Vue

```html
<template>
  <div v-if="foo">foo</div>
</template>

<template>
  <div v-if="foo">foo</div>
  <div v-else-if="bar">bar</div>
</template>

<template>
  <div v-if="foo">foo</div>
  <div v-else-if="bar">bar</div>
  <div v-else>other</div>
</template>
```

* React

```js
render () {
  return foo && <div>foo</div>
}

render () {
  return foo ? <div>foo</div> : <div>bar</div>
}

render () {
  return (
    { foo ? <div>foo</div>
      : bar
      ? <div>bar</div>
      : <div>other</div>
    }
  )
}
```

## 列表渲染

* Vue

```html
<template>
  <div class='list'>
    <div v-for="item in list" :key="item">{{item}}</div>
  </div>
</template>
```

* React

```js
render () {
  return (
    <div className='list'>
      {list.map((item) => <div key={item}>{item}</div>)}
    </div>
  )
}
```

```js
// 或者
render () {
  const items = list.map((item) => <div key={item}>{item}</div>)

  return (
    <div className='list'>
      {items}
    </div>
  )
}
```

## 表单&双向绑定

* Vue

```html
<!-- 表单 -->
<template>
  <form>
    <input v-model="name">
    <!--
      相当于以下的语法糖：
      <input v-bind:value="name" v-on:input="name = $event.target.value">
      在组件中相当于
      <foo v-bind:value="name" v-on:input="name = arguments[0]"></foo>
    -->
  </form>
</template>
<script>
  export default {
    data () {
      return {
        name: ''
      }
    }
  }
</script>
```

```html
<!-- Vue 2.3.0+ -->

<!-- Parent.vue -->
<template>
  <child :foo.sync="bar"></child>
  <!--
    sync只是语法糖，实际上拓展为：
    <child :foo="bar" @update:foo="val => bar = val"></child>
  -->
</template>

<!-- Child.vue -->
<script>
  export default {
    methods: {
      onChange () {
        this.$emit('update:foo', newValue)
      }
    }
  }
</script>
```

* React

```js
interface IFooState {
  name: string
}

class Foo extends React.Component<{}, IFooState> {
  onChange = (e) => {
    const name = e.target.value
    this.setState({name})
  }

  render () {
    const {value} = this.state

    return (
      <div>
        <input value={value} onChange={this.onChange}/>
      </div>
    )
  }
}
```

## 内容分发

* Vue

```html
<!-- Child -->
<template>
  <!-- 必须有根元素 -->
  <div class="child">
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>
<script>
  export default {}
</script>

<!-- Parent -->
<template>
  <div class="parent">
    <child>
      <p slot="header">header</p>
      <p>content</p>
      <p slot="footer">footer</p>
    </child>
  </div>
</template>
<script>
  import Child from './Child'
  export default {
    components: {Child}
  }
</script>
```

* React

```js
interface IChildProps {
  header?: React.Node,
  children?: React.Node,
  footer?: React.Node
}

class Child extends React.Component<IChildProps, void> {
  render () {
    const {header, children, footer} = this.props
    return (
      <div className='child'>
        {header}
        {children}
        {footer}
      </div>
    )
  }
}

class Parent extends React.Component<{}, void> {
  render () {
    return (
      <div className='parent'>
        <Child
          className='child'
          header='header'}
          footer={<p>footer</p>}>
          <p>content</p>
        </Child>
      </div>
    )
  }
}
```