// This file is automatically generated by Views and will be overwritten
// when the morpher runs. If you want to contribute to how it's generated, eg,
// improving the algorithms inside, etc, see this:
// https://github.com/viewstools/morph/blob/master/ensure-flow.js

import React, { useCallback, useContext, useEffect, useReducer } from 'react'

export let flowDefinition = new Map()
function getFlowDefinitionKey(key) {
  return key.replace(/\(.+?\)/g, '')
}
function isFlowKeyWithArguments(key) {
  return key.endsWith(')')
}
function getFlowKeyParent(key) {
  let bits = key.split('/')
  bits.pop()
  return bits.join('/')
}
function getFlowDefinition(key) {
  return flowDefinition.get(getFlowDefinitionKey(key))
}
function getViewsRelativeToDefinition(key, views) {
  return new Set([...views].map((id) => `${key}/${id}`))
}

let TOP_VIEW = '/App'

function ensureFirstViewIsOn(key, flow) {
  if (!flow.has(key)) return

  let view = getFlowDefinition(key)
  if (view.views.size === 0) return

  let index = 0
  let views = getViewsRelativeToDefinition(key, view.views)
  let canAdd = intersection(flow, views).size === 0
  for (let id of views) {
    if ((canAdd && index === 0) || !view.isSeparate) {
      flow.add(id)
    }
    index++
    ensureFirstViewIsOn(id, flow)
  }
}

function ensureParents(key, flow) {
  let view = getFlowDefinition(key)
  if (!view) {
    console.error({ type: 'views/flow/missing-parent', id: key })
    return
  }
  if (!view.parent) return

  // TODO try to improve this too
  // we can't use view.parent because it is static
  let [, ...bits] = key.split('/')
  bits.pop()
  let path = ''
  bits.forEach((item) => {
    path = `${path}/${item}`
    flow.add(path)
  })
  // flow.add(view.parent)
  // ensureParents(view.parent, flow)
}

function getAllChildrenOf(key, children) {
  if (!flowDefinition.has(key)) return

  let view = getFlowDefinition(key)
  let views = getViewsRelativeToDefinition(key, view.views)
  for (let id of views) {
    children.add(id)
    getAllChildrenOf(id, children)
  }
}

function getNextFlow(key, flow) {
  if (flow.has(key)) return flow

  let next = new Set([key])

  ensureFirstViewIsOn(key, next)
  ensureParents(key, next)

  let diffIn = difference(next, flow)
  let diffOut = new Set()

  difference(flow, next).forEach((id) => {
    let view = getFlowDefinition(id)
    if (!view) {
      console.debug({ type: 'views/flow/missing-view', id })
      diffOut.add(id)
      return
    }

    // (1) this is for the flow definition itself
    if (flow.has(view.parent)) {
      let parent = getFlowDefinition(view.parent)

      if (intersection(parent.views, diffIn).size > 0) {
        diffOut.add(id)
        let children = new Set()
        getAllChildrenOf(id, children)
        children.forEach((cid) => diffOut.add(cid))
      }
    }

    let viewParent = getFlowKeyParent(id)
    if (flow.has(viewParent)) {
      let parent = getFlowDefinition(viewParent)
      // remove last bit of () from key if present and ending with it
      let parentViews = getViewsRelativeToDefinition(viewParent, parent.views)
      // TODO if view has ending arguments, we may want to remove views without
      // the argument from the flow, eg /App/Todos/Todo(1) shouldn't have
      // /App/Todos/Todo. This will impact (1). Tools may need them though, so
      // let's explore it.
      if (intersection(parentViews, diffIn).size > 0) {
        diffOut.add(id)
        let children = new Set()
        getAllChildrenOf(id, children)
        children.forEach((cid) => diffOut.add(cid))
      }
    }
  })

  let nextFlow = new Set([...difference(flow, diffOut), ...diffIn])
  ensureFirstViewIsOn(TOP_VIEW, nextFlow)
  return new Set([...nextFlow].sort())
}

let MAX_ACTIONS = 10000
let SET = 'flow/SET'
let UNSET = 'flow/UNSET'

let Context = React.createContext([{ actions: [], flow: new Set() }, () => {}])
export let useFlowState = () => useContext(Context)[0]
export let useFlow = () => useFlowState().flow
export let useSetFlowTo = () => {
  let [, dispatch] = useContext(Context)
  return useCallback((id) => {
    dispatch({ type: SET, id })

    return () => dispatch({ type: UNSET, id })
  }, []) // eslint-disable-line
  // ignore dispatch
}

function getNextActions(state, id) {
  return [id, ...state.actions].slice(0, MAX_ACTIONS)
}

function reducer(state, action) {
  switch (action.type) {
    case SET: {
      if (process.env.NODE_ENV === 'development') {
        console.debug({ type: 'views/flow/set', id: action.id })

        let definitionKey = getFlowDefinitionKey(action.id)
        if (!flowDefinition.has(definitionKey)) {
          console.error({
            type: 'views/flow/invalid-view',
            id: action.id,
            flowDefinition,
          })
          return state
        }
      }

      if (state.actions[0] === action.id) {
        if (process.env.NODE_ENV === 'development') {
          console.debug({
            type: 'views/flow/already-set-as-last-action-ignoring',
            id: action.id,
            actions: state.actions,
          })
        }
        return state
      }

      return {
        flow: getNextFlow(action.id, state.flow),
        actions: getNextActions(state, action.id),
      }
    }

    case UNSET: {
      // You can't unset a view otherwise
      if (!isFlowKeyWithArguments(action.id)) return state

      console.debug({ type: 'views/flow/unset', id: action.id })

      return {
        flow: new Set(
          [...state.flow].filter((id) => !id.startsWith(action.id))
        ),
        // TODO not sure if we need to do something else with this
        actions: state.actions,
      }
    }

    default: {
      throw new Error(`Unknown action "${action.type}" in Flow`)
    }
  }
}

export function ViewsFlow(props) {
  let context = useReducer(reducer, { actions: [], flow: props.initialState })
  let [state] = context

  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(state)
    }
  }, [state]) // eslint-disable-line
  // ignore props.onChange

  return <Context.Provider value={context}>{props.children}</Context.Provider>
}

ViewsFlow.defaultProps = {
  initialState: new Set(),
}

export function normalizePath(viewPath, relativePath) {
  let url = new URL(`file://${viewPath}/${relativePath}`)
  return url.pathname
}

function intersection(a, b) {
  return new Set([...a].filter((ai) => b.has(ai)))
}
function difference(a, b) {
  return new Set([...a].filter((ai) => !b.has(ai)))
}
